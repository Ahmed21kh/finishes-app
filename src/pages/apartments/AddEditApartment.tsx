/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { Input, InputNumber } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormComponent from "../../components/FormComponent";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import {
  addapartmentApi,
  getapartmentCodeApi,
  getOneapartmentApi,
  updateapartmentApi,
} from "../../apis/ApartmentsApi";
import { toast } from "react-toastify";
import CardComponent from "../../components/CardComponent";
import PageHeader from "../../components/PageHeader";
import { HomeOutlined } from "@ant-design/icons";

export const AddEditApartment = () => {
  const mainRoute = `/account-statement`;
  const navigate = useNavigate();
  const { apartmentId, id } = useParams();
  const isEdit = Boolean(apartmentId);

  const apartmentSchema = yup.object().shape({
    address: yup.string().required("عنوان أو اسم الشقة مطلوب"),
    code: yup.number().required("كود الشقة مطلوب"),
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

  const { data: codeData } = useQuery(
    "apartmentCode",
    () => getapartmentCodeApi({ clientId: id }),
    { enabled: Boolean(id && !apartmentId) }
  );

  const { data: apartment, isLoading: isApartmentLoading } = useQuery(
    ["apartment", apartmentId],
    () => getOneapartmentApi(apartmentId),
    { enabled: Boolean(apartmentId) }
  );

  const { isLoading: loadingAdd, mutate: addApartment } = useMutation(
    addapartmentApi,
    {
      onSuccess(resData: any) {
        toast.success(resData?.message || "تمت إضافة الشقة بنجاح");
        navigate(`${mainRoute}/${id}`);
      },
      onError() {
        toast.error("حدث خطأ أثناء إضافة الشقة");
      },
    }
  );

  const { isLoading: loadingEdit, mutate: updateApartment } = useMutation({
    mutationFn: (body: any) => updateapartmentApi(apartmentId, body),
    onSuccess(resData: any) {
      toast.success(resData?.message || "تم تعديل الشقة بنجاح");
      navigate(`${mainRoute}/${id}`);
    },
    onError() {
      toast.error("حدث خطأ أثناء تعديل الشقة");
    },
  });

  useEffect(() => {
    if (!apartmentId && codeData) {
      setValue("code", codeData?.apartmentCode);
    } else if (apartmentId && apartment) {
      setValue("code", apartment?.code);
      setValue("address", apartment?.address);
    }
  }, [codeData, apartment, apartmentId]);

  const onSubmit = (formData: any) => {
    const payload = { ...formData, client: id };
    if (apartmentId) {
      updateApartment(payload);
    } else {
      addApartment(payload);
    }
  };

  const onCancel = () => {
    reset();
    navigate(`${mainRoute}/${id}`);
  };

  const inputsArr = [
    {
      label: "كود الشقة",
      name: "code",
      render: (field: any) => (
        <InputNumber
          status={errors.code ? "error" : undefined}
          readOnly
          className="w-full !rounded-xl !bg-gray-100 dark:!bg-neutral-800"
          size="large"
          placeholder="كود الشقة"
          {...field}
        />
      ),
      xs: 24,
      lg: 12,
    },
    {
      label: "عنوان / وصف الشقة *",
      name: "address",
      render: (field: any) => (
        <Input
          status={errors.address ? "error" : undefined}
          autoFocus
          className="!rounded-xl"
          size="large"
          placeholder="مثال: شقة رقم 4 - عمارة الياسمين"
          {...field}
        />
      ),
      xs: 24,
      lg: 12,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={isEdit ? "تعديل بيانات الشقة" : "إضافة شقة جديدة"}
        subtitle="تسجيل وتحديث بيانات موقع ومسمى الشقة التابعة للعميل"
        icon={<HomeOutlined />}
      />

      <CardComponent
        loading={isEdit && isApartmentLoading}
        className="p-4 sm:p-6 shadow-sm"
      >
        <FormComponent
          onCancel={onCancel}
          okText={isEdit ? "تعديل الشقة" : "إضافة الشقة"}
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

export default AddEditApartment;
