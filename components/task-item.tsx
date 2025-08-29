"use client"
import { Task } from "@/interfaces";
import { EllipsisVertical, Pencil } from "lucide-react";
import FormDialog from "@/components/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { patchTask } from "@/app/services/api";
import { toast } from "react-toastify";

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
import ChangeLogDialog from "./change-log-dialog";
export default function TaskItem({ task }: { task: Task }) {
    const [newName, setNewName] = useState(task.name);
    const [newStatus, setNewStatus] = useState(task.status);
    const [newContent, setNewContent] = useState(task.contents);
    const [remarks, setRemarks] = useState("");

    const handleEditTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await patchTask(parseInt(task.id), newName, newStatus, newContent);
            toast.success("Task Updated Successfully!", {
                position: "top-right",
            });
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            console.error("Failed to update project", err);
        }
    };
    return (
        <>
            <div key={task.id} className="mb-2 border rounded-md p-3 bg-gray-100">
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
                                            defaultValue="Todo"
                                            onValueChange={(value) => setNewStatus(value)}
                                            required
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Status</SelectLabel>
                                                    <SelectItem value="Todo">To Do</SelectItem>
                                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                                    <SelectItem value="Done">Done</SelectItem>
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
                <p className="text-xs text-gray-600">{task.contents}</p>
                <p className="text-xs text-gray-500 text-right">{task.status}</p>
            </div>
        </>
    );
}