import {useNavigate} from "react-router";
import { useState } from "react"
import {NavLink} from "react-router";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {toast} from "sonner";
import axios from "axios";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        role: "PARENT",
        parentID: "",
    })

    const [errors, setErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        parentID: "",
    })






    const handleChange = (e : any) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Clear error when user types
        //@ts-ignore
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const handleRoleChange = (value : any) => {
        setFormData((prev) => ({
            ...prev,
            role: value,
        }))
    }

    const validateForm = () => {
        let valid = true
        const newErrors = { ...errors }

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required"
            valid = false
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid"
            valid = false
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required"
            valid = false
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
            valid = false
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
            valid = false
        }

        // Name validation
        if (!formData.name) {
            newErrors.name = "Name is required"
            valid = false
        }

        // ParentID validation (only if role is CHILD)
        if (formData.role === "CHILD" && !formData.parentID) {
            newErrors.parentID = "Parent ID is required for child accounts"
            valid = false
        }

        setErrors(newErrors)
        return valid
    }

    const handleSubmit = async (e : any) => {
        e.preventDefault()

        if (validateForm()) {
            // Here you would typically send the data to your API

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/register`, formData)

            if (response.status === 200) {
                console.log("Form submitted:", formData)
                toast(
                    "Account created!",{
                        description: "You have successfully registered an account.",
                    }

                )
                navigate("/login")
            }else{
                return toast("Can't able to register")
            }

            // Redirect to login page or dashboard
        }
    }

    return (
        <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                    <p className="text-sm text-muted-foreground">Enter your information to create an account</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle className="text-xl">Register</CardTitle>
                            <CardDescription>Join the Family Task Manager platform</CardDescription>
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

                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
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

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Account Type</Label>
                                <RadioGroup
                                    defaultValue="PARENT"
                                    value={formData.role}
                                    onValueChange={handleRoleChange}
                                    className="flex flex-col space-y-1"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="PARENT" id="parent" />
                                        <Label htmlFor="parent" className="font-normal">
                                            Parent
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="CHILD" id="child" />
                                        <Label htmlFor="child" className="font-normal">
                                            Child
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {formData.role === "CHILD" && (
                                <div className="space-y-2 ">
                                    <Label htmlFor="parentID">Parent ID</Label>
                                    <Input
                                        id="parentID"
                                        name="parentID"
                                        placeholder="Enter your parent's ID"
                                        value={formData.parentID}
                                        onChange={handleChange}
                                    />
                                    {errors.parentID && <p className="text-sm text-destructive">{errors.parentID}</p>}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4 mt-2">
                            <Button type="submit" className="w-full">
                                Create Account
                            </Button>
                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <NavLink to="/login" className="text-primary hover:underline">
                                    Sign in
                                </NavLink>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
