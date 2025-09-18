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
    changeBg?: boolean;
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
    changeBg = false
}: FormDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={triggerVariant} className={`${changeBg ? "bg-blue-600 text-white" : ""}`}>
                    <span className="hidden sm:inline-flex gap-2 items-center"> {triggerIcon} {triggerLabel}</span>
                    <span className="inline-flex sm:hidden"> {triggerIcon}</span>
                </Button>

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
                            <Button variant="destructive">{cancelLabel}</Button>
                        </DialogClose>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-500 cursor-pointer">{submitLabel}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}
