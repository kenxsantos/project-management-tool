"use client"
import Cookies from "js-cookie";
import { useState } from "react";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import { useUserProjects } from "@/hooks/useUserProjects";
import { toast } from "sonner";
import { createProject, getAllUserProjects } from "@/services/api";
import { useProjectsStore } from "@/store/useProjectsStore";

export default function Home() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);
    const { projects, loading: projectsLoading } = useUserProjects();
    const { setProjects } = useProjectsStore();
    const userId = Cookies.get("user_id") ?? "No User";

    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setOpen(false);
        try {
            const res = await createProject(userId, name, description);
            if (res.status === 201) {
                toast.success("Project Added Successfully!", {
                    position: "top-right"
                });
                setName("");
                setDescription("");

                const updatedProjects = await getAllUserProjects();
                setProjects(updatedProjects);
            }
            console.log("status: ", res.status)
        } catch (err) {
            console.error("Failed to add project", err);
        }
    };

    return (
        <>
            <div className="flex-col items-center justify-center">
                <header>
                    <p className="font-bold text-4xl uppercase mt-10 text-center">Project Management Tool</p>
                    <p className="text-gray-400 text-base text-center">by Ken Santos</p>
                </header>
                <div className="flex justify-between items-center mt-12 p-2 sm:px-12">
                    <p className="text-3xl font-bold">Projects</p>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus />
                                New Project</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleAddProject}>
                                <DialogHeader>
                                    <DialogTitle>Add New Project</DialogTitle>
                                    <DialogDescription>
                                        Add your new project here. Click save when you&apos;re done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 mt-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="name">Project Name</Label>
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
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            placeholder="Type your description here."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                            id="description"
                                            name="description"
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="mt-8">
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Save</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                {
                    !projectsLoading && projects.length === 0 && (
                        <p className="text-center">No projects found</p>
                    )
                }
                {projectsLoading && <p className="text-center">Loading...</p>}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2 sm:px-12 py-8">
                    {
                        projects.map((project, i) => (
                            <Link href={`/projects/${project.id}`} key={i}>
                                <Card >
                                    <CardHeader>
                                        <CardTitle>{project.name}</CardTitle>
                                        <CardDescription>{project.description}</CardDescription>
                                    </CardHeader>
                                    <CardFooter>
                                        <p className="text-right text-xs">
                                            {new Date(project.created_at).toLocaleString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                                hour12: true
                                            })}</p>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </>
    );
}
