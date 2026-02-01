import React from "react";

export type ColumnDefinition<T> = {
  header: React.ReactNode;
  className?: string;
};

export type BaseTableProps<T> = {
  data: readonly T[];
  columns?: ColumnDefinition<T>[];
  renderRow: (item: T, index: number) => React.ReactNode;
  rowKey?: (item: T, index: number) => React.Key;
  isLoading?: boolean;
  loadingLabel?: React.ReactNode;
  emptyLabel?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  bodyClassName?: string;
  loadingClassName?: string;
  emptyClassName?: string;
  renderHeader?: React.ReactNode;
};

const BaseTable = <T extends unknown>({
  data,
  columns,
  renderRow,
  rowKey = (item: T, index: number) => index,
  isLoading,
  loadingLabel,
  emptyLabel,
  className = "",
  containerClassName = "",
  bodyClassName = "divide-y text-sm font-bold",
  loadingClassName = "p-20 text-center text-gray-300 uppercase tracking-[0.3em]",
  emptyClassName = "p-12 text-center text-gray-400 font-bold uppercase tracking-[0.25em]",
  renderHeader,
}: BaseTableProps<T>) => {
  const columnCount = Math.max(columns?.length ?? 0, 1);

  return (
    <div
      className={`bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden ${containerClassName}`}
    >
      <table
        role="table"
        className={`w-full text-left border-collapse ${className}`}
      >
        {renderHeader ??
          (columns && (
            <thead className="bg-gray-50/50 text-[10px] text-gray-400 uppercase tracking-widest border-b">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    scope="col"
                    className={`px-8 py-6 ${column.className ?? ""}`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
          ))}
        <tbody className={bodyClassName}>
          {isLoading ? (
            <tr>
              <td colSpan={columnCount} className={loadingClassName}>
                {loadingLabel ?? "Loading..."}
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className={emptyClassName}>
                {emptyLabel ?? "No records found."}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <React.Fragment key={rowKey(item, index)}>
                {renderRow(item, index)}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BaseTable;
