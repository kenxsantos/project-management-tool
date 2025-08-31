"use client"
import { createChangeLog, fetchAllTasks, fetchProject, patchProject, patchTask } from "@/app/services/api";
import ColumnContainer from "@/components/column-container";
import FormDialog from "@/components/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Project, Task } from "@/interfaces";
import { Status } from "@/lib/status";
import { Pencil } from "lucide-react";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import TaskItem from "@/components/task-item";
import { formatDate } from "@/lib/format-date";

interface ProjectPageProps {
    params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
    const { id } = use(params);
    const projectId = parseInt(id);
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
    const [overTaskId, setOverTaskId] = useState<number | null>(null);

    useEffect(() => {
        const getProject = async () => {
            try {
                const res = await fetchProject(projectId);
                setProject(res.data);
                setNewName(res.data.name);
                setNewDescription(res.data.description);

                const allTasks = await fetchAllTasks();
                setTasks(allTasks.filter((t: Task) => t.project_id === projectId));

            } catch (err) {
                console.error("Failed to fetch project", err);
            }
        };

        getProject();
    }, [projectId]);

    const handleEditProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await patchProject(projectId, newName, newDescription);
            toast.success("Project Updated Successfully!", {
                position: "top-right",
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (err) {
            console.error("Failed to update project", err);
        }
    };

    const handleDragStart = (event: any) => {
        setActiveTaskId(event.active.id);
    };

    const handleDragOver = (event: any) => {
        const { over } = event;
        if (over) {
            if (over.data.current?.columnId) {
                setOverTaskId(null);
            } else {
                setOverTaskId(over.id);
            }
        } else {
            setOverTaskId(null);
        }
    };

    const handleDragEnd = async (event: any) => {
        setActiveTaskId(null);
        setOverTaskId(null);

        const { active, over } = event;

        if (!over) return;
        if (active.id === over.id) return;

        const activeTask = tasks.find((t) => String(t.id) === active.id);
        if (!activeTask) return;

        const overTask = tasks.find((t) => String(t.id) === over.id);

        if (overTask && activeTask.status === overTask.status) {
            const columnTasks = tasks.filter((t) => t.status === activeTask.status);
            const oldIndex = columnTasks.findIndex((t) => String(t.id) === active.id);
            const newIndex = columnTasks.findIndex((t) => String(t.id) === over.id);

            const newColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);

            setTasks((prev) => {
                const otherTasks = prev.filter((t) => t.status !== activeTask.status);
                return [...otherTasks, ...newColumnTasks];
            });
        }

        else if (overTask && activeTask.status !== overTask.status) {
            const newStatus = overTask.status;

            setTasks((prev) => {
                const withoutActive = prev.filter((t) => String(t.id) !== active.id);
                const targetColumnTasks = withoutActive.filter(
                    (t) => t.status === newStatus
                );

                const overIndex = targetColumnTasks.findIndex(
                    (t) => String(t.id) === over.id
                );

                targetColumnTasks.splice(overIndex, 0, {
                    ...activeTask,
                    status: newStatus,
                });

                const otherTasks = withoutActive.filter((t) => t.status !== newStatus);
                return [...otherTasks, ...targetColumnTasks];
            });

            try {

                const oldTask = tasks.find((t) => String(t.id) === String(activeTask.id));
                const oldStatus = oldTask ? oldTask.status : null;

                await patchTask(
                    Number(activeTask.id),
                    activeTask.name,
                    newStatus,
                    activeTask.contents
                );


                if (oldStatus && oldStatus !== newStatus) {
                    await createChangeLog(
                        Number(activeTask.id),
                        oldStatus,
                        newStatus,
                        "Change Status"
                    );
                }
                toast.success("Task Updated Successfully!", {
                    position: "top-right",
                    autoClose: 2000,
                });
            } catch (err) {
                console.error("Failed to update task status", err);
            }
        }

        else if (over.data.current?.columnId) {
            const newStatus = over.data.current.columnId;
            setTasks((prev) => [
                ...prev.filter((t) => String(t.id) !== active.id),
                { ...activeTask, status: newStatus },
            ]);
        }
    };


    return (
        <div className="p-6 flex-col">
            {project ? (
                <div className="space-y-4 mb-12" key={project.id}>
                    <div className="flex justify-between items-center">
                        <h1 className="text-5xl font-bold">{project.name}</h1>
                        <FormDialog
                            triggerLabel="Edit Task"
                            triggerIcon={<Pencil />}
                            triggerVariant="default"
                            title="Edit Project"
                            description="Edit your project here. Click save when you're done."
                            onSubmit={handleEditProject}
                            submitLabel="Save changes"
                        >
                            <div className="grid gap-3">
                                <Label htmlFor="newName">Task Name</Label>
                                <Input
                                    type="text"
                                    id="newName"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="New Project Name"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="newDescription">Description</Label>
                                <Textarea
                                    id="newDescription"
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    placeholder="Type your new description here."
                                    required
                                />
                            </div>
                        </FormDialog>
                    </div>
                    <p className="text-gray-600">{project.description}</p>
                    <p className="text-xs">
                        {formatDate(project.created_at)}
                    </p>
                </div>
            ) : (
                <div className="p-6">
                    <p className="text-gray-500">No project found.</p>
                </div>
            )}

            <DndContext
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.values(Status).map((status) => (
                        <ColumnContainer
                            key={status}
                            status={status}
                            project_id={projectId}
                            tasks={tasks.filter((t) => t.status === status)}
                            onTaskAdded={(task: Task) => setTasks((prev) => [...prev, task])}
                        />
                    ))}
                </div>
                <DragOverlay>
                    {activeTaskId ? (
                        <TaskItem
                            overTaskId={overTaskId}
                            task={tasks.find((t) => String(t.id) === String(activeTaskId))!}
                            isOverlay
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
