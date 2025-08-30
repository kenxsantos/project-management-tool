import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileClock, MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchTasksLogs } from "@/app/services/api";
import { ChangeLogs } from "@/interfaces";

interface ChangeLogDialogProps {
    taskId: number;
    taskName: string;
}

export default function ChangeLogDialog({ taskId, taskName }: ChangeLogDialogProps) {
    const [changeLogs, setChangeLogs] = useState<ChangeLogs[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const getAllLogs = async () => {
            try {
                const filtered = await fetchTasksLogs(taskId);
                setChangeLogs(filtered);

            } catch (err) {
                console.error("Failed to fetch projects", err);
            } finally {
                setLoading(false);
            }
        };

        getAllLogs();
    }, [taskId]);

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost">
                        <FileClock size={16} />
                        Change Log</Button>
                </DialogTrigger>
                <DialogContent className="max-h-[500px] md:max-h-[650px]s overflow-auto">
                    <DialogHeader>
                        <DialogTitle>
                            <span className="text-green-700">Logs - </span> {taskName}</DialogTitle>
                    </DialogHeader>
                    {loading ? (
                        <p className="text-gray-400 text-sm">Loading...</p>
                    ) : changeLogs.length === 0 ? (
                        <p className="text-gray-500 text-sm">No Logs found</p>
                    ) : (
                        changeLogs
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .map((log) => (
                                <div key={log.id} className="mb-2 border rounded-md p-3 bg-gray-100 grid gap-2">
                                    <p className="text-right text-xs">
                                        {
                                            new Date(log.created_at).toLocaleString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                                hour12: true,
                                                timeZone: "Asia/Manila",
                                            })}</p>
                                    <div className="flex justify-between items-center border rounded-sm p-2">
                                        <p className="text-right text-xs font-bold ">Status:</p>
                                        <div className="flex justify-between items-center gap-3">
                                            <p className="text-right text-xs text-red-700"><s>{log.old_status}</s></p>
                                            <MoveRight />
                                            <p className="text-right text-xs">{log.new_status}</p>
                                        </div>
                                    </div>
                                    <div className="flex-col justify-left border rounded-sm p-2">
                                        <p className="text-left text-xs font-bold">Remarks:</p>
                                        <p className="text-left text-xs text-gray-500">{log.remark}</p>
                                    </div>
                                </div>
                            ))
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="destructive">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>

            </Dialog>
        </>
    );
}