"use client"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import { createTask, fetchProjectTasks } from "@/services/api";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner";
import TaskItem from "./task-item";
import { Task } from "@/interfaces";
import { useDroppable } from "@dnd-kit/core";
import { useTasksStore } from "@/store/useTasksStore";
import { motion } from "motion/react";


interface ColumnContainerProps {
    status: string;
    project_id: number;
    tasks: Task[];
}

export default function ColumnContainer({ status, tasks, project_id }: ColumnContainerProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const { setNodeRef } = useDroppable({
        id: status,
        data: { columnId: status },
    });
    const { setTasks } = useTasksStore()

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setOpen(false);
        try {
            const res = await createTask(project_id, name, status, content);

            if (res.status === 201) {
                toast.success("Task Added Successfully!", {
                    position: "top-right",
                });

                const newData = await fetchProjectTasks(project_id);
                setTasks(newData);

                setName("");
                setContent("");
            }
        } catch (err) {
            console.error("Failed to add project", err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.4,
                delay: 0.5,
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
        >
            <Card ref={setNodeRef} className="bg-gray-100 border-none">
                <CardHeader>
                    <CardTitle>{status}</CardTitle>
                </CardHeader>
                <CardContent>
                    {tasks.length === 0 ? (
                        <p className="text-gray-500 text-sm">No Tasks found</p>
                    ) : (
                        <SortableContext
                            items={tasks.map((t) => String(t.id))}
                            strategy={verticalListSortingStrategy}
                        >
                            {tasks.map((task) => (
                                <TaskItem key={String(task.id)} task={task} />
                            ))}
                        </SortableContext>
                    )}
                </CardContent>
                <CardFooter>
                    <Dialog
                        open={open}
                        onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full bg-green-600 hover:bg-green-500 cursor-pointer">
                                <Plus /> Add Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleAddTask}>
                                <DialogHeader>
                                    <DialogTitle>Add New Task</DialogTitle>
                                    <DialogDescription>
                                        Add your new task here. Click save when you&apos;re done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 mt-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="name">Task Name</Label>
                                        <Input
                                            type="text"
                                            placeholder="Project Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            id="name"
                                            name="name" />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="content">Description</Label>
                                        <Textarea
                                            placeholder="Type your content here."
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            required
                                            id="content"
                                            name="content"
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="mt-4">
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
        </motion.div>
    );
}