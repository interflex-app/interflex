import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@interflex-app/ui";
import { SUPPORTED_LANGUAGES } from "../consts";
import { useMemo } from "react";

interface TranslationTableProps<TData, TValue> {
  data: TData[];
  languages: typeof SUPPORTED_LANGUAGES;
}

export function TranslationTable<TData, TValue>({
  data,
  languages,
}: TranslationTableProps<TData, TValue>) {
  const columns = useMemo(() => {
    return [
      {
        id: "Key",
        header: "Key",
        cell: () => <Input placeholder="Key..." />,
      },
      ...languages.map((lang) => ({
        id: `lang-${lang.value}`,
        header: lang.label,
        cell: () => <Input placeholder="Value..." />,
      })),
    ] as ColumnDef<TData, TValue>[];
  }, [languages]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}

          <TableRow>
            <TableCell>
              <Input placeholder="Key..." />
            </TableCell>

            {languages.map((lang) => (
              <TableCell key={lang.value}>
                <Input placeholder="Value..." />
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
