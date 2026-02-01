import React from "react";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
}

const Table: React.FC<TableProps> = ({
  children,
  className = "",
  containerClassName = "",
  ...props
}) => (
  <div
    className={`bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden ${containerClassName}`}
  >
    <table
      className={`w-full text-left border-collapse ${className}`}
      {...props}
    >
      {children}
    </table>
  </div>
);

const THead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <thead
    className={`bg-gray-50/50 text-[10px] text-gray-400 uppercase tracking-widest border-b ${className}`}
    {...props}
  >
    {children}
  </thead>
);

const TBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <tbody className={`divide-y font-bold text-sm ${className}`} {...props}>
    {children}
  </tbody>
);

const TR: React.FC<
  React.HTMLAttributes<HTMLTableRowElement> & { isHoverable?: boolean }
> = ({ children, className = "", isHoverable = true, ...props }) => (
  <tr
    className={`${isHoverable ? "hover:bg-gray-50/50" : ""} transition-colors group ${className}`}
    {...props}
  >
    {children}
  </tr>
);

const TH: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = "",
  scope = "col",
  ...props
}) => (
  <th className={`px-8 py-6 ${className}`} scope={scope} {...props}>
    {children}
  </th>
);

const TD: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <td className={`px-8 py-6 ${className}`} {...props}>
    {children}
  </td>
);

export { Table, THead, TBody, TR, TH, TD };
