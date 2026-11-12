/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import { Transaction, AccountStatement } from "../types";
import { toast } from "react-toastify";
import html2pdf from "html2pdf.js";

/**
 * Format Egyptian phone number to international WhatsApp format (201xxxxxxxxx)
 */
export const formatWhatsAppNumber = (phone?: string): string => {
  if (!phone) return "";
  let clean = phone.replace(/[^\d+]/g, "");
  if (clean.startsWith("+")) clean = clean.substring(1);
  if (clean.startsWith("0")) {
    clean = "2" + clean;
  } else if (!clean.startsWith("2") && clean.length === 10) {
    clean = "20" + clean;
  }
  return clean;
};

/**
 * Send Transaction Invoice Summary via WhatsApp
 * Formatted with bulletproof, standard Arabic characters and WhatsApp Markdown
 */
export const sendTransactionViaWhatsApp = (
  transaction: Transaction,
  client?: AccountStatement
) => {
  const phone = formatWhatsAppNumber(client?.phoneNumber);

  const patches = transaction?.patches || [];
  const payments = transaction?.payments || [];

  const totalPatches = patches.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );
  const totalPayments = payments.reduce(
    (sum, p) => sum + (Number(p.price) || 0),
    0
  );
  const balance = totalPatches - totalPayments;
  const isCreditor = balance >= 0;

  const invoiceNum = `INV-${String(transaction?.code || 1000).padStart(4, "0")}`;
  const invoiceDate = dayjs(transaction?.date || new Date()).format("YYYY/MM/DD");

  const lines: string[] = [
    `السلام عليكم أستاذ/ة *${client?.clientName || "العميل العزيز"}*`,
    ``,
    `*مكتب شـــــطـــــب لأعمال الديكور والتشطيبات*`,
    `إشراف هندسي: م / حاتم الوكيل`,
    `═════════════════════════`,
    ``,
    `*تفاصيل فاتورة المعاملة:*`,
    `• *رقم الفاتورة:* ${invoiceNum}`,
    `• *اسم المعاملة:* ${transaction?.title || "—"}`,
    `• *تاريخ الفاتورة:* ${invoiceDate}`,
    `• *حالة المعاملة:* ${transaction?.status || "قيد التنفيذ"}`,
    ``,
    `═════════════════════════`,
    `*الملخص المالي للمعاملة:*`,
    `• *إجمالي المصروفات والتكاليف:* ${totalPayments.toLocaleString()} ج.م (${payments.length} بند)`,
    `• *إجمالي الدفعات المستلمة:* ${totalPatches.toLocaleString()} ج.م (${patches.length} دفعة)`,
    `• *الصافي المتبقي:* ${Math.abs(balance).toLocaleString()} ج.م ${
      isCreditor ? "(رصيد للعميل له)" : "(مبلغ متبقي على العميل)"
    }`,
    `═════════════════════════`,
  ];

  if (transaction?.notes && transaction.notes.trim()) {
    lines.push(`*ملاحظات:* ${transaction.notes.trim()}`);
    lines.push(``);
  }

  lines.push(`تم استخراج الفاتورة إلكترونياً عبر نظام شطب.`);
  lines.push(`لأي استفسار أو تفاصيل: 01020696230`);
  lines.push(`نسعد دائماً بخدمتكم.`);

  const message = lines.join("\n");

  const url = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
  toast.info(
    phone
      ? "تم فتح محادثة الواتساب مع العميل! يمكنك إرفاق ملف PDF أو الإكسيل بسهولة في المحادثة."
      : "تم تجهيز نص الفاتورة للواتساب. يرجى اختيار جهة الاتصال لإرسالها."
  );
};

/**
 * Download Printable Invoice Element directly as A4 PDF
 */
