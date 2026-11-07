/* eslint-disable @typescript-eslint/no-explicit-any */
import { Empty, Pagination, Table } from "antd";
import { TablePaginationConfig, TableProps } from "antd/es/table";
import { ExpandableConfig, GetRowKey } from "antd/es/table/interface";
import React from "react";
import EmptyComponent from "./EmptyComponent";

export interface TableCompProps extends TableProps<any> {
  columns?: any;
  dataSource?: any[];
  pagination?: TablePaginationConfig | false | any;
  rowKey?: string | number | symbol | GetRowKey<any> | undefined;
  loading?: boolean;
  bordered?: boolean;
  total?: number;
  pageSize?: number;
  scroll?: any;
  footer?: any;
  pageNumber?: number;
  showHeader?: boolean;
  expandable?: ExpandableConfig<any> | undefined;
  showPagination?: boolean;
  onPageChange?: (page: number, pageSize: number) => void;
  onExpandedRowsChange?: (expandedRows: any[]) => void;
  className?: string;
  [key: string]: any;
}

export const TableComponent: React.FC<TableCompProps> = ({
  columns,
  dataSource,
  loading,
  scroll = { x: "max-content" },
  footer,
  rowKey = "_id",
  total,
  showHeader = true,
  bordered = false,
  expandable,
  pageSize = 10,
  pageNumber = 1,
  onPageChange,
  showPagination = true,
  className = "",
  ...rest
}) => {
  return (
    <div className="w-full space-y-4">
      <div className={`overflow-x-auto rounded-2xl border border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-[#1a1a1a] shadow-sm transition-colors ${className}`}>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey={rowKey}
          pagination={false}
          loading={loading}
          scroll={scroll}
          footer={footer}
          showHeader={showHeader}
          bordered={bordered}
          expandable={expandable}
          className="modern-app-table"
          locale={{
            emptyText: (
              <EmptyComponent
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="my-6"
                description="لا توجد بيانات متاحة حالياً"
              />
            ),
          }}
          {...rest}
        />
      </div>

      {showPagination && total !== undefined && total > 0 && (
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-2"
          style={{ direction: "rtl" }}
        >
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
            إجمالي السجلات: <span className="font-bold text-gray-800 dark:text-gray-200">{total}</span>
          </span>
          <Pagination
            style={{ direction: "rtl" }}
            defaultCurrent={pageNumber}
            current={pageNumber}
            total={total}
            pageSize={pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
            className="modern-pagination"
          />
        </div>
      )}
    </div>
  );
};

export default TableComponent;
