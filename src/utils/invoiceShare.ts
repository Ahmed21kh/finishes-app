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
export const downloadInvoicePDF = (
  element: HTMLElement | null,
  fileName: string = "فاتورة"
) => {
  if (!element) {
    toast.error("عنصر الفاتورة غير جاهز للتحميل");
    return;
  }

  const opt = {
    margin: 8,
    filename: `${fileName}.pdf`,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
  };

  toast.info("جاري تجهيز وتحميل ملف الـ PDF...");
  html2pdf()
    .from(element)
    .set(opt)
    .save()
    .then(() => {
      toast.success("تم تحميل الفاتورة بصيغة PDF بنجاح 📄");
    })
    .catch((err: any) => {
      console.error("PDF export error:", err);
      toast.error("حدث خطأ أثناء حفظ ملف الـ PDF");
    });
};
