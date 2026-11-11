/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  Input,
  DatePicker,
  Select,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  ShoppingOutlined,
  PrinterOutlined,
  SaveOutlined,
  FileTextOutlined,
  CalendarOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import ButtonComponent from "./ButtonComponent";
import { Transaction, Patch, Payment } from "../types";
import {
  addTransactionApi,
  updateTransactionApi,
  getTransactionNextCodeApi,
} from "../apis/TransactionsApi";

const { TextArea } = Input;

interface AddEditTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  accountStatementId: string;
  clientName: string;
  editingTransaction?: Transaction | null;
  onSuccess: (savedTransaction: Transaction, shouldPrint?: boolean) => void;
}

export const AddEditTransactionModal: React.FC<AddEditTransactionModalProps> = ({
  visible,
  onClose,
  accountStatementId,
  clientName,
  editingTransaction,
  onSuccess,
}) => {
  const isEdit = Boolean(editingTransaction?._id);

  const [transactionCode, setTransactionCode] = useState<number | string>("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<dayjs.Dayjs>(dayjs());
  const [status, setStatus] = useState("قيد التنفيذ");
  const [notes, setNotes] = useState("");
  const [patches, setPatches] = useState<Patch[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      if (editingTransaction) {
        setTransactionCode(editingTransaction.code || 1000);
        setTitle(editingTransaction.title || "");
        setDate(editingTransaction.date ? dayjs(editingTransaction.date) : dayjs());
        setStatus(editingTransaction.status || "قيد التنفيذ");
        setNotes(editingTransaction.notes || "");
        setPatches(editingTransaction.patches || []);
        setPayments(editingTransaction.payments || []);
      } else {
        // Reset defaults and fetch auto-generated 4-digit code (>= 1000)
        setTitle("");
        setDate(dayjs());
        setStatus("قيد التنفيذ");
        setNotes("");
        setPatches([]);
        setPayments([]);
        getTransactionNextCodeApi(accountStatementId)
          .then((res: any) => {
            if (res?.code) setTransactionCode(res.code);
            else setTransactionCode(1000);
          })
          .catch(() => setTransactionCode(1000));
      }
    }
  }, [visible, editingTransaction, accountStatementId]);

  // Calculations
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

  // Handlers for Patches (الدفعات)
  const addPatchRow = () => {
    setPatches((prev) => [
      ...prev,
      { amount: "" as any, date: dayjs().toISOString(), notes: "" },
    ]);
  };

  const updatePatchField = (index: number, field: keyof Patch, val: any) => {
    setPatches((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const removePatchRow = (index: number) => {
    setPatches((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Handlers for Payments (المصروفات والتكاليف)
  const addPaymentRow = () => {
    setPayments((prev) => [
      ...prev,
      { name: "", price: "" as any, date: dayjs().toISOString(), notes: "" },
    ]);
  };

  const updatePaymentField = (index: number, field: keyof Payment, val: any) => {
    setPayments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const removePaymentRow = (index: number) => {
    setPayments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // If inside a multi-line textarea, only submit if Ctrl+Enter or Cmd+Enter
    const target = e.target as HTMLElement;
    const isTextarea = target.tagName === "TEXTAREA";

    if (isTextarea) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSave(false);
      }
      return;
    }

    // Keyboard shortcut: Ctrl+S / Cmd+S to save
    if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
      e.preventDefault();
      handleSave(false);
      return;
    }

    // On plain Enter in any standard input (title, price, amount, notes, date)
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave(false);
    }
  };

  const isSubmittingRef = useRef(false);

  const handleSave = async (shouldPrint: boolean = false) => {
    if (isSubmittingRef.current || saving) return;

    if (!accountStatementId) {
      toast.error("خطأ: لم يتم تحديد كشف حساب العميل");
      return;
    }

    if (!title.trim()) {
      toast.error("يرجى كتابة اسم المعاملة أو الخدمة أو الشقة");
      return;
    }

    try {
      isSubmittingRef.current = true;
      setSaving(true);
      const payload = {
        accountStatement: String(accountStatementId),
        title: title.trim(),
        date: date.toISOString(),
        status,
        notes: notes.trim(),
        patches: patches.filter((p) => p.amount !== "" && Number(p.amount) > 0),
        payments: payments.filter((p) => p.name.trim() !== "" || (p.price !== "" && Number(p.price) > 0)),
      };

      let resultTx: Transaction;

      if (isEdit && editingTransaction?._id) {
        const res = await updateTransactionApi(editingTransaction._id, payload);
        toast.success(res?.message || "تم تحديث المعاملة بنجاح");
        resultTx = res?.data || { ...editingTransaction, ...payload };
      } else {
        const res = await addTransactionApi(payload);
        toast.success(res?.message || "تم إنشاء المعاملة بنجاح");
        resultTx = res?.data || payload;
      }

      onSuccess(resultTx, shouldPrint);
      onClose();
    } catch (error: any) {
      console.error("Save transaction error:", error);
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء حفظ المعاملة");
    } finally {
      setSaving(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={900}
      style={{ maxWidth: "calc(100vw - 20px)", margin: "10px auto" }}
      destroyOnClose
      centered
      className="font-cairo custom-transaction-modal !max-w-[calc(100vw-20px)]"
      title={
        <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-900 dark:text-white pb-1 truncate">
          <FileTextOutlined className="text-blue-500 text-lg shrink-0" />
          <span className="truncate">
            {isEdit
              ? `تعديل المعاملة: ${editingTransaction?.title || ""}`
              : `إضافة معاملة جديدة لكشف حساب: ${clientName}`}
          </span>
        </div>
      }
      footer={
        <div
          dir="rtl"
          className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-gray-200 dark:border-neutral-800"
        >
          <div className="text-xs font-bold text-gray-500 dark:text-gray-400 text-center sm:text-right">
            {payments.length} بنود مصروفات • {patches.length} دفعات مستلمة
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <ButtonComponent
              text="إلغاء"
              size="large"
              onClick={onClose}
              disabled={saving}
              className="flex-1 sm:flex-none px-3 sm:px-4 font-semibold text-xs sm:text-sm"
            />

            <ButtonComponent
              form="transaction-modal-form"
              htmlType="submit"
              text="حفظ المعاملة"
              icon={<SaveOutlined />}
              size="large"
              loading={saving}
              className="flex-1 sm:flex-none px-3 sm:px-5 font-semibold text-xs sm:text-sm"
            />

            {/* Quick Instant Save & Print Button */}
            <ButtonComponent
              type="primary"
              size="large"
              icon={<PrinterOutlined />}
              text="حفظ وطباعة فوراً"
              onClick={() => handleSave(true)}
              loading={saving}
              className="w-full sm:w-auto px-4 sm:px-5 font-bold shadow-md !bg-gradient-to-r !from-blue-600 !to-indigo-600 hover:opacity-95 text-xs sm:text-sm"
            />
          </div>
        </div>
      }
    >
      <form
        id="transaction-modal-form"
        dir="rtl"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave(false);
        }}
        onKeyDown={handleKeyDown}
        className="space-y-5 sm:space-y-6 pt-3 max-h-[72vh] sm:max-h-[68vh] overflow-y-auto px-1 pr-1.5"
      >
        {/* Basic Transaction Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 bg-slate-50 dark:bg-neutral-900/60 p-3 sm:p-4 rounded-2xl border border-gray-200/70 dark:border-neutral-800">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1">
              <BarcodeOutlined className="text-blue-500" />
              كود المعاملة (تلقائي)
            </label>
            <Input
              value={transactionCode ? `#${transactionCode}` : "..."}
              readOnly
              size="large"
              className="!rounded-xl !bg-gray-100 dark:!bg-neutral-800 font-mono font-bold text-blue-600 dark:text-blue-400"
            />
          </div>

          <div className="sm:col-span-1 md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              اسم المعاملة / الخدمة / الشقة <span className="text-red-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: تشطيب شقة التجمع الخامس - عمارة 14"
              size="large"
              className="!rounded-xl"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              تاريخ المعاملة
            </label>
            <DatePicker
              value={date}
              onChange={(d) => setDate(d || dayjs())}
              size="large"
              className="w-full !rounded-xl"
              format="YYYY/MM/DD"
              allowClear={false}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              حالة المعاملة
            </label>
            <Select
              value={status}
              onChange={(v) => setStatus(v)}
              size="large"
              className="w-full !rounded-xl"
              options={[
                { value: "قيد التنفيذ", label: "قيد التنفيذ ⏳" },
                { value: "مكتملة", label: "مكتملة ✅" },
                { value: "ملغاة", label: "ملغاة ❌" },
              ]}
            />
          </div>

          <div className="sm:col-span-2 md:col-span-3">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              ملاحظات المعاملة (اختياري)
            </label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي تفاصيل أو ملاحظات خاصة بهذه المعاملة..."
              size="large"
              className="!rounded-xl"
            />
          </div>
        </div>

        {/* Expenses and Costs Section (المصروفات والتكاليف) */}
        <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200/80 dark:border-neutral-800 shadow-xs">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              <ShoppingOutlined className="text-rose-500 text-lg" />
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                المصروفات والتكاليف المنفقة على المعاملة
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-bold">
                {payments.length} بند
              </span>
            </div>
            <ButtonComponent
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              text="إضافة مصروف / بند"
              onClick={addPaymentRow}
              className="!bg-rose-600 hover:!bg-rose-500 shadow-xs text-xs font-semibold"
            />
          </div>

          {payments.length === 0 ? (
            <div className="text-center py-5 border border-dashed border-gray-200 dark:border-neutral-800 rounded-xl text-gray-400 dark:text-gray-500 text-xs">
              لا توجد مصروفات مضافة بعد. انقر على "إضافة مصروف / بند" للبدء.
            </div>
          ) : (
            <div className="space-y-2.5">
              {payments.map((p, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-xl bg-gray-50/70 dark:bg-neutral-800/40 border border-gray-200/60 dark:border-neutral-800 animate-fade-in"
                >
                  <div className="flex items-center justify-between sm:justify-start gap-2">
                    <span className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <Tooltip title="حذف هذا البند">
                      <button
                        type="button"
                        onClick={() => removePaymentRow(idx)}
                        className="sm:hidden w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shrink-0"
                      >
                        <DeleteOutlined />
                      </button>
                    </Tooltip>
                  </div>

                  <Input
                    placeholder="اسم البند (مثال: أسمنت، سيراميك، دهانات)"
                    value={p.name}
                    onChange={(e) => updatePaymentField(idx, "name", e.target.value)}
                    className="flex-1 !rounded-lg"
                  />

                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                    <Input
                      type="number"
                      placeholder="التكلفة"
                      suffix={<span className="text-gray-400 text-xs select-none">ج.م</span>}
                      value={p.price}
                      onChange={(e) => updatePaymentField(idx, "price", e.target.value)}
                      className="w-full sm:w-32 md:w-36 !rounded-lg"
                      min={0}
                    />

                    <DatePicker
                      value={p.date ? dayjs(p.date) : dayjs()}
                      onChange={(d) =>
                        updatePaymentField(
                          idx,
                          "date",
                          d ? d.toISOString() : new Date().toISOString()
                        )
                      }
                      className="w-full sm:w-32 md:w-36 !rounded-lg"
                      format="YYYY/MM/DD"
                      allowClear={false}
                    />
                  </div>

                  <Input
                    placeholder="ملاحظات البند..."
                    value={p.notes}
                    onChange={(e) => updatePaymentField(idx, "notes", e.target.value)}
                    className="w-full sm:w-36 md:w-44 !rounded-lg"
                  />

                  <Tooltip title="حذف هذا البند">
                    <button
                      type="button"
                      onClick={() => removePaymentRow(idx)}
                      className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shrink-0"
                    >
                      <DeleteOutlined />
                    </button>
                  </Tooltip>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Received Patches Section (الدفعات المستلمة) */}
        <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200/80 dark:border-neutral-800 shadow-xs">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              <DollarCircleOutlined className="text-emerald-500 text-lg" />
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                الدفعات المستلمة من العميل لهذه المعاملة
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold">
                {patches.length} دفعة
              </span>
            </div>
            <ButtonComponent
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              text="إضافة دفعة مستلمة"
              onClick={addPatchRow}
              className="!bg-emerald-600 hover:!bg-emerald-500 shadow-xs text-xs font-semibold"
            />
          </div>

          {patches.length === 0 ? (
            <div className="text-center py-5 border border-dashed border-gray-200 dark:border-neutral-800 rounded-xl text-gray-400 dark:text-gray-500 text-xs">
              لم تسجل دفعات مستلمة بعد. انقر على "إضافة دفعة مستلمة".
            </div>
          ) : (
            <div className="space-y-2.5">
              {patches.map((p, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-xl bg-gray-50/70 dark:bg-neutral-800/40 border border-gray-200/60 dark:border-neutral-800 animate-fade-in"
                >
                  <div className="flex items-center justify-between sm:justify-start gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <Tooltip title="حذف الدفعة">
                      <button
                        type="button"
                        onClick={() => removePatchRow(idx)}
                        className="sm:hidden w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shrink-0"
                      >
                        <DeleteOutlined />
                      </button>
                    </Tooltip>
                  </div>

                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                    <Input
                      type="number"
                      placeholder="مبلغ الدفعة"
                      suffix={<span className="text-emerald-500 text-xs font-semibold select-none">ج.م</span>}
                      value={p.amount}
                      onChange={(e) => updatePatchField(idx, "amount", e.target.value)}
                      className="w-full sm:w-36 md:w-44 !rounded-lg"
                      min={0}
                    />

                    <DatePicker
                      value={p.date ? dayjs(p.date) : dayjs()}
                      onChange={(d) =>
                        updatePatchField(
                          idx,
                          "date",
                          d ? d.toISOString() : new Date().toISOString()
                        )
                      }
                      className="w-full sm:w-36 md:w-40 !rounded-lg"
                      format="YYYY/MM/DD"
                      allowClear={false}
                    />
                  </div>

                  <Input
                    placeholder="ملاحظات الدفعة (مثال: كاش / تحويل فودافون كاش)..."
                    value={p.notes}
                    onChange={(e) => updatePatchField(idx, "notes", e.target.value)}
                    className="flex-1 !rounded-lg"
                  />

                  <Tooltip title="حذف الدفعة">
                    <button
                      type="button"
                      onClick={() => removePatchRow(idx)}
                      className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shrink-0"
                    >
                      <DeleteOutlined />
                    </button>
                  </Tooltip>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Calculation Banner */}
        <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-50/50 via-slate-50 to-indigo-50/50 dark:from-neutral-900 dark:via-neutral-850 dark:to-neutral-900 border border-gray-200/80 dark:border-neutral-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 shadow-xs border border-gray-200/60 dark:border-neutral-700">
              <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-0.5">
                إجمالي المصروفات
              </p>
              <p className="text-sm sm:text-base font-black text-rose-600 dark:text-rose-400">
                {totalPayments.toLocaleString()} ج.م
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 shadow-xs border border-gray-200/60 dark:border-neutral-700">
              <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-0.5">
                إجمالي الدفعات
              </p>
              <p className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
                {totalPatches.toLocaleString()} ج.م
              </p>
            </div>
            <div
              className={`p-2.5 rounded-xl shadow-xs border ${
                isCreditor
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                  : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
              }`}
            >
              <p className="text-[11px] font-bold mb-0.5">
                {isCreditor ? "الصافي للعميل (له)" : "الصافي على العميل (عليه)"}
              </p>
              <p className="text-sm sm:text-base font-black">
                {Math.abs(balance).toLocaleString()} ج.م
              </p>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditTransactionModal;

