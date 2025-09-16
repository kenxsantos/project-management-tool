"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import { SquarePen } from "lucide-react";

interface FormDialogProps {
    triggerLabel?: string;
    triggerIcon?: ReactNode;
    triggerVariant?: "ghost" | "link" | "default" | "destructive" | "outline" | "secondary" | null | undefined;
    title: string;
    description?: string;
    children: ReactNode;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel?: string;
    cancelLabel?: string;
}

export default function FormDialog({
    triggerLabel = "",
    triggerIcon,
    triggerVariant = "ghost",
    title,
    description,
    children,
    onSubmit,
    submitLabel = "Save",
    cancelLabel = "Cancel",
}: FormDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div>
                    <Button variant={triggerVariant} className="sm:inline-flex hidden">
                        {triggerIcon} {triggerLabel}
                    </Button>
                    <Button variant="ghost" className="block sm:hidden">
                        <SquarePen />
                    </Button>
                </div>

            </DialogTrigger>
            <DialogContent>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(e);
                        setOpen(false);
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                    <div className="grid gap-4 mt-4">{children}</div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">{cancelLabel}</Button>
                        </DialogClose>
                        <Button type="submit">{submitLabel}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}
