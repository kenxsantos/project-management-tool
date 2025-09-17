"use client";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInUser } from "@/services/api";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

export default function SignIn() {
    const [user_id, setUser_Id] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signInUser(user_id, password);
            if (res.data === "ok") {
                document.cookie = `user_id=${user_id}; path=/;`;
                router.push("/projects");
                toast.success("Sign In Successfully!", {
                    position: "top-right",
                });
            } else if (res.data === "Invalid Credential") {
                toast.error("Invalid Credentials", {
                    position: "top-right",
                });
            }

            console.log("data: ", res.data)
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || "Unexpected error. Please try again later.");
            } else {
                setError("Unexpected error");
            }
        } finally {
            setLoading(false);
        }

    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mt-20 max-w-4xl mx-auto px-4"
        >
            <div className="flex flex-col sm:flex-row bg-white border shadow-lg rounded-xl overflow-hidden">
                <div className="sm:w-1/2 w-full">
                    <Image
                        src="/login.jpg"
                        width={500}
                        height={500}
                        alt="login"
                        className="object-cover h-full w-full"
                    />
                </div>
                <div className="sm:w-1/2 w-full p-6 flex flex-col justify-center">
                    <Card className="w-full shadow-none border-none">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <CardHeader className="space-y-2">
                                <CardTitle className="text-2xl font-semibold text-gray-800">
                                    Welcome Back
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-500">
                                    Sign in to your account to continue
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && (
                                    <div className="text-sm text-red-500 text-center">{error}</div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="userId">User ID</Label>
                                    <Input
                                        id="userId"
                                        type="text"
                                        placeholder="Enter your user ID"
                                        value={user_id}
                                        onChange={(e) => setUser_Id(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={loading}
                                >
                                    {loading ? "Signing in..." : "Sign In"}
                                </Button>
                            </CardFooter>
                        </form>

                        <CardAction className="w-full flex items-center justify-center text-center">
                            <Link href="/sign-up">
                                <p className="text-xs">
                                    Don&apos;t have an account?
                                    <span className="text-blue-600  hover:underline"> Sign up</span>
                                </p>
                            </Link>
                        </CardAction>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}