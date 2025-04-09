import { useState } from "react"
import { useNavigate } from "react-router"
import { NavLink } from "react-router"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import axios from "axios"

export default function LoginComponent() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear error on typing
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const validateForm = () => {
        let valid = true
        const newErrors = { email: "", password: "" }

        if (!formData.email) {
            newErrors.email = "Email is required"
            valid = false
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid"
            valid = false
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
            valid = false
        }

        setErrors(newErrors)
        return valid
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (validateForm()) {
            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/login`, formData)

                if (response.status === 200) {
                    localStorage.setItem("session",JSON.stringify({
                        token: response.data.token,
                        user : response.data.user,
                    }))
                    toast("Login successful!", {
                        description: "Welcome back! Redirecting...",
                    })
                    navigate("/") // or wherever you want to go
                } else {
                    toast("Login failed!", {
                        description: "Check your credentials and try again.",
                    })
                }
            } catch (error: any) {
                toast("Login error", {
                    description: error.response?.data?.message || "Something went wrong",
                })
            }
        }
    }

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your credentials to sign in to your account
                    </p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle className="text-xl">Login</CardTitle>
                            <CardDescription>
                                Access your tasks and track progress
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                            </div>

                            <div className="space-y-2 mb-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <NavLink
                                        to="/forgot-password"
                                        className="text-xs text-muted-foreground hover:text-primary"
                                    >
                                        Forgot password?
                                    </NavLink>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full">
                                Sign In
                            </Button>
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <NavLink to="/register" className="text-primary hover:underline">
                                    Sign up
                                </NavLink>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
