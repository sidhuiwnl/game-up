

import type React from "react"

import { useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, CheckCircle, FileText } from "lucide-react"



interface SubmitTaskDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (submissionType: string, submissionContent: string) => void
    task: Task
}

export default function SubmitTaskDialog({ open, onOpenChange, onSubmit, task }: SubmitTaskDialogProps) {

    const [submissionType, setSubmissionType] = useState<string>("text")
    const [textSubmission, setTextSubmission] = useState<string>("")
    const [fileSubmission, setFileSubmission] = useState<File | null>(null)


    console.log(submissionType)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (submissionType === "text") {
            onSubmit("text", textSubmission)
        } else if (submissionType === "file" && fileSubmission) {
            onSubmit("file", fileSubmission.name)
        } else if (submissionType === "COMPLETED") {
            onSubmit("COMPLETED", "Task marked as complete")
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileSubmission(e.target.files[0])
        }
    }



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Submit Task: {task.name}</DialogTitle>
                        <DialogDescription>Choose how you want to submit your completed task.</DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Tabs defaultValue="text" onValueChange={setSubmissionType}>
                            <TabsList className="grid grid-cols-3 mb-4">
                                <TabsTrigger value="text">
                                    <FileText className="h-4 w-4 mr-2" /> Text
                                </TabsTrigger>
                                <TabsTrigger value="file">
                                    <Upload className="h-4 w-4 mr-2" /> File
                                </TabsTrigger>
                                <TabsTrigger value="COMPLETED">
                                    <CheckCircle className="h-4 w-4 mr-2" /> Complete
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="text" className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="textSubmission">Your Answer</Label>
                                    <Textarea
                                        id="textSubmission"
                                        placeholder="Describe how you completed the task..."
                                        value={textSubmission}
                                        onChange={(e) => setTextSubmission(e.target.value)}
                                        rows={5}
                                        required={submissionType === "text"}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="file" className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="fileSubmission">Upload File</Label>
                                    <Input
                                        id="fileSubmission"
                                        type="file"
                                        onChange={handleFileChange}
                                        required={submissionType === "file"}
                                    />
                                    {fileSubmission && (
                                        <p className="text-sm text-muted-foreground">Selected file: {fileSubmission.name}</p>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="COMPLETED" className="space-y-4">
                                <div className="text-center py-6">
                                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
                                    <p>Mark this task as complete without additional details.</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <DialogFooter>
                        <Button type="submit">Submit Task</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
