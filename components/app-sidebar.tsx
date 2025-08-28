"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";

export function AppSidebar() {
    interface Project {
        id: string;
        name: string;
        description: string;
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
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Project Management Tool</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {!loading && projects.length === 0 && (
                                <SidebarMenuItem>No projects found</SidebarMenuItem>
                            )}
                            {loading && <SidebarMenuItem>Loading...</SidebarMenuItem>}
                            {projects.map((project) => (
                                <SidebarMenuItem key={project.id}>
                                    <Link href={`/projects/${project.id}`}>
                                        <div className="border rounded-md p-4 flex-col hover:bg-gray-100 cursor-pointer">
                                            <p className="font-bold text-sm">{project.name}</p>
                                            <p className="text-xs text-gray-600">{project.description}</p>
                                        </div>
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}