/* eslint-disable @typescript-eslint/no-explicit-any */
import XLSX from "xlsx-js-style";
import dayjs from "dayjs";
import { Transaction, AccountStatement } from "../types";
import { toast } from "react-toastify";

const numVal = (v: any) => {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

// Reusable Styles
const headerStyle = {
  font: { sz: 14, bold: true, color: { rgb: "FFFFFF" } },
  fill: { fgColor: { rgb: "1E3A8A" } },
  alignment: { horizontal: "center", vertical: "center" },
};

const subHeaderStyle = {
  font: { sz: 10, bold: true, color: { rgb: "E2E8F0" } },
  fill: { fgColor: { rgb: "1E40AF" } },
  alignment: { horizontal: "center", vertical: "center" },
};

const sectionTitleStyle = {
  font: { sz: 11, bold: true, color: { rgb: "0F172A" } },
  fill: { fgColor: { rgb: "E2E8F0" } },
  alignment: { horizontal: "right", vertical: "center", readingOrder: 2 },
};

const tableHeaderStyle = (color: string) => ({
  font: { sz: 10, bold: true, color: { rgb: "FFFFFF" } },
  fill: { fgColor: { rgb: color } },
  alignment: { horizontal: "center", vertical: "center", wrapText: true, readingOrder: 2 },
  border: {
    top: { style: "thin", color: { rgb: "94A3B8" } },
    bottom: { style: "thin", color: { rgb: "94A3B8" } },
    left: { style: "thin", color: { rgb: "94A3B8" } },
    right: { style: "thin", color: { rgb: "94A3B8" } },
  },
});

const cellStyle = (isEven: boolean = false, align: string = "right") => ({
  font: { sz: 10, color: { rgb: "1E293B" } },
  fill: { fgColor: { rgb: isEven ? "F8FAFC" : "FFFFFF" } },
  alignment: { horizontal: align, vertical: "center", readingOrder: 2 },
  border: {
    top: { style: "thin", color: { rgb: "E2E8F0" } },
    bottom: { style: "thin", color: { rgb: "E2E8F0" } },
    left: { style: "thin", color: { rgb: "E2E8F0" } },
    right: { style: "thin", color: { rgb: "E2E8F0" } },
  },
});

const totalRowStyle = (bgColor: string, textColor: string) => ({
  font: { sz: 11, bold: true, color: { rgb: textColor } },
  fill: { fgColor: { rgb: bgColor } },
  alignment: { horizontal: "center", vertical: "center", readingOrder: 2 },
  border: {
    top: { style: "medium", color: { rgb: textColor } },
    bottom: { style: "medium", color: { rgb: textColor } },
    left: { style: "thin", color: { rgb: "CBD5E1" } },
    right: { style: "thin", color: { rgb: "CBD5E1" } },
  },
});

/**
 * Export a single transaction invoice to a beautifully styled Arabic Excel sheet
 */
export const exportTransactionToExcel = (
  transaction: Transaction,
  client?: AccountStatement
) => {
  try {
    const patches = transaction?.patches || [];
    const payments = transaction?.payments || [];

    const totalPatches = patches.reduce((sum, p) => sum + numVal(p.amount), 0);
    const totalPayments = payments.reduce((sum, p) => sum + numVal(p.price), 0);
    const balance = totalPatches - totalPayments;
    const isCreditor = balance >= 0;

    const invoiceCode = `INV-${String(transaction?.code || 1000).padStart(4, "0")}`;
    const invoiceDate = dayjs(transaction?.date || new Date()).format("YYYY/MM/DD");

    const wb = XLSX.utils.book_new();
    const rows: any[][] = [];

    // Row 0 & 1: Letterhead
    rows.push(["شـــــــطــــب لأعمال الديكور والتشطيبات المتكاملة", "", "", "", ""]);
    rows.push(["إشراف هندسي: م / حاتم الوكيل • هاتف: 01020696230", "", "", "", ""]);
    rows.push([]);

    // Row 3-5: Metadata
    rows.push(["مستند فاتورة معاملة", "", "", "رقم الفاتورة:", invoiceCode]);
    rows.push(["اسم المعاملة:", transaction?.title || "—", "", "تاريخ الفاتورة:", invoiceDate]);
    rows.push(["حالة المعاملة:", transaction?.status || "قيد التنفيذ", "", "كود العميل:", `#${client?.code || "—"}`]);
    rows.push(["اسم العميل:", client?.clientName || "—", "", "رقم الهاتف:", client?.phoneNumber || "—"]);
    rows.push(["العنوان:", client?.address || "—", "", "", ""]);
    rows.push([]);

    // Expenses Table
    const expensesStartRow = rows.length;
    rows.push(["جدول المصروفات والتكاليف المنفقة على المعاملة", "", "", "", ""]);
    rows.push(["م", "اسم البند / الصنف", "التكلفة (ج.م)", "التاريخ", "ملاحظات"]);

    if (payments.length > 0) {
      payments.forEach((p, idx) => {
        rows.push([
          idx + 1,
          p.name || "—",
          numVal(p.price),
          p.date ? dayjs(p.date).format("YYYY/MM/DD") : "—",
          p.notes || "—",
        ]);
      });
    } else {
      rows.push(["—", "لا توجد مصروفات مسجلة لهذه المعاملة", 0, "—", "—"]);
    }
    const expensesEndRow = rows.length - 1;
    rows.push(["", "إجمالي المصروفات والتكاليف:", totalPayments, "ج.م", ""]);
    const expensesTotalRow = rows.length - 1;
    rows.push([]);

    // Patches Table
    const patchesStartRow = rows.length;
    rows.push(["جدول الدفعات المستلمة من العميل", "", "", "", ""]);
    rows.push(["م", "مبلغ الدفعة (ج.م)", "التاريخ", "ملاحظات وطريقة الاستلام", ""]);

    if (patches.length > 0) {
      patches.forEach((p, idx) => {
        rows.push([
          idx + 1,
          numVal(p.amount),
          p.date ? dayjs(p.date).format("YYYY/MM/DD") : "—",
          p.notes || "—",
          "",
        ]);
      });
    } else {
      rows.push(["—", 0, "—", "لا توجد دفعات مستلمة مسجلة بعد", ""]);
    }
    const patchesEndRow = rows.length - 1;
    rows.push(["", "إجمالي الدفعات المستلمة:", totalPatches, "ج.م", ""]);
    const patchesTotalRow = rows.length - 1;
    rows.push([]);

    // Summary Section
    const summaryStartRow = rows.length;
    rows.push(["الملخص المالي للمعاملة", "", "", "", ""]);
    rows.push(["إجمالي المصروفات والتكاليف المنفقة:", "", "", `${totalPayments.toLocaleString()} ج.م`, ""]);
    rows.push(["إجمالي المقبوضات والدفعات المستلمة:", "", "", `${totalPatches.toLocaleString()} ج.م`, ""]);
    rows.push([
      isCreditor ? "الرصيد المتبقي للعميل (له / دائن):" : "المبلغ المتبقي على العميل (عليه / مدين):",
      "",
      "",
      `${Math.abs(balance).toLocaleString()} ج.م`,
      "",
    ]);

    if (transaction?.notes) {
      rows.push([]);
      rows.push(["ملاحظات المعاملة:", transaction.notes, "", "", ""]);
    }

    const ws = XLSX.utils.aoa_to_sheet(rows);

    // RTL and column widths
    ws["!views"] = [{ rightToLeft: true }];
    ws["!cols"] = [
      { wch: 10 },
      { wch: 34 },
      { wch: 22 },
      { wch: 20 },
      { wch: 36 },
    ];

    // Merges
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // Header 1
      { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, // Header 2
      { s: { r: expensesStartRow, c: 0 }, e: { r: expensesStartRow, c: 4 } },
      { s: { r: patchesStartRow, c: 0 }, e: { r: patchesStartRow, c: 4 } },
      { s: { r: summaryStartRow, c: 0 }, e: { r: summaryStartRow, c: 4 } },
      { s: { r: summaryStartRow + 1, c: 0 }, e: { r: summaryStartRow + 1, c: 2 } },
      { s: { r: summaryStartRow + 1, c: 3 }, e: { r: summaryStartRow + 1, c: 4 } },
      { s: { r: summaryStartRow + 2, c: 0 }, e: { r: summaryStartRow + 2, c: 2 } },
      { s: { r: summaryStartRow + 2, c: 3 }, e: { r: summaryStartRow + 2, c: 4 } },
      { s: { r: summaryStartRow + 3, c: 0 }, e: { r: summaryStartRow + 3, c: 2 } },
      { s: { r: summaryStartRow + 3, c: 3 }, e: { r: summaryStartRow + 3, c: 4 } },
    ];

    // Apply Styles to Cells
    const colLetters = ["A", "B", "C", "D", "E"];

    // Title
    ws["A1"].s = headerStyle;
    ws["A2"].s = subHeaderStyle;

    // Meta rows styling
    for (let r = 3; r <= 7; r++) {
      colLetters.forEach((col) => {
        const addr = `${col}${r + 1}`;
        if (ws[addr]) {
          const isLabel = col === "A" || col === "D";
          ws[addr].s = {
            font: { sz: 10, bold: isLabel, color: { rgb: isLabel ? "475569" : "0F172A" } },
            fill: { fgColor: { rgb: "F8FAFC" } },
            alignment: { horizontal: isLabel ? "right" : "left", vertical: "center", readingOrder: 2 },
          };
        }
      });
    }

    // Section Titles
    ws[`A${expensesStartRow + 1}`].s = sectionTitleStyle;
    ws[`A${patchesStartRow + 1}`].s = sectionTitleStyle;
    ws[`A${summaryStartRow + 1}`].s = sectionTitleStyle;

    // Expenses Table Header
    colLetters.forEach((col) => {
      const addr = `${col}${expensesStartRow + 2}`;
      if (ws[addr]) ws[addr].s = tableHeaderStyle("1E293B"); // Slate 800
    });

    // Expenses Data Rows
    for (let r = expensesStartRow + 2; r <= expensesEndRow; r++) {
      const isEven = r % 2 === 0;
      colLetters.forEach((col, idx) => {
        const addr = `${col}${r + 1}`;
        if (ws[addr]) {
          const align = idx === 0 || idx === 3 ? "center" : idx === 2 ? "left" : "right";
          ws[addr].s = cellStyle(isEven, align);
        }
      });
    }

    // Expenses Total Row
    colLetters.forEach((col) => {
      const addr = `${col}${expensesTotalRow + 1}`;
      if (ws[addr]) ws[addr].s = totalRowStyle("FFE4E6", "BE123C"); // Rose total
    });

    // Patches Table Header
    colLetters.forEach((col) => {
      const addr = `${col}${patchesStartRow + 2}`;
      if (ws[addr]) ws[addr].s = tableHeaderStyle("0F766E"); // Teal 700
    });

    // Patches Data Rows
    for (let r = patchesStartRow + 2; r <= patchesEndRow; r++) {
      const isEven = r % 2 === 0;
      colLetters.forEach((col, idx) => {
        const addr = `${col}${r + 1}`;
        if (ws[addr]) {
          const align = idx === 0 || idx === 2 ? "center" : idx === 1 ? "left" : "right";
          ws[addr].s = cellStyle(isEven, align);
        }
      });
    }

    // Patches Total Row
    colLetters.forEach((col) => {
      const addr = `${col}${patchesTotalRow + 1}`;
      if (ws[addr]) ws[addr].s = totalRowStyle("D1FAE5", "047857"); // Emerald total
    });

    // Summary Card styling
    const summaryColor = isCreditor ? "D1FAE5" : "FFE4E6";
    const summaryTextColor = isCreditor ? "047857" : "BE123C";

    ws[`A${summaryStartRow + 2}`].s = {
      font: { sz: 10, bold: true, color: { rgb: "475569" } },
      fill: { fgColor: { rgb: "F1F5F9" } },
      alignment: { horizontal: "right", vertical: "center", readingOrder: 2 },
    };
    ws[`D${summaryStartRow + 2}`].s = {
      font: { sz: 12, bold: true, color: { rgb: "BE123C" } },
      fill: { fgColor: { rgb: "F1F5F9" } },
      alignment: { horizontal: "center", vertical: "center", readingOrder: 2 },
    };

    ws[`A${summaryStartRow + 3}`].s = {
      font: { sz: 10, bold: true, color: { rgb: "475569" } },
      fill: { fgColor: { rgb: "F1F5F9" } },
      alignment: { horizontal: "right", vertical: "center", readingOrder: 2 },
    };
    ws[`D${summaryStartRow + 3}`].s = {
      font: { sz: 12, bold: true, color: { rgb: "047857" } },
      fill: { fgColor: { rgb: "F1F5F9" } },
      alignment: { horizontal: "center", vertical: "center", readingOrder: 2 },
    };

    ws[`A${summaryStartRow + 4}`].s = {
      font: { sz: 11, bold: true, color: { rgb: summaryTextColor } },
      fill: { fgColor: { rgb: summaryColor } },
      alignment: { horizontal: "right", vertical: "center", readingOrder: 2 },
    };
    ws[`D${summaryStartRow + 4}`].s = {
      font: { sz: 13, bold: true, color: { rgb: summaryTextColor } },
      fill: { fgColor: { rgb: summaryColor } },
      alignment: { horizontal: "center", vertical: "center", readingOrder: 2 },
    };

    wb.Workbook = { Views: [{ RTL: true }] };
    XLSX.utils.book_append_sheet(wb, ws, "فاتورة المعاملة");

    const safeTitle = (transaction?.title || "معاملة")
      .replace(/[\\/:*?"<>|]/g, "_")
      .trim();
    const fileName = `فاتورة-${safeTitle}-${invoiceCode}.xlsx`;

    XLSX.writeFile(wb, fileName);
    toast.success(`تم استخراج شيت إكسيل منسق واحترافي بنجاح`);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    toast.error("حدث خطأ أثناء تصدير شيت الإكسيل");
  }
};

/**
 * Export full client account statement to Excel with styling
 */
export const exportFullStatementToExcel = (
  client: AccountStatement,
  transactions: Transaction[],
  summary: any
) => {
  try {
    const rows: any[][] = [];

    rows.push(["شـــــــطــــب لأعمال الديكور والتشطيبات المتكاملة", "", "", "", "", "", "", ""]);
    rows.push(["كشف حساب عميل شامل • م / حاتم الوكيل (01020696230)", "", "", "", "", "", "", ""]);
    rows.push([]);

    rows.push(["اسم العميل:", client?.clientName || "—", "كود العميل:", `#${client?.code || "—"}`, "تاريخ الاستخراج:", dayjs().format("YYYY/MM/DD"), "", ""]);
    rows.push(["رقم الهاتف:", client?.phoneNumber || "—", "العنوان:", client?.address || "—", "الحالة:", client?.isActive === false ? "معطل" : "نشط", "", ""]);
    rows.push([]);

    // Summary Box
    rows.push(["ملخص إحصائيات الحساب", "", "", "", "", "", "", ""]);
    rows.push(["عدد المعاملات:", `${summary?.totalTransactions || 0} معاملة`, "إجمالي المقبوضات:", `${Number(summary?.grandTotalPatches || 0).toLocaleString()} ج.م`, "إجمالي المصروفات:", `${Number(summary?.grandTotalPayments || 0).toLocaleString()} ج.م`, "الصافي:", `${Number(Math.abs(summary?.grandBalance || 0)).toLocaleString()} ج.م ${summary?.isCreditor ? "(له)" : "(عليه)"}`]);
    rows.push([]);

    // Transactions Table
    const tableHeaderRow = rows.length;
    rows.push([
      "كود المعاملة",
      "اسم المعاملة / الخدمة",
      "التاريخ",
      "الحالة",
      "إجمالي المصروفات (ج.م)",
      "إجمالي الدفعات (ج.م)",
      "الصافي (ج.م)",
      "الموقف",
    ]);

    transactions.forEach((tx) => {
      const patchesSum = (tx.patches || []).reduce((s, p) => s + numVal(p.amount), 0);
      const paymentsSum = (tx.payments || []).reduce((s, p) => s + numVal(p.price), 0);
      const net = patchesSum - paymentsSum;

      rows.push([
        `#${tx.code || "—"}`,
        tx.title || "—",
        dayjs(tx.date).format("YYYY/MM/DD"),
        tx.status || "قيد التنفيذ",
        paymentsSum,
        patchesSum,
        Math.abs(net),
        net >= 0 ? "له" : "عليه",
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!views"] = [{ rightToLeft: true }];
    ws["!cols"] = [
      { wch: 14 },
      { wch: 32 },
      { wch: 16 },
      { wch: 14 },
      { wch: 22 },
      { wch: 22 },
      { wch: 18 },
      { wch: 12 },
    ];

    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
      { s: { r: 6, c: 0 }, e: { r: 6, c: 7 } },
    ];

    ws["A1"].s = headerStyle;
    ws["A2"].s = subHeaderStyle;
    ws["A7"].s = sectionTitleStyle;

    const cols = ["A", "B", "C", "D", "E", "F", "G", "H"];
    cols.forEach((c) => {
      const addr = `${c}${tableHeaderRow + 1}`;
      if (ws[addr]) ws[addr].s = tableHeaderStyle("1E3A8A");
    });

    for (let r = tableHeaderRow + 1; r < rows.length; r++) {
      const isEven = r % 2 === 0;
      cols.forEach((c, idx) => {
        const addr = `${c}${r + 1}`;
        if (ws[addr]) {
          const align = idx === 0 || idx === 2 || idx === 3 || idx === 7 ? "center" : idx === 4 || idx === 5 || idx === 6 ? "left" : "right";
          ws[addr].s = cellStyle(isEven, align);
        }
      });
    }

    const wb = XLSX.utils.book_new();
    wb.Workbook = { Views: [{ RTL: true }] };
    XLSX.utils.book_append_sheet(wb, ws, "كشف الحساب");

    const safeName = (client?.clientName || "عميل")
      .replace(/[\\/:*?"<>|]/g, "_")
      .trim();
    const fileName = `كشف-حساب-${safeName}.xlsx`;

    XLSX.writeFile(wb, fileName);
    toast.success(`تم استخراج كشف الحساب كملف إكسيل منسق بنجاح`);
  } catch (error) {
    console.error("Error exporting statement to Excel:", error);
    toast.error("حدث خطأ أثناء تصدير كشف الحساب");
  }
};
