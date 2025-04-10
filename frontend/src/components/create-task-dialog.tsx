

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Task } from "@/lib/types"
import axios from "axios"
import {useUser} from "@/context/UserContext.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {toast} from "sonner";


interface Childrens{
    id: string
    name: string
    parentId: string
    role : "CHILD"
    createdAt: Date
    updatedAt: Date
    email : string

}

interface CreateTaskDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (task: Task) => void
    editTask: Task | null
}

export default function CreateTaskDialog({ open, onOpenChange, onSave, editTask }: CreateTaskDialogProps) {

    const { userData } = useUser();
    const[children,setChildren] = useState<Childrens[] | null>([]);

    const [task, setTask] = useState<Task>({
        id : "",
        name: "",
        description: "",
        dueDate: new Date(Date.now() + 86400000 * 7), // Default to 7 days from now
        xpReward: 50,
        status: "PENDING",
        assigneeId: ""
    })



    useEffect(() => {
        if (editTask) {
            setTask(editTask)
        } else {
            setTask({

                name: "",
                description: "",
                dueDate: new Date(Date.now() + 86400000 * 7),
                xpReward: 50,
                status: "PENDING",
                assigneeId: ""
            })
        }
    }, [editTask, open])




    useEffect(() => {
        async function getChildren() {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/children`,
                    {
                        headers: {
                            Authorization: `Bearer ${userData?.token}`,
                        },
                    }
                );
                setChildren(response.data.children);

            } catch (err) {
                console.error("Failed to fetch children", err);
            }
        }

        if (userData?.token) getChildren();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setTask((prev) => ({ ...prev, [name]: value }))
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTask((prev) => ({ ...prev, dueDate: new Date(e.target.value) }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

       async function editTaskSubmit(){
           const {
               name,
               description,
               dueDate,
               xpReward,
               status,
               assigneeId
           } = task;
            try {
                const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks/${task.id}`,
                    {
                        name,
                        description,
                        dueDate,
                        xpReward,
                        status,
                        assigneeId
                    }
                    ,{
                    headers : {
                        Authorization: `Bearer ${userData?.token}`
                    }
                })
                if(response.status === 200) {
                    toast("Successfully updated task")
                }
            }catch (e) {
                console.error(e)
            }
        }

        async function createTaskSubmit(){
            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks`,task,{
                    headers : {
                        Authorization: `Bearer ${userData?.token}`,
                    }
                })
                if(response.status === 200) {
                    console.log("created",response)
                }
            }catch (error){

            }
        }

        if(editTask) {
            editTaskSubmit()
        }else {
            createTaskSubmit()
        }

        onSave(task)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{editTask ? "Edit Task" : "Create New Task"}</DialogTitle>
                        <DialogDescription>
                            {editTask ? "Make changes to the existing task." : "Add a new task for your child to complete."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Task Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={task.name}
                                onChange={handleChange}
                                placeholder="Read a book"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={task.description}
                                onChange={handleChange}
                                placeholder="Provide details about what needs to be done"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Input
                                    id="dueDate"
                                    name="dueDate"
                                    type="date"
                                    value={task.dueDate?.toISOString().split("T")[0]}
                                    onChange={handleDateChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="xpReward">XP Reward</Label>
                                <Input
                                    id="xpReward"
                                    name="xpReward"
                                    type="number"
                                    min="1"
                                    max="1000"
                                    value={task.xpReward}
                                    onChange={(e) => setTask((prev) => ({ ...prev, xpReward: Number.parseInt(e.target.value) }))}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="child">Assign to Child</Label>
                                <Select
                                    value={task.assigneeId}
                                    onValueChange={(value) =>
                                        setTask((prev) => ({ ...prev, assigneeId: value }))
                                    }
                                >
                                    <SelectTrigger id="child">
                                        <SelectValue placeholder="Select a child" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {children?.map((child) => (
                                            <SelectItem key={child.id} value={child.id}>
                                                {child.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>

                    </div>
                    <DialogFooter>
                        <Button type="submit">{editTask ? "Save Changes" : "Create Task"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
