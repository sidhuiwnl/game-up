interface Assignee {
    id : string;
    name : string;
}

export interface Task {
    id?: string
    name: string
    description: string
    dueDate?: Date
    xpReward: number
    status: "PENDING" | "SUBMITTED" | "REVIEWED"
    assigneeId: string
    creatorId?: string
    submission? : null
    updatedAt? : Date
    assigneed? : Assignee
}


