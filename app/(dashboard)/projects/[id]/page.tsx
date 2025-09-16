"use client"
import { fetchProject, patchProject } from "@/services/api";
import ColumnContainer from "@/components/column-container";
import FormDialog from "@/components/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/interfaces";
import { Status } from "@/lib/status";
import { Pencil } from "lucide-react";
import { use, useEffect, useState } from "react";
import {
    DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, closestCorners, MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import TaskItem from "@/components/task-item";
import { formatDate } from "@/lib/format-date";
import { toast } from "sonner";
import { useTasks } from "@/hooks/useTasks";
import { useTasksStore } from "@/store/useTasksStore";

interface ProjectPageProps {
    params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
    const { id } = use(params);
    const projectId = parseInt(id);
    const [project, setProject] = useState<Project | null>(null);

    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
    const [overTaskId, setOverTaskId] = useState<number | null>(null);
    const { tasks } = useTasks(projectId)
    const { moveTaskWithinColumn, moveTaskToColumn, updateTaskStatus, setTasks } = useTasksStore();


    useEffect(() => {
        const getProject = async () => {
            try {
                const res = await fetchProject(projectId);
                setProject(res.data);
                setNewName(res.data.name);
                setNewDescription(res.data.description);
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

    const handleDragStart = (event: DragStartEvent) => {
        setActiveTaskId(Number(event.active.id));
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { over } = event;
        if (over) {
            if (over.data.current?.columnId) {
                setOverTaskId(null);
            } else {
                setOverTaskId(Number(over.id))
            }
        } else {
            setOverTaskId(null);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveTaskId(null);
        setOverTaskId(null);

        const { active, over } = event;
        if (!over) return;
        if (active.id === over.id) return;

        const activeTask = tasks.find((t) => String(t.id) === active.id);
        if (!activeTask) return;

        const overTask = tasks.find((t) => String(t.id) === over.id);

        if (overTask && activeTask.status === overTask.status) {
            moveTaskWithinColumn(activeTask.status, String(active.id), String(over.id));
        } else {
            const newStatus =
                overTask && activeTask.status !== overTask.status
                    ? overTask.status
                    : over.data.current?.columnId;

            if (!newStatus) return;

            setTasks((prev) =>
                prev.map((t) =>
                    t.id === activeTask.id ? { ...t, status: newStatus } : t
                )
            );

            await updateTaskStatus(activeTask, newStatus);
        }
    };


    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 5,
        },
    });

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 200,
            tolerance: 5,
        },
    });

    const sensors = useSensors(mouseSensor, touchSensor);

    return (
        <div>
            {project ? (
                <div className="space-y-4 mb-12" key={project.id}>
                    <div className="flex justify-between items-center">
                        <h1 className="text-5xl font-bold">{project.name}</h1>
                        <FormDialog
                            triggerLabel="Edit Project"
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
                sensors={sensors}
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
