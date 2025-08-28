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
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default function SignIn() {

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
            const res = await axios.post(
                "/api/proxy/test01/create_member",
                {
                    user_id,
                    email,
                    password,
                },
            );
            const message = res.data?.data; // 👈 capture backend message
            alert(message);
        } catch (err: any) {
            console.error(err)
            setError(err.response?.data || "Unexpected error");
        } finally {
            setLoading(false);
        }
    };

    return <div className="w-full mt-20 flex justify-center items-center">
        <Card className="w-full max-w-sm">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                        Please fill all the required fields.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="text-sm text-red-500 text-center">{error}</div>
                    )}

                    <div className="flex flex-col gap-6 mt-4">
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
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </Button>
                </CardFooter>
            </form>
            <CardAction className="w-full flex items-center justify-center text-center">
                <a href="sign-in" className="text-sm text-center">Already have an account? Sign in</a>
            </CardAction>
        </Card>

    </div>

}
