import React from "react";
import { cn } from "@/lib/utils/cn";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  variant?: "default" | "striped";
}

type TableHeaderProps = React.ThHTMLAttributes<HTMLTableHeaderCellElement>;

type TableCellProps = React.TdHTMLAttributes<HTMLTableDataCellElement>;

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div className="w-full overflow-x-auto rounded-lg border border-white/20 bg-white/10 backdrop-blur-md shadow-sm">
        <table
          ref={ref}
          className={cn(
            "w-full border-collapse",
            variant === "striped" && "[&_tbody_tr:nth-child(odd)]:bg-white/5",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Table.displayName = "Table";

export const TableHead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-white/10 border-b border-white/20", className)}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-white/20", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "hover:bg-white/10 transition-colors duration-150",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export const TableHeader = React.forwardRef<
  HTMLTableHeaderCellElement,
  TableHeaderProps
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider",
      className
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

export const TableCell = React.forwardRef<
  HTMLTableDataCellElement,
  TableCellProps
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-6 py-4 text-sm text-gray-300", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";
