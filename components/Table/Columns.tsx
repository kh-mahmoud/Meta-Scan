"use client";

import { Report } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { FileText, Loader2 } from "lucide-react";
import { formatDate, getSpinnerColor } from "@/lib/utils";
import StatusBadge from "../Status-Badge";
import ActionModal from "../ActionModal";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const ReportColumns: ColumnDef<Report>[] = [
  {
    accessorKey: "_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Report" />
    ),
    cell: ({ row }) => {
      const job = row.original as Report;

      return (
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-muted/50 rounded-md">
            <FileText className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {(job.status === "pending" ||
                job.status === "running" ||
                job.status === "analyzing") && (
                <Loader2
                  className={`w-4 h-4 animate-spin ${getSpinnerColor(job.status)}`}
                />
              )}
              <span className="truncate font-medium text-foreground">
                {job.scrapePrompt}
              </span>
            </div>
            {job.snapshotId && (
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                ID: {job.snapshotId.slice(0, 8)}...
              </p>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const job = row.original as Report;

      return <StatusBadge status={job.status} showIcon={true} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const job = row.original as Report;

      return formatDate(job.createdAt);
    },
  },

  {
    accessorKey: "completedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Completed" />
    ),
    cell: ({ row }) => {
      const job = row.original as Report;

      return job.completedAt ? (
        formatDate(job.completedAt)
      ) : (
        <span className="text-muted-foreground/60">-</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionModal jobId={row.original._id}/>
  },
];
