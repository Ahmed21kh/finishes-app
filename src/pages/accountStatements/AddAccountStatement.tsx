/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { DatePicker, Input, InputNumber } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormComponent from "../../components/FormComponent";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import {
  addAccountStatementApi,
  getAccountStatementCodeApi,
  getOneAccountStatementApi,
  updateAccountStatementApi,
} from "../../apis/AccountStatementsApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import CardComponent from "../../components/CardComponent";
import PageHeader from "../../components/PageHeader";
import { UserOutlined } from "@ant-design/icons";

export const AddAccountStatement = () => {
  const navigate = useNavigate();
  const params = useParams();
  const isEdit = Boolean(params?.id);

  const accountStatementSchema = yup.object().shape({
    code: yup.number().required("كود العميل مطلوب"),
    clientName: yup.string().required("اسم العميل مطلوب"),
    phoneNumber: yup.string().notRequired(),
    address: yup.string().required("العنوان مطلوب"),
    date: yup.date().required("التاريخ مطلوب"),
    notes: yup.string().notRequired(),
  });

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(accountStatementSchema),
  });

  const { data: codeData } = useQuery("clientCode", {
    queryFn: getAccountStatementCodeApi,
    enabled: !isEdit,
  });

  const { data: client, isLoading: isClientLoading } = useQuery(
    ["client", params?.id],
    () => getOneAccountStatementApi(params?.id),
    { enabled: isEdit }
  );

  const { isLoading: loadingAdd, mutate: addAccountStatement } = useMutation(
    addAccountStatementApi,
    {
      onSuccess(resData: any) {
        toast.success(resData?.message || "تم فتح الحساب بنجاح");
        const newId = resData?.data?._id;
        if (newId) {
          navigate(`/account-statement/${newId}`);
        } else {
          navigate("/account-statement");
        }
      },
      onError() {
        toast.error("حدث خطأ أثناء فتح الحساب");
      },
    }
  );

  const { isLoading: loadingEdit, mutate: updateAccountStatement } =
    useMutation({
      mutationFn: (body) => updateAccountStatementApi(params?.id, body),
      onSuccess(resData: any) {
        toast.success(resData?.message || "تم تحديث الحساب بنجاح");
        navigate(`/account-statement/${params?.id}`);
      },
      onError() {
        toast.error("حدث خطأ أثناء تحديث الحساب");
      },
    });

  useEffect(() => {
    if (!isEdit && codeData) {
      reset({
        code: codeData?.code,
        date: new Date(),
        notes: "",
        clientName: "",
        phoneNumber: "",
        address: "",
      });
      setValue("code", codeData?.code);
      setValue("date", new Date());
    } else if (isEdit && client) {
      setValue("code", client?.code);
      setValue("clientName", client?.clientName);
      setValue("phoneNumber", client?.phoneNumber);
      setValue("address", client?.address);
      setValue("date", client?.date);
      setValue("notes", client?.notes);
    }
  }, [codeData, client, isEdit]);

  const onSubmit = (formData: any) => {
    if (isEdit) {
      updateAccountStatement(formData);
    } else {
      addAccountStatement(formData);
    }
  };

  const onCancel = () => {
    reset();
    navigate(-1);
  };

  const inputsArr = [
    {
      label: "كود العميل",
      name: "code",
      render: (field: any) => (
        <InputNumber
          status={errors.code ? "error" : undefined}
          readOnly
          className="w-full !rounded-xl !bg-gray-100 dark:!bg-neutral-800"
          size="large"
          placeholder="كود العميل"
          {...field}
        />
      ),
      xs: 24,
      lg: 12,
    },
    {
      label: "اسم العميل *",
      name: "clientName",
      render: (field: any) => (
        <Input
          status={errors.clientName ? "error" : undefined}
          autoFocus
          className="!rounded-xl"
          size="large"
          placeholder="مثال: أحمد محمد علي"
          {...field}
        />
      ),
      xs: 24,
      lg: 12,
    },
    {
      label: "رقم الهاتف",
      name: "phoneNumber",
      render: (field: any) => (
        <Input
          status={errors.phoneNumber ? "error" : undefined}
          className="!rounded-xl"
          size="large"
          placeholder="مثال: 01020696230"
          {...field}
        />
      ),
      xs: 24,
      lg: 12,
    },
    {
      label: "العنوان *",
      name: "address",
      render: (field: any) => (
        <Input
          status={errors.address ? "error" : undefined}
          className="!rounded-xl"
          size="large"
          placeholder="مثال: القاهرة - التجمع الخامس"
          {...field}
        />
      ),
      xs: 24,
      lg: 12,
    },
    {
      label: "تاريخ التسجيل *",
      name: "date",
      render: (field: any) => (
        <DatePicker
          status={errors.date ? "error" : undefined}
          className="w-full !rounded-xl"
          size="large"
          placeholder="اختر التاريخ"
          value={field.value ? dayjs(field.value) : null}
          onChange={field.onChange}
        />
      ),
      xs: 24,
      lg: 12,
    },
    {
      label: "ملاحظات عامة عن العميل",
      name: "notes",
      render: (field: any) => (
        <Input.TextArea
          status={errors.notes ? "error" : undefined}
          className="!rounded-xl"
          rows={3}
          placeholder="أي تفاصيل أو ملاحظات عامة حول العميل..."
          {...field}
        />
      ),
      xs: 24,
      lg: 12,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in font-cairo">
      <PageHeader
        title={isEdit ? "تعديل بيانات العميل" : "فتح كشف حساب جديد"}
        subtitle={
          isEdit
            ? `تعديل بيانات كشف حساب العميل #${client?.code || ""}`
            : "تسجيل بيانات العميل لفتح كشف حساب دائم وإدارة كافة المعاملات بداخله"
        }
        icon={<UserOutlined />}
      />

      <CardComponent
        loading={isEdit && isClientLoading}
        className="p-4 sm:p-6 shadow-sm"
      >
        <FormComponent
          onCancel={onCancel}
          okText={isEdit ? "حفظ التعديلات" : "حفظ وفتح كشف الحساب"}
          cancelText="إلغاء والعودة"
          control={control}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          inputsArr={inputsArr}
          loading={isEdit ? loadingEdit : loadingAdd}
        />
      </CardComponent>
    </div>
  );
};

export default AddAccountStatement;
