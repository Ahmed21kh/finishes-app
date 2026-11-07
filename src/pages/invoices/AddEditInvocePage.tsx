/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldArray, useForm } from "react-hook-form";
import { DatePicker, Flex, Input, InputNumber } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormComponent from "../../components/FormComponent";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import {
  addinvoiceApi,
  getinvoiceCodeApi,
  getOneinvoiceApi,
  updateinvoiceApi,
} from "../../apis/InvoicesApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import ButtonComponent from "../../components/ButtonComponent";
import CardComponent from "../../components/CardComponent";
import PageHeader from "../../components/PageHeader";
import {
  DollarOutlined,
  FileTextOutlined,
  PlusOutlined,
} from "@ant-design/icons";

export const AddEditInvocePage = () => {
  const navigate = useNavigate();
  const { apartmentId, id, invoiceId } = useParams();
  const isEdit = Boolean(invoiceId);

  const apartmentSchema = yup.object().shape({
    payedPatch: yup.string().required("مبلغ الدفعة مطلوب"),
    code: yup.number().required("كود الدفعة مطلوب"),
    date: yup.date().required("تاريخ الدفعة مطلوب"),
    notes: yup.string().notRequired(),
    items: yup
      .array(
        yup.object().shape({
          code: yup
            .number()
            .typeError("كود الصنف مطلوب أو القيمة غير صحيحة")
            .required("كود الصنف مطلوب"),
          name: yup.string().required("اسم الصنف مطلوب"),
          price: yup
            .string()
            .typeError("سعر الصنف مطلوب أو القيمة غير صحيحة")
            .required("سعر الصنف مطلوب"),
          itemNotes: yup.string().notRequired(),
          date: yup.date().required("التاريخ مطلوب"),
        })
      )
      .notRequired(),
  });

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(apartmentSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const { data: codeData } = useQuery(
    "invoiceCode",
    () => getinvoiceCodeApi({ client: id }),
    { enabled: Boolean(id && !invoiceId) }
  );

  const { data: invoice, isLoading: isInvoiceLoading } = useQuery(
    ["invoice", invoiceId],
    () => getOneinvoiceApi(invoiceId),
    { enabled: Boolean(invoiceId) }
  );

  const { isLoading: loadingAdd, mutate: addInvoice } = useMutation(
    addinvoiceApi,
    {
      onSuccess(resData) {
        toast.success(resData?.message || "تمت إضافة الدفعة بنجاح");
        navigate(-1);
      },
      onError() {
        toast.error("حدث خطأ أثناء إضافة الدفعة");
      },
    }
  );

  const { isLoading: loadingEdit, mutate: updateInvoice } = useMutation({
    mutationFn: (body) => updateinvoiceApi(invoiceId, body),
    onSuccess(resData) {
      toast.success(resData?.message || "تم تعديل الدفعة بنجاح");
      navigate(-1);
    },
    onError() {
      toast.error("حدث خطأ أثناء تعديل الدفعة");
    },
  });

  useEffect(() => {
    if (!invoiceId && codeData) {
      setValue("code", codeData?.invoiceCode);
      setValue("date", new Date());
    } else if (invoiceId && invoice) {
      setValue("code", invoice?.code);
      setValue("payedPatch", String(invoice?.payedPatch));
      setValue("date", invoice?.date);
      setValue("notes", invoice?.notes);
      setValue("items", invoice?.items || []);
    }
  }, [codeData, invoice, invoiceId]);

  const onSubmit = (formData: any) => {
    const payload = { ...formData, client: id, apartment: apartmentId };
    if (invoiceId) {
      updateInvoice(payload);
    } else {
      addInvoice(payload);
    }
  };

  const onAddItem = () => {
    append({
      code: fields.length + 1,
      name: "",
      itemNotes: "",
      price: "",
      date: new Date(),
    });
  };

  const onRemoveItem = (index: number) => {
    remove(index);
  };

  const onCancel = () => {
    reset();
    navigate(-1);
  };

  const inputsArr = [
    {
      label: "كود الدفعة",
      name: "code",
      render: (field: any) => (
        <InputNumber
          status={errors.code ? "error" : undefined}
          readOnly
          className="w-full !rounded-xl !bg-gray-100 dark:!bg-neutral-800"
          size="large"
          placeholder="كود الدفعة"
          {...field}
        />
      ),
      xs: 24,
      lg: 12,
    },
    {
      label: "مبلغ الدفعة *",
      name: "payedPatch",
      render: (field: any) => (
        <InputNumber
          status={errors.payedPatch ? "error" : undefined}
          autoFocus
          className="!w-full !rounded-xl"
          size="large"
          placeholder="المبلغ بالجنيه"
          {...field}
        />
      ),
      xs: 24,
      lg: 12,
    },
    {
      label: "تاريخ الدفعة *",
      name: "date",
      render: (field: any) => (
        <DatePicker
          status={errors.date ? "error" : undefined}
          className="w-full !rounded-xl"
          size="large"
          placeholder="تاريخ الدفعة"
          value={field.value ? dayjs(field.value) : null}
          onChange={field.onChange}
        />
      ),
      xs: 24,
      lg: 12,
    },
    {
      label: "ملاحظات الدفعة",
      name: "notes",
      render: (field: any) => (
        <Input.TextArea
          status={errors.notes ? "error" : undefined}
          className="!w-full !rounded-xl"
          rows={3}
          placeholder="ملاحظات حول الدفعة المستلمة..."
          {...field}
        />
      ),
      xs: 24,
      lg: 12,
    },
    {
      label: (
        <Flex gap={8} align="center" justify="space-between" className="w-full">
          <span className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <FileTextOutlined className="text-blue-500" />
            بنود المصروفات التابعة لهذه الدفعة
          </span>
          <ButtonComponent
            type="primary"
            className="rounded-xl font-medium"
            icon={<PlusOutlined />}
            text="إضافة صنف مصروف"
            onClick={onAddItem}
          />
        </Flex>
      ),
      name: "items",
      isArray: true,
      fields: fields,
      onRemove: onRemoveItem,
      children: [
        {
          label: "كود الصنف",
          name: "code",
          render: (field: any, index?: any) => (
            <InputNumber
              status={
                (errors?.items as any)?.[index]?.code ? "error" : undefined
              }
              readOnly
              className="!w-full !rounded-xl !bg-gray-100 dark:!bg-neutral-800"
              size="large"
              placeholder="كود"
              {...field}
            />
          ),
          xs: 24,
          md: 3,
          lg: 3,
        },
        {
          label: "اسم الصنف *",
          name: "name",
          render: (field: any, index?: any) => (
            <Input
              status={
                (errors?.items as any)?.[index]?.name ? "error" : undefined
              }
              className="!w-full !rounded-xl"
              size="large"
              placeholder="اسم الصنف أو الخدمة"
              {...field}
            />
          ),
          xs: 24,
          md: 6,
          lg: 6,
        },
        {
          label: "السعر *",
          name: "price",
          render: (field: any, index?: any) => (
            <InputNumber
              status={
                (errors?.items as any)?.[index]?.price ? "error" : undefined
              }
              className="!w-full !rounded-xl"
              size="large"
              placeholder="السعر"
              {...field}
            />
          ),
          xs: 24,
          md: 4,
          lg: 4,
        },
        {
          label: "التاريخ *",
          name: "date",
          render: (field: any, index?: any) => (
            <DatePicker
              status={
                (errors?.items as any)?.[index]?.date ? "error" : undefined
              }
              className="!w-full !rounded-xl"
              size="large"
              placeholder="التاريخ"
              value={field.value ? dayjs(field.value) : null}
              onChange={field.onChange}
            />
          ),
          xs: 24,
          md: 4,
          lg: 4,
        },
        {
          label: "ملاحظات",
          name: "itemNotes",
          render: (field: any, index?: any) => (
            <Input
              status={
                (errors?.items as any)?.[index]?.itemNotes ? "error" : undefined
              }
              className="!w-full !rounded-xl"
              size="large"
              placeholder="ملاحظات"
              {...field}
            />
          ),
          xs: 24,
          md: 5,
          lg: 5,
        },
      ],
      xs: 24,
      lg: 24,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={isEdit ? "تعديل الدفعة والمصروفات" : "إضافة دفعة ومصروفات جديدة"}
        subtitle="تسجيل تفاصيل الدفعة المالية والبنود المنصرفة منها"
        icon={<DollarOutlined />}
      />

      <CardComponent
        loading={isEdit && isInvoiceLoading}
        className="p-4 sm:p-6 shadow-sm"
      >
        <FormComponent
          onCancel={onCancel}
          okText={isEdit ? "تعديل الدفعة" : "حفظ الدفعة"}
          cancelText="إلغاء والعودة"
          control={control}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          inputsArr={inputsArr}
          loading={isEdit ? loadingEdit : loadingAdd}
          onRemove={onRemoveItem}
        />
      </CardComponent>
    </div>
  );
};

export default AddEditInvocePage;
