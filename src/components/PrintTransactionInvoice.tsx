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
} from "@ant-design/icons";
import ShatabLogoIcon from "./ShatabLogo";

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
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      {/* Letterhead Header */}
      <div className="border-b border-slate-200 pb-5 mb-6">
        <div className="flex justify-between items-start">
          {/* Company Brand */}
          <div className="text-right">
            <div className="flex items-center gap-3 mb-1">
              <ShatabLogoIcon size={44} className="rounded-2xl shadow-md shrink-0" />
              <div>
                <h1 className="text-2xl font-black text-slate-900 m-0 leading-tight">
                  شـــطــــب
                </h1>
                <p className="text-xs font-bold text-slate-600 m-0 leading-tight mt-0.5">
                  لأعمال الديكور والتشطيبات المتكاملة
                </p>
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-500 m-0 mt-1">
              إشراف هندسي: م / حاتم الوكيل • هاتف: 01020696230
            </p>
          </div>

          {/* Invoice Title & Stamp Badge */}
          <div className="flex flex-col items-end text-left" dir="rtl">
            <div
              data-pdf-badge="title"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-900 text-white font-black text-sm shadow-xs mb-2 leading-none"
            >
              <span className="inline-block leading-none pt-0.5">فاتورة معاملة</span>
            </div>
            <div className="text-xs text-slate-700 font-bold space-y-1.5 text-right" dir="rtl">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-slate-500 font-medium">رقم الفاتورة:</span>
                <span
                  data-pdf-badge="code"
                  className="inline-flex items-center justify-center font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-xs leading-none"
                  dir="ltr"
                >
                  #INV-{String(transaction?.code || 1000).padStart(4, "0")}
                </span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-slate-500 font-medium">تاريخ الفاتورة:</span>
                <span className="font-semibold text-slate-900" dir="ltr">
                  {dayjs(transaction?.date || new Date()).format("YYYY/MM/DD")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Title Banner */}
      <div className="mb-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileTextOutlined className="text-xl text-blue-600 shrink-0" />
          <div>
            <p className="text-[11px] font-bold text-slate-500 m-0 leading-tight mb-0.5">
              اسم المعاملة / الخدمة
            </p>
            <h2 className="text-base font-black text-slate-900 m-0 leading-tight">
              {transaction?.title || "معاملة تشطيب"}
            </h2>
          </div>
        </div>
        <div className="text-left shrink-0">
          <span
            data-pdf-badge="status"
            className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300/50 leading-none"
          >
            <span className="inline-block leading-none pt-0.5">{transaction?.status || "قيد التنفيذ"}</span>
          </span>
        </div>
      </div>

      {/* Client Information Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs">
        <h3 className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1.5 m-0">
          <UserOutlined className="text-blue-500" />
          <span>بيانات العميل</span>
        </h3>
        <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">اسم العميل:</span>
            <span className="font-bold text-slate-900">
              {client?.clientName || "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">رقم الهاتف:</span>
            <span className="font-bold text-slate-900 font-mono" dir="ltr">
              {client?.phoneNumber || "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">العنوان:</span>
            <span className="font-bold text-slate-900">
              {client?.address || "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">كود العميل:</span>
            <span className="font-bold text-slate-900">
              #{client?.code || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Expenses & Costs Table (المصروفات والتكاليف) */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2.5 px-1">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 m-0">
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
              <th className="py-2.5 px-3 w-12 text-center align-middle">#</th>
              <th className="py-2.5 px-3 align-middle">اسم البند / الصنف</th>
              <th className="py-2.5 px-3 w-28 text-left align-middle">التكلفة (ج.م)</th>
              <th className="py-2.5 px-3 w-28 text-center align-middle">التاريخ</th>
              <th className="py-2.5 px-3 align-middle">ملاحظات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.length > 0 ? (
              payments.map((p, idx) => (
                <tr key={p._id || idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-500 align-middle">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 align-middle">{p.name}</td>
                  <td className="py-2.5 px-3 text-left font-black text-slate-900 align-middle" dir="ltr">
                    {Number(p.price).toLocaleString()} ج.م
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-600 align-middle">
                    {dayjs(p.date).format("YYYY/MM/DD")}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 align-middle">{p.notes || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-400 align-middle">
                  لا توجد بنود مصروفات مسجلة لهذه المعاملة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Received Patches Table (الدفعات المستلمة) */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2.5 px-1">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 m-0">
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
              <th className="py-2.5 px-3 w-12 text-center align-middle">#</th>
              <th className="py-2.5 px-3 w-36 text-left align-middle">مبلغ الدفعة (ج.م)</th>
              <th className="py-2.5 px-3 w-32 text-center align-middle">تاريخ الدفعة</th>
              <th className="py-2.5 px-3 align-middle">ملاحظات وطريقة الاستلام</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patches.length > 0 ? (
              patches.map((p, idx) => (
                <tr key={p._id || idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-500 align-middle">
                    {idx + 1}
                  </td>
                  <td
                    className="py-2.5 px-3 text-left font-black text-emerald-700 align-middle"
                    dir="ltr"
                  >
                    {Number(p.amount).toLocaleString()} ج.م
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-600 align-middle">
                    {dayjs(p.date).format("YYYY/MM/DD")}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 align-middle">{p.notes || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-400 align-middle">
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
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-center items-center">
            <p className="text-[11px] font-bold text-slate-500 mb-1">
              إجمالي الدفعات المستلمة
            </p>
            <p className="text-base font-black text-emerald-600" dir="ltr">
              {totalPatches.toLocaleString()} ج.م
            </p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-center items-center">
            <p className="text-[11px] font-bold text-slate-500 mb-1">
              إجمالي المصروفات والتكاليف
            </p>
            <p className="text-base font-black text-rose-600" dir="ltr">
              {totalPayments.toLocaleString()} ج.م
            </p>
          </div>
          <div
            className={`p-3.5 rounded-xl border shadow-xs flex flex-col justify-center items-center ${
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

