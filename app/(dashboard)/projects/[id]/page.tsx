interface ProjectPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { id } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const res = await fetch(
        `${baseUrl}/api/proxy/test02/get_project?id=${id}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        return (
            <div className="p-6">
                <p className="text-red-500">Failed to load project.</p>
            </div>
        );
    }

    const response = await res.json();
    const project = response.data;

    if (!project) {
        return (
            <div className="p-6">
                <p className="text-gray-500">No project found.</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-5xl font-bold">{project.name}</h1>
            <p className="text-gray-600">{project.description}</p>
            <p className="text-xs">
                {new Date(project.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                })}
            </p>
        </div>
    );
}
