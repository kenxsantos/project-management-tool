import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { cookies } from "next/headers"

export default async function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className="w-full sm:flex justify-between p-4 mb-12 overflow-auto">
                <div>
                    <SidebarTrigger />
                </div>
                <div className="w-full space-y-4 mt-10">
                    {children}
                </div>
                <div></div>
            </main>
        </SidebarProvider>
    )
}