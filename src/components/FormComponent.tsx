/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Flex, Row, Tooltip } from "antd";
import React from "react";
import { Control, Controller, FieldErrors, FormProps } from "react-hook-form";
import ButtonComponent from "./ButtonComponent";
import { DeleteOutlined } from "@ant-design/icons";

export interface FormCompProps extends FormProps<any> {
  inputsArr: any[];
  onSubmit: React.FormEventHandler<HTMLFormElement> | any;
  control: Control<any>;
  errors?: FieldErrors<any> | any;
  onCancel?: any;
  okText?: string;
  loading?: boolean;
  cancelText?: string;
  onAdd?: any;
  hideButtons?: boolean;
  className?: string;
  [key: string]: any;
}

export const FormComponent: React.FC<FormCompProps> = ({
  inputsArr,
  onCancel,
  control,
  onSubmit,
  errors,
  okText = "حفظ",
  cancelText = "إلغاء",
  loading = false,
  hideButtons = false,
  className = "",
}) => {
  const getErrorMessage = (name: any, childName: any, index: number) => {
    if (errors && errors[name]) {
      if (errors[name][index]) {
        return errors[name][index][childName]?.message;
      }
      return null;
    }
    return null;
  };

  return (
    <form
      dir="rtl"
      onSubmit={onSubmit}
      autoComplete="off"
      className={`space-y-6 ${className}`}
    >
      <Row dir="rtl" gutter={[20, 20]}>
        {inputsArr.map((data, i) =>
          data?.isArray ? (
            <Col
              key={data.name || i}
              dir="rtl"
              xs={data.xs || 24}
              lg={data.lg || 24}
              order={data.order}
              className={`w-full ${data.className || ""}`}
            >
              <div className="rounded-2xl border border-gray-200/90 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30 p-4 sm:p-5 mb-4 shadow-sm">
                <Flex
                  justify="space-between"
                  align="center"
                  className="mb-4 pb-2 border-b border-gray-200/60 dark:border-neutral-800"
                >
                  <div className="w-full text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">
                    {data.label}
                  </div>
                </Flex>

                {data?.fields?.length === 0 ? (
                  <div className="py-6 text-center text-gray-400 dark:text-gray-500 text-sm">
                    لم تتم إضافة أي عناصر بعد. انقر على زر الإضافة أعلاه.
                  </div>
                ) : (
                  data?.fields?.map((field: any, index: any) => (
                    <div
                      key={field?.id || index}
                      className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200/80 dark:border-neutral-800 p-3 sm:p-4 mb-3 transition-shadow hover:shadow-sm"
                    >
                      <Row
                        dir="rtl"
                        gutter={[16, 16]}
                        align="bottom"
                        className="w-full"
                      >
                        {data?.children?.map((child: any, cIndex: any) => (
                          <Col
                            key={child.name || cIndex}
                            dir="rtl"
                            xs={child.xs || 24}
                            sm={child.sm || child.xs || 24}
                            md={child.md || child.lg || 12}
                            lg={child.lg || 24}
                            order={child.order}
                            className="relative"
                          >
                            {child.label && (
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                                {child.label}
                              </label>
                            )}
                            <Controller
                              name={`${data?.name}.${index}.${child.name}`}
                              control={control}
                              render={({ field: controllerField }) =>
                                child.render(controllerField, index)
                              }
                            />
                            {errors && errors[data?.name] && (
                              <p
                                role="alert"
                                className="text-xs text-red-500 mt-1"
                              >
                                {getErrorMessage(data?.name, child.name, index)}
                              </p>
                            )}
                          </Col>
                        ))}

                        {/* Modern delete button aligned to the left */}
                        <Col
                          xs={24}
                          sm={24}
                          md={2}
                          lg={1}
                          xl={1}
                          className="flex flex-col justify-end items-end mr-auto"
                          style={{ marginRight: "auto" }}
                        >
                          {/* Label spacer for vertical alignment with input boxes */}
                          <div
                            className="h-[22px] mb-1 hidden md:block"
                            aria-hidden="true"
                          />
                          <Tooltip title="حذف هذا البند" placement="top">
                            <button
                              type="button"
                              onClick={() => data?.onRemove(index)}
                              aria-label="حذف هذا البند"
                              className="h-10 w-10 flex items-center justify-center rounded-xl border border-red-200/80 dark:border-red-900/40 bg-red-50/70 dark:bg-red-950/20 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600 shadow-sm transition-all duration-200 active:scale-90 group cursor-pointer"
                            >
                              <DeleteOutlined className="text-base transition-transform duration-200 group-hover:scale-110" />
                            </button>
                          </Tooltip>
                        </Col>
                      </Row>
                    </div>
                  ))
                )}
              </div>
            </Col>
          ) : (
            <Col
              key={data.name || i}
              dir="rtl"
              xs={data.xs || 24}
              sm={data.sm || data.xs || 24}
              lg={data.lg || 24}
              order={data.order}
              className="relative"
            >
              {data.label && (
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                  {data.label}
                </label>
              )}
              <Controller
                name={data.name}
                control={control}
                render={({ field }) => data.render(field)}
              />
              {errors && errors[data.name]?.message && (
                <p
                  role="alert"
                  className="text-xs text-red-500 mt-1.5 animate-fade-in"
                >
                  {String(errors[data.name]?.message)}
                </p>
              )}
            </Col>
          )
        )}

        {!hideButtons && (
          <Col
            dir="rtl"
            xs={24}
            className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100 dark:border-neutral-800"
          >
            <ButtonComponent
              htmlType="submit"
              text={okText}
              type="primary"
              size="large"
              loading={loading}
              className="px-6 font-semibold shadow-sm"
            />
            {onCancel && (
              <ButtonComponent
                text={cancelText}
                size="large"
                onClick={onCancel}
                className="px-6"
              />
            )}
          </Col>
        )}
      </Row>
    </form>
  );
};

export default FormComponent;
