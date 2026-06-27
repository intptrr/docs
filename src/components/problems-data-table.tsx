'use client';

import { useMemo, useState } from 'react';
import Link from 'fumadocs-core/link';
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface Problem {
  id: number;
  name: string;
  url: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string[];
}

const difficultyStyles: Record<string, string> = {
  Easy: 'border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400',
  Medium:
    'border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-400',
  Hard: 'border-rose-600/30 bg-rose-600/10 text-rose-700 dark:text-rose-400',
};

const difficultyRank: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 };

const selectClass =
  'rounded-md border border-fd-border bg-fd-background px-2.5 py-1.5 text-sm text-fd-foreground outline-none focus:border-fd-primary';

export function ProblemsDataTable({
  data,
  showCategory,
}: {
  data: Problem[];
  showCategory: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'id', desc: false },
  ]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');

  const categories = useMemo(
    () => [...new Set(data.map((d) => d.category))].sort(),
    [data],
  );

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = [];
    if (difficulty) filters.push({ id: 'difficulty', value: difficulty });
    if (category) filters.push({ id: 'category', value: category });
    return filters;
  }, [difficulty, category]);

  const columns = useMemo<ColumnDef<Problem>[]>(() => {
    const cols: ColumnDef<Problem>[] = [
      {
        accessorKey: 'id',
        header: '#',
        cell: ({ getValue }) => (
          <span className="tabular-nums text-fd-muted-foreground">
            {getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Problem',
        cell: ({ row }) => (
          <Link
            href={row.original.url}
            className="font-medium text-fd-foreground hover:text-fd-primary"
          >
            {row.original.name}
          </Link>
        ),
      },
      {
        accessorKey: 'difficulty',
        header: 'Difficulty',
        filterFn: 'equalsString',
        sortingFn: (a, b) =>
          (difficultyRank[a.original.difficulty ?? ''] ?? 99) -
          (difficultyRank[b.original.difficulty ?? ''] ?? 99),
        cell: ({ getValue }) => {
          const value = getValue<string | undefined>();
          if (!value) return null;
          return (
            <span
              className={cn(
                'inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium',
                difficultyStyles[value],
              )}
            >
              {value}
            </span>
          );
        },
      },
    ];

    if (showCategory) {
      cols.push({
        accessorKey: 'category',
        header: 'Category',
        filterFn: 'equalsString',
        cell: ({ getValue }) => (
          <span className="text-fd-muted-foreground">
            {getValue<string>()}
          </span>
        ),
      });
    }

    cols.push({
      accessorKey: 'tags',
      header: 'Tags',
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="flex flex-wrap gap-1.5">
          {getValue<string[]>().map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-fd-border px-2 py-0.5 text-xs text-fd-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      ),
    });

    return cols;
  }, [showCategory]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnFilters },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, value) => {
      const p = row.original;
      const haystack = [
        p.name,
        p.category,
        p.difficulty ?? '',
        String(p.id),
        ...p.tags,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(String(value).toLowerCase());
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="not-prose my-6 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search problems…"
          className="min-w-48 flex-1 rounded-md border border-fd-border bg-fd-background px-3 py-1.5 text-sm text-fd-foreground outline-none focus:border-fd-primary"
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className={selectClass}
          aria-label="Filter by difficulty"
        >
          <option value="">All difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        {showCategory ? (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={selectClass}
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      <p className="text-xs text-fd-muted-foreground">
        Showing {rows.length} of {data.length} problems
      </p>

      <div className="overflow-x-auto rounded-lg border border-fd-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-fd-border bg-fd-muted/50 text-left"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className="px-4 py-2.5 font-medium text-fd-muted-foreground"
                    >
                      {canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1.5 hover:text-fd-foreground"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {sorted === 'asc' ? (
                            <ArrowUp className="size-3.5" />
                          ) : sorted === 'desc' ? (
                            <ArrowDown className="size-3.5" />
                          ) : (
                            <ChevronsUpDown className="size-3.5 opacity-50" />
                          )}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-fd-muted-foreground"
                >
                  No problems match your filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-fd-border/60 last:border-0 hover:bg-fd-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2.5 align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
