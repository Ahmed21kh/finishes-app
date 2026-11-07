/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import dayjs from "dayjs";
import { Transaction, AccountStatement } from "../types";
import {
  PhoneOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  FileTextOutlined,
  HomeFilled,
} from "@ant-design/icons";

interface PrintTransactionInvoiceProps {
  transaction: Transaction;
  client?: AccountStatement;
}

export const PrintTransactionInvoice = React.forwardRef<
  HTMLDivElement,
  PrintTransactionInvoiceProps
>(({ transaction, client }, ref) => {
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

  return (
    <div
      ref={ref}
      dir="rtl"
      className="p-8 bg-white text-slate-900 font-cairo print-container"
      style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}
    >
      {/* Letterhead Header */}
      <div className="border-b border-slate-200 pb-5 mb-6">
        <div className="flex justify-between items-start">
          {/* Company Brand */}
          <div className="text-right">
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
                style={{
                  background: "linear-gradient(135deg, #1677ff, #6366f1)",
                }}
              >
                <HomeFilled className="text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  شـــطــــب
                </h1>
                <p className="text-xs font-bold text-slate-600">
                  لأعمال الديكور والتشطيبات المتكاملة
                </p>
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              م / حاتم الوكيل • 01020696230
            </p>
          </div>

          {/* Invoice Title & Stamp Badge */}
          <div className="flex flex-col items-end">
            <div className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-black text-base shadow-xs mb-2">
              فاتورة معاملة
            </div>
            <div className="text-xs text-slate-700 font-bold space-y-1 text-right" dir="rtl">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-slate-500 font-medium">رقم الفاتورة:</span>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]" dir="ltr">
                  #INV-{String(transaction?.code || 1000).padStart(4, "0")}
                </span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-slate-500 font-medium">التاريخ:</span>
                <span className="font-semibold text-slate-900">
                  {dayjs(transaction?.date || new Date()).format("YYYY/MM/DD")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Title Banner */}
      <div className="mb-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FileTextOutlined className="text-lg text-slate-700" />
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              اسم المعاملة / الخدمة
            </p>
            <h2 className="text-base font-black text-slate-900">
              {transaction?.title || "معاملة تشطيب"}
            </h2>
          </div>
        </div>
        <div className="text-left text-xs text-slate-600">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
            {transaction?.status || "قيد التنفيذ"}
          </span>
        </div>
      </div>

      {/* Client Information Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          بيانات العميل
        </h3>
        <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <UserOutlined className="text-slate-400" />
            <span className="text-slate-500">اسم العميل:</span>
            <span className="font-bold text-slate-900">
              {client?.clientName || "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneOutlined className="text-slate-400" />
            <span className="text-slate-500">رقم الهاتف:</span>
            <span className="font-bold text-slate-900" dir="ltr">
              {client?.phoneNumber || "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <EnvironmentOutlined className="text-slate-400" />
            <span className="text-slate-500">العنوان:</span>
            <span className="font-bold text-slate-900">
              {client?.address || "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-slate-400" />
            <span className="text-slate-500">كود العميل:</span>
            <span className="font-bold text-slate-900">
              #{client?.code || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Expenses & Costs Table (المصروفات والتكاليف) */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 px-1">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span>المصروفات والتكاليف</span>
            <span className="text-xs font-normal text-slate-500">
              ({payments.length} بند)
            </span>
          </h3>
          <span className="text-xs font-bold text-slate-700">
            الإجمالي: {totalPayments.toLocaleString()} ج.م
          </span>
        </div>
        <table className="w-full text-xs text-right border-collapse border border-slate-200 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th className="p-2.5 w-12 text-center">#</th>
              <th className="p-2.5">اسم البند / الصنف</th>
              <th className="p-2.5 w-28 text-left">التكلفة (ج.م)</th>
              <th className="p-2.5 w-28 text-center">التاريخ</th>
              <th className="p-2.5">ملاحظات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.length > 0 ? (
              payments.map((p, idx) => (
                <tr key={p._id || idx} className="hover:bg-slate-50/50">
                  <td className="p-2.5 text-center font-bold text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="p-2.5 font-bold text-slate-900">{p.name}</td>
                  <td className="p-2.5 text-left font-black text-slate-900" dir="ltr">
                    {Number(p.price).toLocaleString()} ج.م
                  </td>
                  <td className="p-2.5 text-center text-slate-600">
                    {dayjs(p.date).format("YYYY/MM/DD")}
                  </td>
                  <td className="p-2.5 text-slate-500">{p.notes || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-400">
                  لا توجد بنود مصروفات مسجلة لهذه المعاملة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Received Patches Table (الدفعات المستلمة) */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 px-1">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span>الدفعات المستلمة من العميل</span>
            <span className="text-xs font-normal text-slate-500">
              ({patches.length} دفعة)
            </span>
          </h3>
          <span className="text-xs font-bold text-emerald-700">
            الإجمالي: {totalPatches.toLocaleString()} ج.م
          </span>
        </div>
        <table className="w-full text-xs text-right border-collapse border border-slate-200 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th className="p-2.5 w-12 text-center">#</th>
              <th className="p-2.5 w-36 text-left">مبلغ الدفعة (ج.م)</th>
              <th className="p-2.5 w-32 text-center">تاريخ الدفعة</th>
              <th className="p-2.5">ملاحظات وطريقة الاستلام</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patches.length > 0 ? (
              patches.map((p, idx) => (
                <tr key={p._id || idx} className="hover:bg-slate-50/50">
                  <td className="p-2.5 text-center font-bold text-slate-500">
                    {idx + 1}
                  </td>
                  <td
                    className="p-2.5 text-left font-black text-emerald-700"
                    dir="ltr"
                  >
                    {Number(p.amount).toLocaleString()} ج.م
                  </td>
                  <td className="p-2.5 text-center text-slate-600">
                    {dayjs(p.date).format("YYYY/MM/DD")}
                  </td>
                  <td className="p-2.5 text-slate-500">{p.notes || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-400">
                  لم يتم تسجيل دفعات مستلمة لهذه المعاملة بعد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Financial Summary Section */}
      <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 mb-8 shadow-xs">
        <div className="grid grid-cols-3 gap-3.5 text-center">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <p className="text-[11px] font-bold text-slate-500 mb-1">
              إجمالي الدفعات المستلمة
            </p>
            <p className="text-base font-black text-emerald-600" dir="ltr">
              {totalPatches.toLocaleString()} ج.م
            </p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <p className="text-[11px] font-bold text-slate-500 mb-1">
              إجمالي المصروفات والتكاليف
            </p>
            <p className="text-base font-black text-rose-600" dir="ltr">
              {totalPayments.toLocaleString()} ج.م
            </p>
          </div>
          <div
            className={`p-3.5 rounded-xl border shadow-xs ${
              isCreditor
                ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                : "bg-rose-50/80 border-rose-200 text-rose-900"
            }`}
          >
            <p className="text-[11px] font-bold mb-1">
              {isCreditor ? "الرصيد المتبقي للعميل (له)" : "المبلغ المتبقي على العميل (عليه)"}
            </p>
            <p className="text-base font-black" dir="ltr">
              {Math.abs(balance).toLocaleString()} ج.م
            </p>
          </div>
        </div>
      </div>

      {/* Notes if any */}
      {transaction?.notes && (
        <div className="mb-6 p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900">
          <span className="font-bold ml-1">ملاحظات المعاملة:</span>
          {transaction.notes}
        </div>
      )}

      {/* Signatures */}
      <div className="pt-8 border-t border-slate-200 flex justify-between items-center text-xs font-bold text-slate-700">
        <div className="text-center w-48">
          <p className="mb-10 text-slate-500">توقيع العميل بالاستلام والموافقة</p>
          <div className="border-b border-dashed border-slate-400 w-full" />
        </div>
        <div className="text-center w-48">
          <p className="mb-2 text-slate-500">إدارة المشروعات والتشطيبات</p>
          <p className="font-black text-slate-900 text-sm mb-6">م / حاتم الوكيل</p>
          <div className="border-b border-dashed border-slate-400 w-full" />
        </div>
      </div>

      {/* Subtle Footer */}
      <div className="mt-8 text-center text-[10px] text-slate-400">
        تم استخراج هذه الفاتورة إلكترونياً عبر نظام شطب لإدارة الحسابات
      </div>
    </div>
  );
});

PrintTransactionInvoice.displayName = "PrintTransactionInvoice";

export default PrintTransactionInvoice;

