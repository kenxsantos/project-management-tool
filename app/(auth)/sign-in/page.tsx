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
import api from "@/lib/axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const user_id = uuidv4();
            const res = await api.post("/test01/create_member", {
                user_id,
                email,
                password,
            });

            const token = res.data?.token;
            if (token) {
                localStorage.setItem("token", token);
                Cookies.set("token", token, { expires: 7 }); // store for middleware
                router.push("/projects");
            } else {
                setError("Invalid response from server.");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Login failed. Try again.");
        } finally {
            setLoading(false);
        }
    };
    return <div className="w-full mt-20 flex justify-center items-center">
        <form onSubmit={handleSubmit}>
            <Card className="w-full max-w-sm">

                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="text-sm text-red-500 text-center">{error}</div>
                    )}

                    <div className="flex flex-col gap-6">
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
                            <Input id="password" type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="flex-col">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                    <CardAction>
                        <Button variant="link">Don&apos;t have an account? Sign Up</Button>
                    </CardAction>
                </CardFooter>
            </Card>
        </form>
    </div>

}
