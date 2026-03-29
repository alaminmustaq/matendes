"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Download, Calendar } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const StatusAction = ({ row, actions }) => {
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
    const [interviewDate, setInterviewDate] = useState("");

    const handleUpdate = async (status) => {
        if (status === "interview") {
            setIsInterviewModalOpen(true);
        } else {
            await actions.onUpdateStatus(row.id, status);
        }
    };

    const handleInterviewSubmit = async () => {
        if (!interviewDate) return;
        const success = await actions.onUpdateStatus(
            row.id,
            "interview",
            interviewDate,
        );
        if (success) {
            setIsInterviewModalOpen(false);
        }
    };

    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").split("/api/v1")[0];

    return (
        <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => handleUpdate("confirmed")}
                        className="text-success"
                    >
                        Mark as Confirmed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleUpdate("rejected")}
                        className="text-destructive"
                    >
                        Mark as Rejected
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleUpdate("interview")}
                        className="text-info"
                    >
                        Schedule Interview
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() =>
                            window.open(`${baseUrl}/storage/${row.cv_path}`, "_blank")
                        }
                    >
                        <div className="flex items-center gap-2">
                             <Download className="h-4 w-4" /> Download CV
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
                open={isInterviewModalOpen}
                onOpenChange={setIsInterviewModalOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Schedule Interview</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="date">Interview Date & Time</Label>
                            <Input
                                id="date"
                                type="datetime-local"
                                value={interviewDate}
                                onChange={(e) =>
                                    setInterviewDate(e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsInterviewModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleInterviewSubmit}>
                            Schedule
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const columns = (actions) => [
    {
        accessorKey: "job_title",
        header: "Job Title",
        cell: ({ row }) => (
            <div className="min-w-[150px]">
                {row.original.job_list?.job_title || "N/A"}
            </div>
        ),
    },
    {
        accessorKey: "full_name",
        header: "Applicant Info",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-semibold text-slate-900">
                    {row.original.full_name}
                </span>
                <span className="text-xs text-slate-500">
                    {row.original.email}
                </span>
                <span className="text-xs text-slate-500">
                    {row.original.phone}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "cv_path",
        header: "CV",
        cell: ({ row }) => {
            const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").split("/api/v1")[0];
            return (
                <div className="flex items-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            window.open(`${baseUrl}/storage/${row.original.cv_path}`, "_blank")
                        }
                    >
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" /> View CV
                        </div>
                    </Button>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status");
            const colors = {
                applied: "default",
                confirmed: "success",
                rejected: "destructive",
                interview: "info",
            };
            return (
                <div className="flex flex-col gap-1">
                    <Badge
                        variant={colors[status] || "default"}
                        className="capitalize w-fit"
                    >
                        {status}
                    </Badge>
                    {status === "interview" && row.original.interview_date && (
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{new Date(row.original.interview_date).toLocaleString()}</span>
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: "Applied At",
        cell: ({ row }) => (
            <div className="whitespace-nowrap">
                {new Date(row.getValue("created_at")).toLocaleDateString()}
            </div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <StatusAction row={row.original} actions={actions} />
        ),
    },
];

export default columns;
