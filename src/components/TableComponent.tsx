/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Empty, Pagination, Table } from "antd";
import { ColumnType, TablePaginationConfig, TableProps } from "antd/es/table";
import { ExpandableConfig, GetRowKey } from "antd/es/table/interface";
import EmptyComponent from "./EmptyComponent";

interface TableCompProps extends TableProps<any>  {
  columns?: ColumnType[] | any ;
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
  showPagination?:boolean
  onPageChange?: (page: number, pageSize: number) => void;
  onExpandedRowsChange?: (expandedRows: any[]) => void;
  [key: string]: any;
}
const TableComponent = ({
  columns,
  dataSource,
  pagination,
  loading,
  scroll,
  footer,
  rowKey,
  total,
  showHeader,
  bordered,
  expandable,
  pageSize,
  pageNumber,
  onPageChange,
  showPagination = true,
  ...reset
}:TableCompProps) => {
  return (
    <>
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
      locale={{emptyText:<EmptyComponent image={Empty.PRESENTED_IMAGE_SIMPLE} className=" my-5" description='لا توجد بيانات'/>}}
      {...reset}
    />
    {showPagination&&
    <div className=" flex justify-end my-2 items-center" style={{direction:'rtl'}}>
    <Pagination style={{direction:'rtl'}}  defaultCurrent={pageNumber} current={pageNumber} total={total} pageSize={pageSize} onChange={onPageChange}/>
    </div>
    }
    </>
  );
};

export default TableComponent;
