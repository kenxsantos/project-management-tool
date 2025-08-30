"use client"
import { fetchProject, patchProject } from "@/app/services/api";
import ColumnContainer from "@/components/column-container";
import FormDialog from "@/components/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/interfaces";
import { Status } from "@/lib/status";
import { Pencil } from "lucide-react";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ProjectPageProps {
    params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
    const { id } = use(params);
    const projectId = parseInt(id);
    const [project, setProject] = useState<Project | null>(null);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");

    useEffect(() => {
        const getProject = async () => {
            try {
                const response = await fetchProject(projectId);
                setProject(response.data);
                setNewName(response.data.name);
                setNewDescription(response.data.description);
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
                        {new Date(project.created_at).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                        })}
                    </p>
                </div>
            ) : (
                <div className="p-6">
                    <p className="text-gray-500">No project found.</p>
                </div>
            )}
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(Status).map((status) => (
                    <ColumnContainer key={status} status={status} project_id={projectId} />
                ))}
            </div>
        </div>
    );
}
