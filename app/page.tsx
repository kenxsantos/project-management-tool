"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "motion/react";


export default function Home() {
    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-3 pb-20 gap-16 sm:p-20">
            <motion.main
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.4,
                    scale: { type: "spring", visualDuration: 0.2, bounce: 0.1 },
                }}
                className="flex flex-col gap-4 row-start-2 items-center">
                <p className="text-5xl font-bold uppercase text-[#1b1b1b] text-center"> Project Management Tool</p>
                <p className="text-base text-[#1b1b1b] text-center"> A simple drag and drop project management tool using dnd kit.</p>
                <div className="flex gap-8">
                    <Link href="sign-in">
                        <Button>Sign In</Button>
                    </Link>
                    <Link href="sign-up">
                        <Button variant="outline">Sign Up</Button>
                    </Link>
                </div>
            </motion.main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <p className="text-sm">© 2025 Ken Santos. All rights reserved.</p>
            </footer>
        </div>
    );
}
