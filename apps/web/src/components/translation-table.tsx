import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from "@interflex-app/ui";
import { SUPPORTED_LANGUAGES } from "../consts";
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import {
  TranslationActionEntry,
  TranslationRowState,
  TranslationStateRow,
  useTranslationState,
} from "../hooks/use-translation-state";
import { RouterError } from "../utils/api";
import { MoreHorizontal } from "lucide-react";

interface TranslationTableProps {
  initialData: TranslationStateRow[];
  languages: typeof SUPPORTED_LANGUAGES;
  error:
    | (Omit<RouterError, "code" | "data"> & {
        data?: RouterError["data"] | null;
      })
    | null;
  onActionsChange: (actions: TranslationActionEntry[]) => void;
}

export type TranslationTableRef = {
  resetWithState: ReturnType<typeof useTranslationState>["resetWithState"];
};

const TranslationTable = forwardRef<TranslationTableRef, TranslationTableProps>(
  ({ initialData, languages, error, onActionsChange }, ref) => {
    const {
      data,
      actions,
      updateKey,
      updateValue,
      resetWithState,
      deleteRow,
      revertRow,
    } = useTranslationState(initialData);

    useImperativeHandle(
      ref,
      () => ({
        resetWithState,
      }),
      [data]
    );

    useEffect(() => {
      onActionsChange(actions);
    }, [actions]);

    const getError = (rowId: string, rowKey: string) => {
      const issue = error?.data?.zodErrorIssues?.find(
        (issue) =>
          (issue.input as TranslationStateRow)["id"] === rowId &&
          issue.path.includes(rowKey)
      );

      if (!issue) return null;

      return issue.message;
    };

    const columns = useMemo(() => {
      return [
        {
          id: "key",
          header: "Key",
          cell: ({ row }) => (
            <>
              <Input
                className="min-w-[200px]"
                placeholder="Key..."
                value={row.original.key}
                onChange={(e) => updateKey(row.original.id, e.target.value)}
                disabled={row.original.locked}
              />
              {getError(row.original.id, "key") && (
                <div className="mt-2 text-red-700 dark:text-red-300">
                  {getError(row.original.id, "key")}
                </div>
              )}
            </>
          ),
        },
        ...languages.map(
          (lang) =>
            ({
              id: `lang-${lang.value}`,
              header: lang.label,
              cell: ({ row }) => (
                <Input
                  className="min-w-[300px]"
                  placeholder="Value..."
                  value={
                    row.original.values.find((v) => v.language === lang.value)
                      ?.value ?? ""
                  }
                  onChange={(e) =>
                    updateValue(row.original.id, lang.value, e.target.value)
                  }
                  disabled={row.original.locked}
                />
              ),
            } as ColumnDef<TranslationStateRow>)
        ),
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) =>
            row.original.state !== TranslationRowState.Placeholder && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>

                  {row.original.state !== TranslationRowState.Deleted ? (
                    <DropdownMenuItem
                      onClick={() => deleteRow(row.original.id)}
                    >
                      Remove translation
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => revertRow(row.original.id)}
                    >
                      Undo removal
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ),
        },
      ] as ColumnDef<TranslationStateRow>[];
    }, [languages, error]);

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
                    <TableHead className="uppercase" key={header.id}>
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
                className={cn(
                  row.original.state === TranslationRowState.Deleted &&
                    "opacity-50"
                )}
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
          </TableBody>
        </Table>
      </div>
    );
  }
);

TranslationTable.displayName = "TranslationTable";

export { TranslationTable };
