/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Row, Tooltip } from "antd";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import ButtonComponent from "./ButtonComponent";

export interface FilterInputItem {
  name: string;
  render: (field: any) => React.ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  order?: number;
}

export interface FilterCompProps {
  inputsArr: FilterInputItem[] | any[];
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  control: Control<any>;
  errors: FieldErrors<any> | any;
  onCancel?: any;
  okText?: string;
  loading?: boolean;
  cancelText?: string;
  clear?: React.FormEventHandler<HTMLFormElement> | any;
  className?: string;
  [key: string]: any;
}

export const FilterComponent: React.FC<FilterCompProps> = ({
  inputsArr,
  control,
  onSubmit,
  errors,
  okText = "بحث",
  cancelText = "مسح التصفية",
  loading = false,
  clear,
  className = "",
}) => {
  return (
    <form
      dir="rtl"
      className={`w-full bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-sm transition-colors ${className}`}
      onSubmit={onSubmit}
      role="search"
      aria-label="نموذج البحث والتصفية"
    >
      <Row dir="rtl" className="w-full" gutter={[16, 16]} align="middle">
        {inputsArr.map((data, i) => (
          <Col
            key={data.name || i}
            dir="rtl"
            xs={data.xs || 24}
            sm={data.sm || data.xs || 24}
            md={data.md || data.lg || 12}
            lg={data.lg || 6}
            order={data.order}
            className="relative"
          >
            <Controller
              name={data.name}
              control={control}
              render={({ field }) => data.render(field)}
            />
            {errors && errors[data.name]?.message && (
              <p
                role="alert"
                className="text-xs text-red-500 mt-1 absolute -bottom-5 right-0 animate-fade-in"
              >
                {String(errors[data.name]?.message)}
              </p>
            )}
          </Col>
        ))}

        <Col xs={24} sm="auto" className="flex flex-wrap sm:flex-nowrap gap-2 items-center mr-auto w-full sm:w-auto justify-end sm:justify-start pt-1 sm:pt-0">
          <ButtonComponent
            htmlType="submit"
            type="primary"
            loading={loading}
            icon={<SearchOutlined />}
            text={okText}
            tooltipTitle={okText}
            className="shadow-sm flex-1 sm:flex-none font-semibold"
          />
          {clear && (
            <ButtonComponent
              htmlType="button"
              type="default"
              onClick={clear}
              icon={<DeleteOutlined className="text-gray-500 hover:text-red-500" />}
              text={cancelText}
              ariaLabel={cancelText}
              tooltipTitle={cancelText}
              className="hover:border-red-300 hover:text-red-500 flex-1 sm:flex-none font-semibold"
            />
          )}
        </Col>
      </Row>
    </form>
  );
};

export default FilterComponent;
