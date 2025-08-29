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
import { useEffect, useState } from "react";
import { createTask, fetchProjectTasks } from "@/app/services/api";
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
import { toast, ToastContainer } from "react-toastify";
import { Task } from "@/interfaces";
import TaskItem from "./task-item";
interface ColumnContainerProps {
    status: string;
    project_id: number;
}


export default function ColumnContainer({ status, project_id }: ColumnContainerProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        const getAllTasks = async () => {
            setLoading(true);

            try {
                const filtered = await fetchProjectTasks(project_id, status);
                setTasks(filtered);

            } catch (err) {
                console.error("Failed to fetch projects", err);
            } finally {
                setLoading(false);
            }
        };

        getAllTasks();
    }, [project_id, status]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setOpen(false);
        try {
            const res = await createTask(project_id, name, status, content);

            if (res.status === 201) {
                toast.success("Task Added Successfully!", {
                    position: "top-right"
                });
                setName("");
                setContent("");

                const filtered = await fetchProjectTasks(project_id, status);
                setTasks(filtered);

            }
        } catch (err) {
            console.error("Failed to add project", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <ToastContainer />
            <Card className="sm:w-[500px] md:w-[350px] lg:w-[500px]">
                <CardHeader>
                    <CardTitle>{status}</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-gray-400 text-sm">Loading...</p>
                    ) : tasks.length === 0 ? (
                        <p className="text-gray-500 text-sm">No Tasks found</p>
                    ) : (
                        tasks.map((task) => (
                            <TaskItem key={task.id} task={task} />
                        ))
                    )}
                </CardContent>
                <CardFooter>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full">
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
        </div>
    );
}