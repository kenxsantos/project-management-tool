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
import { signUpUser } from "@/services/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

export default function SignIn() {
    const [userId, setUserId] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signUpUser(userId, email, password);
            if (res.data.user_id === userId) {
                document.cookie = `user_id=${userId}; path=/;`;
                router.push("/projects");
                toast.success("Sign Up Successfully!", {
                    position: "top-right",
                });
            } else if (res.data === "Member Already Exist") {
                toast.error("User Already Exist", {
                    position: "top-right",
                });
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || "Unexpected error. Please try again later.");
            } else {
                setError("Unexpected error");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }

    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full mt-20 flex justify-center items-center"
        >
            <div className="flex flex-col sm:flex-row bg-white border shadow-lg rounded-xl overflow-hidden">
                <div className="sm:w-1/2 w-full">
                    <Image
                        src="/register.jpg"
                        width={500}
                        height={500}
                        alt="login"
                        className="object-cover h-full w-full"
                    />
                </div>
                <div className="sm:w-1/2 w-full p-6 flex flex-col justify-center">
                    <Card className="w-full shadow-none border-none">
                        <form onSubmit={handleSubmit}>
                            <CardHeader>
                                <CardTitle>Create an account</CardTitle>
                                <CardDescription>
                                    Please fill all the required fields.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {error && (
                                    <div className="text-sm text-red-500 text-center mt-4">{error}</div>
                                )}

                                <div className="flex flex-col gap-6 mt-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="userId">User ID</Label>
                                        <Input
                                            type="text"
                                            placeholder="User Id"
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            required
                                            id="userId"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            id="email"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input id="password" type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col mt-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={loading}>
                                    {loading ? "Signing up..." : "Sign Up"}
                                </Button>
                            </CardFooter>
                        </form>
                        <CardAction className="w-full flex items-center justify-center text-center">
                            <Link href="/sign-in">
                                <p className="text-xs">
                                    Already have an account?
                                    <span className="text-blue-600  hover:underline"> Sign In</span>
                                </p>
                            </Link>
                        </CardAction>
                    </Card>
                </div>
            </div>

        </motion.div>
    )

}
