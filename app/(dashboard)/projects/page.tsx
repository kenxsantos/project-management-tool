"use client"
import axios from "axios";
import { useEffect, useState } from "react";
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

export default function Home() {
    interface Project {
        id: string;
        name: string;
        description: string;
        created_at: string;
    }
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get("/api/proxy/test02/get_all_project");
                setProjects(res.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch projects", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);
    return (
        <>
            <div className="flex-col items-center justify-center">
                <header>
                    <p className="font-bold text-4xl uppercase mt-10 text-center">Project Management Tool</p>
                    <p className="text-gray-400 text-base text-center">by Ken Santos</p>
                </header>
                <div className="flex justify-between items-center mt-12 px-12">
                    <p className="text-3xl font-bold">Projects</p>
                    <Dialog>
                        <form>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus />
                                    New Project</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Project</DialogTitle>
                                    <DialogDescription>
                                        Add your new project here. Click save when you&apos;re done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="name-1">Project Name</Label>
                                        <Input id="name-1" name="name" />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="username-1">Description</Label>
                                        <Textarea placeholder="Type your description here." />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </form>
                    </Dialog>
                </div>
                {
                    !loading && projects.length === 0 && (
                        <p className="text-center">No projects found</p>
                    )
                }
                {loading && <p className="text-center">Loading...</p>}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-12 py-8">
                    {
                        projects.map((project) => (
                            <Link href={`/projects/${project.id}`} key={project.id}>
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
