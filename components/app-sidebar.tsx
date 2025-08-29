"use client";
import { usePathname } from "next/navigation";
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
import { Project } from "@/interfaces";

export function AppSidebar({ projects }: { projects: Project[] }) {
    const pathname = usePathname();
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Project Management Tool</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projects.length === 0 && (
                                <SidebarMenuItem>No projects found</SidebarMenuItem>
                            )}
                            {projects.map((project) => {
                                const isActive = pathname === `/projects/${project.id}`;
                                return (
                                    <SidebarMenuItem key={project.id}>
                                        <Link href={`/projects/${project.id}`}>
                                            <div
                                                className={`border rounded-md p-4 flex-col cursor-pointer transition
                          ${isActive ? "bg-blue-100 border-blue-500" : "hover:bg-gray-100"}
                        `}
                                            >
                                                <p className="font-bold text-sm">{project.name}</p>
                                                <p className="text-xs text-gray-600">{project.description}</p>
                                            </div>
                                        </Link>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}