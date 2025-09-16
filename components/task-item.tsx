"use client"
import { Task } from "@/interfaces";
import { EllipsisVertical, GripVertical, Pencil } from "lucide-react";
import FormDialog from "@/components/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { createChangeLog, patchTask } from "@/services/api";
import { toast } from "sonner";
import { Status, StatusLabels } from "@/lib/status";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ChangeLogDialog from "@/components/change-log-dialog";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
interface TaskItemProps {
    task: Task;
    isOverlay?: boolean;
    overTaskId?: number | null;
}
export default function TaskItem({ task, isOverlay = false, overTaskId }: TaskItemProps) {
    const [newName, setNewName] = useState(task.name);
    const [newStatus, setNewStatus] = useState(task.status);
    const [newContent, setNewContent] = useState(task.contents);
    const [remarks, setRemarks] = useState("");
    const taskId = parseInt(task.id);

    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: String(task.id), data: { columnId: task.status } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleEditTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await patchTask(taskId, newName, newStatus, newContent);
            await createChangeLog(taskId, task.status, newStatus, remarks);
            toast.success("Task Updated Successfully!", {
                position: "top-right",
            });

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            console.error("Failed to update project", err);
        }
    };
    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                className={`mb-2 border rounded-md p-3 transition-all duration-200 flex justify-between gap-2
    ${isOverlay
                        ? "bg-white shadow-2xl scale-105 opacity-90"
                        : parseInt(task.id) === overTaskId
                            ? "bg-gray-200 blur-[2px] opacity-70"
                            : "bg-gray-100"
                    }`}>
                <div  {...listeners} className=" items-center flex justify-center cursor-grab">
                    <GripVertical />
                </div>
                <div className=" w-full">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium">{task.name}</h3>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <EllipsisVertical size={16} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <FormDialog
                                        triggerIcon={<Pencil />}
                                        triggerLabel="Edit Task"
                                        triggerVariant="ghost"
                                        title="Edit Task"
                                        description="Edit your task name here. Click save when you're done."
                                        onSubmit={handleEditTask}
                                        submitLabel="Save changes"
                                    >
                                        <div className="grid gap-3">
                                            <Label htmlFor="newName">Task Name</Label>
                                            <Input
                                                type="text"
                                                id="newName"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                placeholder="New Task Name"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="newContent">Content</Label>
                                            <Textarea
                                                id="newContent"
                                                value={newContent}
                                                onChange={(e) => setNewContent(e.target.value)}
                                                placeholder="Type your new content here."
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="newContent">Status</Label>
                                            <Select
                                                defaultValue={task.status}
                                                onValueChange={(value) => setNewStatus(value as Status)}
                                                required
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Status</SelectLabel>
                                                        {Object.values(Status).map((status) => (
                                                            <SelectItem
                                                                key={status}
                                                                value={status}
                                                                disabled={status === task.status}
                                                            >
                                                                {StatusLabels[status]}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="remarks">Remarks</Label>
                                            <Textarea
                                                id="remarks"
                                                value={remarks}
                                                onChange={(e) => setRemarks(e.target.value)}
                                                placeholder="Type your remarks here."
                                                required
                                            />
                                        </div>
                                    </FormDialog>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <ChangeLogDialog taskId={parseInt(task.id)} taskName={task.name} />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className=" flex justify-between">
                        <p className="text-xs text-gray-600">
                            {task.contents.length > 10
                                ? task.contents.slice(0, 20) + "..."
                                : task.contents}
                        </p>
                        <p className="text-xs text-gray-500 ">{task.status}</p>
                    </div>
                </div>
            </div>
        </>
    );
}