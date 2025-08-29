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
import { toast, ToastContainer } from "react-toastify";

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
            const res = await axios.post("/api/proxy/testlogin", {
                user_id,
                password,
            },
                { withCredentials: true }
            );
            if (res.status === 201) {
                document.cookie = `auth_token=${user_id}; path=/;`;
                router.push("/projects");
                toast.success("Project Added Successfully!", {
                    position: "top-right"
                });
            }

        } catch (err: any) {
            console.error(err)
            setError(err.response?.data || "Unexpected error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full mt-20 flex justify-center items-center">
            <ToastContainer />
            <Card className="w-full max-w-sm">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Login your account</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="text-sm text-red-500 text-center">{error}</div>
                        )}

                        <div className="flex flex-col gap-6 mt-4">
                            <div className="grid gap-2">
                                <Label htmlFor="userId">User ID</Label>
                                <Input
                                    type="text"
                                    placeholder="User ID"
                                    value={user_id}
                                    onChange={(e) => setUser_Id(e.target.value)}
                                    required
                                    id="userId"
                                />
                            </div>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
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
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </CardFooter>
                </form>
                <CardAction className="w-full flex items-center justify-center text-center">
                    <a href="sign-up" className="text-sm text-center">Don&apos;t have an account? Sign up</a>
                </CardAction>
            </Card>
        </div>
    );

}