export const downloadInvoicePDF = async (
  element: HTMLElement | null,
  fileName: string = "فاتورة"
) => {
  if (!element) {
    toast.error("عنصر الفاتورة غير جاهز للتحميل");
    return;
  }

  // Ensure fonts (like Cairo) are completely ready before canvas capture
  if (document.fonts) {
    try {
      await document.fonts.ready;
    } catch (e) {
      // Continue if fonts.ready is not supported
    }
  }

  // Off-screen copy used only to measure the A4 layout. The PDF library
  // clones it into its own hidden layer, so this one must stay invisible.
  const host = document.createElement("div");
  host.dir = "rtl";
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = [
    "position:fixed",
    "left:-10000px",
    "top:0",
    "width:194mm",
    "background:#ffffff",
    "opacity:0",
    "pointer-events:none",
    "z-index:-1",
    "overflow:visible",
  ].join(";");

  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = "100%";
  clone.style.maxWidth = "none";
  clone.style.margin = "0";
  clone.style.backgroundColor = "#ffffff";
  clone.style.boxShadow = "none";
  host.appendChild(clone);
  document.body.appendChild(host);

  const paintHeight = Math.max(clone.scrollHeight, clone.offsetHeight, 1);
  const scale = Math.min(2, 3600 / Math.max(clone.offsetWidth || 700, paintHeight));

  const opt = {
    margin: [8, 8, 8, 8] as [number, number, number, number],
    filename: `${fileName}.pdf`,
    image: { type: "jpeg" as const, quality: 0.92 },
    pagebreak: { mode: [] as string[] },
    html2canvas: {
      scale,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      scrollY: 0,
      scrollX: 0,
      onclone: (clonedDoc: Document) => {
        const style = clonedDoc.createElement("style");
        style.textContent = `
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-shadow: none !important;
            text-shadow: none !important;
            filter: none !important;
          }
        `;
        clonedDoc.head.appendChild(style);

        // html2canvas clips Arabic inside rounded badges (it measures a Latin
        // baseline, then cuts anything outside the radius). Flatten each badge
        // to one text node with room around the glyphs so the PDF matches
        // the on-screen preview.
        clonedDoc.querySelectorAll("[data-pdf-badge]").forEach((node) => {
          const badge = node as HTMLElement;
          const inner = badge.querySelector("span") as HTMLElement | null;
          const label = (badge.textContent || "").replace(/\s+/g, " ").trim();
          const color = inner?.style.color || badge.style.color || "#0f172a";
          const fontSize = inner?.style.fontSize || badge.style.fontSize || "14px";
          const bg = badge.style.backgroundColor || "#f8fafc";
          const border = badge.style.border && badge.style.border !== "" ? badge.style.border : "none";
          const dir = badge.getAttribute("dir");

          badge.replaceChildren(clonedDoc.createTextNode(label));
          if (dir) badge.setAttribute("dir", dir);

          badge.style.display = "inline-block";
          badge.style.width = "auto";
          badge.style.height = "auto";
          badge.style.backgroundColor = bg;
          badge.style.color = color;
          badge.style.border = border;
          badge.style.borderRadius = "8px";
          badge.style.fontSize = fontSize;
          badge.style.fontWeight = "700";
          badge.style.fontFamily = '"Cairo", sans-serif';
          badge.style.lineHeight = "1";
          badge.style.textAlign = "center";
          badge.style.whiteSpace = "nowrap";
          badge.style.overflow = "visible";
          badge.style.verticalAlign = "middle";
          badge.style.boxSizing = "content-box";
          badge.style.boxShadow = "none";
          // Canvas paints Arabic low in the chip, so keep less space above it.
          badge.style.padding = "4px 16px 12px";
        });
      },
    },
    jsPDF: {
      unit: "mm" as const,
      format: "a4" as const,
      orientation: "portrait" as const,
      compress: true,
    },
  };

  toast.info("جاري تجهيز وتحميل ملف الـ PDF بدقة عالية...");
  try {
    await html2pdf().from(clone).set(opt).save();
    toast.success("تم تحميل الفاتورة بصيغة PDF بنجاح 📄");
  } catch (err: any) {
    console.error("PDF export error:", err);
    toast.error("حدث خطأ أثناء حفظ ملف الـ PDF");
  } finally {
    host.remove();
  }
};
