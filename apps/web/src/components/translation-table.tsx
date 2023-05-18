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
import {
  TranslationStateRow,
  useTranslationState,
} from "../hooks/use-translation-state";

interface TranslationTableProps {
  initialData: TranslationStateRow[];
  languages: typeof SUPPORTED_LANGUAGES;
}

export function TranslationTable({
  initialData,
  languages,
}: TranslationTableProps) {
  const { data, getActions, updateKey, updateValue } =
    useTranslationState(initialData);

  const columns = useMemo(() => {
    return [
      {
        id: "key",
        header: "Key",
        cell: ({ row }) => (
          <Input
            placeholder="Key..."
            value={row.original.key}
            onChange={(e) => updateKey(row.original.id, e.target.value)}
          />
        ),
      },
      ...languages.map(
        (lang) =>
          ({
            id: `lang-${lang.value}`,
            header: lang.label,
            cell: ({ row }) => (
              <Input
                placeholder="Value..."
                defaultValue={
                  row.original.values.find((v) => v.language === lang.value)
                    ?.value
                }
                onChange={(e) =>
                  updateValue(row.original.id, lang.value, e.target.value)
                }
              />
            ),
          } as ColumnDef<TranslationStateRow>)
      ),
    ] as ColumnDef<TranslationStateRow>[];
  }, [languages]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log(data, getActions());

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
                <TableCell className="min-w-[300px]" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}

          <TableRow>
            <TableCell className="min-w-[300px]">
              <Input
                placeholder="Key..."
                onChange={(e) => updateKey(null, e.target.value)}
              />
            </TableCell>

            {languages.map((lang) => (
              <TableCell className="min-w-[300px]" key={lang.value}>
                <Input
                  placeholder="Value..."
                  onChange={(e) =>
                    updateValue(null, lang.value, e.target.value)
                  }
                />
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
