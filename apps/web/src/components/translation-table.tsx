import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Button,
  Dialog,
  DialogCloseElement,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
} from "@interflex-app/ui";
import { SUPPORTED_LANGUAGES } from "../consts";
import {
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import {
  TranslationRowState,
  TranslationStateRow,
  useTranslationState,
} from "../hooks/use-translation-state";
import { RouterError } from "../utils/api";
import { MoreHorizontal, Workflow } from "lucide-react";
import {
  Variable,
  VariableType,
  extractVariablesFromString,
} from "../utils/variables";
import { useVariablesState } from "../hooks/use-variables-state";

const VariableEditor: React.FC<{
  variableNames: string[];
  variableData: Variable[];
  onSave: (data: Variable[]) => void;
}> = ({ variableNames, variableData, onSave }) => {
  const { data, changeVariableType } = useVariablesState(
    variableData,
    variableNames
  );

  return (
    <Dialog>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                disabled={variableNames.length === 0}
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <Workflow className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Edit variables</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Variables</DialogTitle>
          <DialogDescription>
            Edit variables visible in your translations and their types.
          </DialogDescription>
        </DialogHeader>

        <div className="my-6 flex flex-col gap-2">
          {data.map((variable) => (
            <div
              key={variable.name}
              className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-2 dark:border-gray-800"
            >
              <span>{variable.name}</span>
              <div>
                <Select
                  defaultValue={variable.type}
                  onValueChange={(value) =>
                    changeVariableType(variable.name, value as VariableType)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choose a type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(VariableType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.toLocaleLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <DialogCloseElement asChild>
            <Button variant="outline">Cancel</Button>
          </DialogCloseElement>
          <DialogCloseElement asChild>
            <Button onClick={() => onSave(data)}>Save</Button>
          </DialogCloseElement>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface TranslationTableProps {
  initialData: TranslationStateRow[];
  languages: typeof SUPPORTED_LANGUAGES;
  error:
    | (Omit<RouterError, "code" | "data"> & {
        data?: RouterError["data"] | null;
      })
    | null;
}

export type TranslationTableRef = {
  getActions: ReturnType<typeof useTranslationState>["getActions"];
  resetWithState: ReturnType<typeof useTranslationState>["resetWithState"];
};

const TranslationTable = forwardRef<TranslationTableRef, TranslationTableProps>(
  ({ initialData, languages, error }, ref) => {
    const {
      data,
      getActions,
      updateKey,
      updateValue,
      resetWithState,
      deleteRow,
      revertRow,
      updateVariables,
    } = useTranslationState(initialData);

    useImperativeHandle(ref, () => ({
      getActions,
      resetWithState,
    }));

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
          cell: ({ row }) => {
            const variableNames = Array.from(
              new Set(
                row.original.values.flatMap((v) =>
                  extractVariablesFromString(v.value)
                )
              )
            );

            return row.original.state !== TranslationRowState.Placeholder ? (
              <div className="flex items-center gap-2">
                <VariableEditor
                  onSave={(variables) =>
                    updateVariables(row.original.id, variables)
                  }
                  variableData={row.original.variables}
                  variableNames={variableNames}
                />

                <TooltipProvider delayDuration={0}>
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>Options</TooltipContent>
                    </Tooltip>

                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>

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
                </TooltipProvider>
              </div>
            ) : null;
          },
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
                  "border-l-2",
                  row.original.state === TranslationRowState.Deleted &&
                    "border-l-red-500 opacity-50",
                  row.original.state === TranslationRowState.Updated &&
                    "border-l-yellow-500",
                  row.original.state === TranslationRowState.Created &&
                    "border-l-lime-500"
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
