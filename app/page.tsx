import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-4 row-start-2 items-center sm:items-center">
                <p className="text-5xl font-bold uppercase text-[#1b1b1b]"> Project Management Tool</p>
                <p className="text-base text-[#1b1b1b]"> A simple drag and drop project Management pool using dnd kit.</p>
                <div className="flex gap-8">
                    <Link href="sign-in">
                        <Button>Sign In</Button>
                    </Link>
                    <Link href="sign-ip">
                        <Button variant="outline">Sign Up</Button>
                    </Link>
                </div>
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <p className="text-sm">© 2025 Ken Santos. All rights reserved.</p>
            </footer>
        </div>
    );
}
