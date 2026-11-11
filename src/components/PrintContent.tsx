/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  FacebookFilled,
  PhoneFilled,
  WhatsAppOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import ShatabLogoIcon from "./ShatabLogo";

export interface PrintProps {
  client?: any;
  invoice?: any;
  apartment?: any;
  showPrintContent?: boolean;
}

export const PrintContent = React.forwardRef<HTMLDivElement, PrintProps>(
  ({ client, invoice, apartment, showPrintContent }, ref) => {
    // If invoice is passed, we format an Invoice Document
    const isSingleInvoice = Boolean(invoice && invoice.items);

    // Account Statement calculations
    const totalPatches = Number(client?.totalPatches) || 0;
    const totalPayments = Number(client?.totalPayments) || 0;
    const netBalance = totalPatches - totalPayments;
    const isDebtor = netBalance < 0; // العميل عليه متبقي
    const isCreditor = netBalance > 0; // العميل له متبقي

    // Single Invoice calculations
    const invoicePayed = Number(invoice?.payedPatch) || 0;
    const invoiceTotalExpenses =
      Number(invoice?.totalPrice) ||
      (invoice?.items || []).reduce(
        (sum: number, it: any) => sum + (Number(it.price) || 0),
        0
      );
    const invoiceRemaining =
      invoice?.remainingAmount !== undefined
        ? Number(invoice.remainingAmount)
        : invoicePayed - invoiceTotalExpenses;

    const patches = client?.patches || [];
    const payments = client?.payments || [];

    const issueDate = isSingleInvoice
      ? invoice?.date
      : client?.date || new Date();

    const formattedDate = issueDate
      ? new Date(issueDate).toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date().toLocaleDateString("ar-EG");

    return (
      <div
        ref={ref}
        dir="rtl"
        className={`w-full bg-white text-gray-900 font-cairo print-sheet ${
          showPrintContent ? "block" : "printContent"
        }`}
        style={{
          color: "#111827",
          backgroundColor: "#ffffff",
          fontSize: "13px",
          lineHeight: 1.5,
        }}
      >
        <style>{`
          @page {
            size: A4 portrait;
            margin: 0 !important; /* Removes browser print headers/footers (URL, page numbers, date) */
          }
          @media print {
            @page {
              size: A4 portrait;
              margin: 0 !important; /* Removes browser print headers/footers (URL, page numbers, date) */
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              color: #000000 !important;
              font-family: 'Cairo', sans-serif !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-sheet {
              width: 100% !important;
              max-width: 100% !important;
              padding: 12mm 10mm 15mm 10mm !important;
              margin: 0 auto !important;
              border: none !important;
              box-shadow: none !important;
            }
            a[href]:after {
              content: "" !important;
            }
            .no-print {
              display: none !important;
            }
            .page-break-inside-avoid {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
          }
        `}</style>

        <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto border border-gray-200 rounded-2xl shadow-sm print:border-none print:shadow-none print:p-0">
          {/* ================= LETTERHEAD ================= */}
          <div className="flex justify-between items-start border-b-2 border-gray-900 pb-5">
            {/* Company Branding */}
            <div className="flex items-center gap-3">
              <ShatabLogoIcon size={48} className="rounded-2xl shadow-md shrink-0" />
              <div>
                <h1 className="text-2xl font-black text-gray-900 m-0">
                  شــــــــطب
                </h1>
                <p className="text-xs font-bold text-blue-900 m-0">
                  لأعمال التشطيبات والديكور والمقاولات
                </p>
                <p className="text-xs font-semibold text-gray-600 m-0">
                  إشراف هندسي: م / حاتم الوكيل
                </p>
              </div>
            </div>

            {/* Document Title Center Badge */}
            <div className="text-center px-4 py-2 border-2 border-blue-900 rounded-xl bg-blue-50/40">
              <span className="block text-xs font-bold text-blue-900 uppercase">
                {isSingleInvoice
                  ? "فاتورة دفعة ومصروفات أعمال"
                  : "كشف حساب عميل معتمد"}
              </span>
              <span className="block text-sm font-black text-gray-900">
                {isSingleInvoice ? "INVOICE VOUCHER" : "STATEMENT OF ACCOUNT"}
              </span>
              <span className="block text-[11px] font-mono font-bold text-gray-600 mt-0.5">
                رقم المستند: #{isSingleInvoice ? invoice?.code : client?.code || "---"}
              </span>
            </div>

            {/* Contact Details */}
            <div className="text-left text-xs space-y-1 text-gray-700 font-medium">
              <div className="flex items-center gap-2 justify-end">
                <span dir="ltr" className="font-mono font-bold">
                  01020696230
                </span>
                <PhoneFilled className="text-blue-800 text-sm" />
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span dir="ltr" className="font-mono font-bold">
                  01020696230
                </span>
                <WhatsAppOutlined className="text-emerald-700 text-sm" />
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-[11px]">facebook.com/shatab.decor</span>
                <FacebookFilled className="text-blue-700 text-sm" />
              </div>
            </div>
          </div>

          {/* ================= CLIENT / PROJECT INFO BOX ================= */}
          <div className="bg-gray-50 border border-gray-300 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="text-gray-500 font-bold block text-xs">
                  السيد العميل:
                </span>
                <span className="text-gray-900 font-black text-base block">
                  {client?.clientName || client?.name || "غير محدد"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-gray-500 font-bold block text-xs">
                  {apartment?.address ? "عنوان الشقة:" : "الموقع / العنوان:"}
                </span>
                <span className="text-gray-900 font-semibold block">
                  {apartment?.address || client?.address || "غير مسجل"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-gray-500 font-bold block text-xs">
                  تاريخ الإصدار:
                </span>
                <span className="text-gray-900 font-semibold block">
                  {formattedDate}
                </span>
              </div>
            </div>

            {(client?.phoneNumber || invoice?.notes) && (
              <div className="mt-2.5 pt-2.5 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
                {client?.phoneNumber && (
                  <div>
                    <span className="font-bold">رقم الهاتف: </span>
                    <span dir="ltr" className="font-mono font-bold text-gray-900">
                      {client.phoneNumber}
                    </span>
                  </div>
                )}
                {invoice?.notes && (
                  <div>
                    <span className="font-bold">ملاحظات الفاتورة: </span>
                    <span className="text-gray-800">{invoice.notes}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ================= CASE A: SINGLE INVOICE ITEMS ================= */}
          {isSingleInvoice ? (
            <div className="space-y-4 page-break-inside-avoid">
              <div className="flex items-center justify-between border-b border-gray-200 pb-1">
                <h3 className="text-sm font-bold text-gray-900 m-0 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                  بنود المصروفات التابعة للدفعة رقم #{invoice?.code}
                </h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  قيمة الدفعة المسددة: {invoicePayed.toLocaleString("ar-EG")} ج.م
                </span>
              </div>

              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-900 font-bold border-b border-gray-300">
                      <th className="py-2.5 px-3 w-12 text-center">م</th>
                      <th className="py-2.5 px-3 font-bold">اسم الصنف / البند</th>
                      <th className="py-2.5 px-3 w-32">السعر (ج.م)</th>
                      <th className="py-2.5 px-3 w-32">التاريخ</th>
                      <th className="py-2.5 px-3">ملاحظات البند</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(invoice.items || []).map((it: any, idx: number) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                      >
                        <td className="py-2 px-3 text-center font-bold text-gray-600">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 font-bold text-gray-900">
                          {it.name}
                        </td>
                        <td className="py-2 px-3 font-bold text-blue-900 text-sm">
                          {Number(it.price).toLocaleString("ar-EG")} ج.م
                        </td>
                        <td className="py-2 px-3 font-medium text-gray-700">
                          {it.date
                            ? new Date(it.date).toLocaleDateString("ar-EG")
                            : "-"}
                        </td>
                        <td className="py-2 px-3 text-gray-600">
                          {it.itemNotes || "---"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-bold border-t border-gray-300">
                      <td colSpan={2} className="py-2.5 px-3 text-gray-900">
                        إجمالي المصروفات المنفذة بالدفعة:
                      </td>
                      <td
                        colSpan={3}
                        className="py-2.5 px-3 font-black text-blue-900 text-sm"
                      >
                        {invoiceTotalExpenses.toLocaleString("ar-EG")} ج.م
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Invoice Summary Box */}
              <div className="pt-2">
                <div className="border-2 border-gray-900 rounded-xl overflow-hidden bg-white">
                  <div className="bg-gray-900 text-white p-2.5 px-4 flex justify-between items-center">
                    <span className="font-black text-sm">ملخص حساب الفاتورة</span>
                    <span className="text-xs font-semibold text-gray-300">
                      INVOICE TOTALS
                    </span>
                  </div>

                  <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-200 bg-gray-50/50">
                    <div className="p-3 bg-white border border-gray-200 rounded-lg">
                      <span className="text-xs text-gray-500 block font-bold">
                        مبلغ الدفعة المسدد
                      </span>
                      <span className="text-lg font-black text-emerald-700 block mt-1">
                        {invoicePayed.toLocaleString("ar-EG")} ج.م
                      </span>
                    </div>

                    <div className="p-3 bg-white border border-gray-200 rounded-lg">
                      <span className="text-xs text-gray-500 block font-bold">
                        إجمالي التكاليف والمصروفات
                      </span>
                      <span className="text-lg font-black text-blue-800 block mt-1">
                        {invoiceTotalExpenses.toLocaleString("ar-EG")} ج.م
                      </span>
                    </div>

                    <div
                      className={`p-3 rounded-lg border-2 ${
                        invoiceRemaining < 0
                          ? "border-red-500 bg-red-50/70"
                          : "border-emerald-500 bg-emerald-50/70"
                      }`}
                    >
                      <span
                        className={`text-xs block font-bold ${
                          invoiceRemaining < 0
                            ? "text-red-700"
                            : "text-emerald-700"
                        }`}
                      >
                        {invoiceRemaining < 0
                          ? "عجز بالدفعة مستحق السداد (مدين)"
                          : "المتبقي من الدفعة (فائض لصالح العميل)"}
                      </span>
                      <span
                        className={`text-xl font-black block mt-1 ${
                          invoiceRemaining < 0
                            ? "text-red-700"
                            : "text-emerald-700"
                        }`}
                      >
                        {Math.abs(invoiceRemaining).toLocaleString("ar-EG")} ج.م
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ================= CASE B: FULL ACCOUNT STATEMENT ================= */
            <>
              {/* SECTION 1: PAYMENTS RECEIVED (الدفعات) */}
              <div className="space-y-2 page-break-inside-avoid">
                <div className="flex items-center justify-between border-b border-gray-200 pb-1">
                  <h3 className="text-sm font-bold text-gray-900 m-0 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                    أولاً: الدفعات المالية المستلمة من العميل
                  </h3>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    إجمالي الدفعات: {totalPatches.toLocaleString("ar-EG")} ج.م
                  </span>
                </div>

                {patches.length > 0 ? (
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <table className="w-full text-right border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-100 text-gray-900 font-bold border-b border-gray-300">
                          <th className="py-2.5 px-3 w-12 text-center">م</th>
                          <th className="py-2.5 px-3 w-32">المبلغ (ج.م)</th>
                          <th className="py-2.5 px-3 w-32">تاريخ الدفعة</th>
                          <th className="py-2.5 px-3">البيان والملاحظات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {patches.map((p: any, idx: number) => (
                          <tr
                            key={idx}
                            className={
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                            }
                          >
                            <td className="py-2 px-3 text-center font-bold text-gray-600">
                              {idx + 1}
                            </td>
                            <td className="py-2 px-3 font-bold text-emerald-700 text-sm">
                              {Number(p.amount).toLocaleString("ar-EG")} ج.م
                            </td>
                            <td className="py-2 px-3 font-medium text-gray-700">
                              {p.date
                                ? new Date(p.date).toLocaleDateString("ar-EG")
                                : "-"}
                            </td>
                            <td className="py-2 px-3 text-gray-700">
                              {p.notes || "دفعة نقدية مسددة"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-100 font-bold border-t border-gray-300">
                          <td colSpan={2} className="py-2.5 px-3 text-gray-900">
                            إجمالي الدفعات المستلمة:
                          </td>
                          <td
                            colSpan={2}
                            className="py-2.5 px-3 font-black text-emerald-800 text-sm"
                          >
                            {totalPatches.toLocaleString("ar-EG")} ج.م
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic py-2">
                    لا توجد دفعات نقدية مسجلة حالياً.
                  </p>
                )}
              </div>

              {/* SECTION 2: EXPENSES (المصروفات) */}
              <div className="space-y-2 page-break-inside-avoid">
                <div className="flex items-center justify-between border-b border-gray-200 pb-1">
                  <h3 className="text-sm font-bold text-gray-900 m-0 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                    ثانياً: بيان المصروفات وتكاليف الأعمال والبنود
                  </h3>
                  <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                    إجمالي المصروفات: {totalPayments.toLocaleString("ar-EG")} ج.م
                  </span>
                </div>

                {payments.length > 0 ? (
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <table className="w-full text-right border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-100 text-gray-900 font-bold border-b border-gray-300">
                          <th className="py-2.5 px-3 w-12 text-center">م</th>
                          <th className="py-2.5 px-3 font-bold">
                            اسم البند / الصنف
                          </th>
                          <th className="py-2.5 px-3 w-32">السعر / التكلفة</th>
                          <th className="py-2.5 px-3 w-32">التاريخ</th>
                          <th className="py-2.5 px-3">ملاحظات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {payments.map((item: any, idx: number) => (
                          <tr
                            key={idx}
                            className={
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                            }
                          >
                            <td className="py-2 px-3 text-center font-bold text-gray-600">
                              {idx + 1}
                            </td>
                            <td className="py-2 px-3 font-bold text-gray-900">
                              {item.name}
                            </td>
                            <td className="py-2 px-3 font-bold text-blue-800 text-sm">
                              {Number(item.price).toLocaleString("ar-EG")} ج.م
                            </td>
                            <td className="py-2 px-3 text-gray-700">
                              {item.date
                                ? new Date(item.date).toLocaleDateString(
                                    "ar-EG"
                                  )
                                : "-"}
                            </td>
                            <td className="py-2 px-3 text-gray-600">
                              {item.notes || "---"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-100 font-bold border-t border-gray-300">
                          <td colSpan={2} className="py-2.5 px-3 text-gray-900">
                            إجمالي المصروفات والتكاليف:
                          </td>
                          <td
                            colSpan={3}
                            className="py-2.5 px-3 font-black text-blue-900 text-sm"
                          >
                            {totalPayments.toLocaleString("ar-EG")} ج.م
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic py-2">
                    لا توجد بنود مصروفات مسجلة حالياً.
                  </p>
                )}
              </div>

              {/* SECTION 3: STATEMENT SUMMARY */}
              <div className="pt-2 page-break-inside-avoid">
                <div className="border-2 border-gray-900 rounded-xl overflow-hidden bg-white">
                  <div className="bg-gray-900 text-white p-2.5 px-4 flex justify-between items-center">
                    <span className="font-black text-sm">
                      ملخص الحساب المالي الإجمالي
                    </span>
                    <span className="text-xs font-semibold text-gray-300">
                      FINAL BALANCE SUMMARY
                    </span>
                  </div>

                  <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-200 bg-gray-50/50">
                    <div className="p-3 bg-white border border-gray-200 rounded-lg">
                      <span className="text-xs text-gray-500 block font-bold">
                        إجمالي الدفعات المستلمة
                      </span>
                      <span className="text-lg font-black text-emerald-700 block mt-1">
                        {totalPatches.toLocaleString("ar-EG")} ج.م
                      </span>
                    </div>

                    <div className="p-3 bg-white border border-gray-200 rounded-lg">
                      <span className="text-xs text-gray-500 block font-bold">
                        إجمالي المصروفات المنفذة
                      </span>
                      <span className="text-lg font-black text-blue-800 block mt-1">
                        {totalPayments.toLocaleString("ar-EG")} ج.م
                      </span>
                    </div>

                    <div
                      className={`p-3 rounded-lg border-2 ${
                        isDebtor
                          ? "border-red-500 bg-red-50/70"
                          : isCreditor
                          ? "border-emerald-500 bg-emerald-50/70"
                          : "border-gray-400 bg-gray-100"
                      }`}
                    >
                      <span
                        className={`text-xs block font-bold ${
                          isDebtor
                            ? "text-red-700"
                            : isCreditor
                            ? "text-emerald-700"
                            : "text-gray-700"
                        }`}
                      >
                        {isDebtor
                          ? "المبلغ المتبقي مستحق على العميل (مدين)"
                          : isCreditor
                          ? "المبلغ المتبقي لصالح العميل (دائن)"
                          : "الحساب متزن تماماً"}
                      </span>
                      <span
                        className={`text-xl font-black block mt-1 ${
                          isDebtor
                            ? "text-red-700"
                            : isCreditor
                            ? "text-emerald-700"
                            : "text-gray-900"
                        }`}
                      >
                        {Math.abs(netBalance).toLocaleString("ar-EG")} ج.م
                      </span>
                    </div>
                  </div>

                  {/* Status Note */}
                  <div className="px-4 py-3 bg-white flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      {isDebtor ? (
                        <>
                          <ExclamationCircleOutlined className="text-red-600 text-base" />
                          <span className="text-red-700 font-bold">
                            تنبيه: يوجد رصيد مستحق السداد قدره (
                            {Math.abs(netBalance).toLocaleString("ar-EG")} ج.م)
                            لصالح مؤسسة شطب.
                          </span>
                        </>
                      ) : isCreditor ? (
                        <>
                          <CheckCircleOutlined className="text-emerald-600 text-base" />
                          <span className="text-emerald-700 font-bold">
                            رصيد متبقي لصالح العميل قدره (
                            {Math.abs(netBalance).toLocaleString("ar-EG")} ج.م)
                            يتم ترحيله للبنود القادمة.
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircleOutlined className="text-gray-600 text-base" />
                          <span className="text-gray-700 font-bold">
                            تمت تصفية الحساب وسداد كامل التكاليف بالتساوي.
                          </span>
                        </>
                      )}
                    </div>

                    <span className="text-gray-500 text-[11px]">
                      الأسعار تشمل كافة الأعمال الموضحة أعلاه
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ================= SIGNATURES & STAMP ================= */}
          <div className="pt-8 border-t border-gray-200 grid grid-cols-2 gap-8 text-center text-xs page-break-inside-avoid">
            <div className="space-y-10">
              <span className="block font-bold text-gray-800">
                توقيع العميل بالموافقة والاستلام
              </span>
              <div className="border-b border-dashed border-gray-400 w-3/4 mx-auto"></div>
            </div>

            <div className="space-y-10">
              <div>
                <span className="block font-bold text-gray-900">
                  إدارة المشروعات والتشطيبات
                </span>
                <span className="text-gray-600 font-semibold text-[11px]">
                  م / حاتم الوكيل
                </span>
              </div>
              <div className="border-b border-dashed border-gray-400 w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PrintContent.displayName = "PrintContent";

export default PrintContent;
