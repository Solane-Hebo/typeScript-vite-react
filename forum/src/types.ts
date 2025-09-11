export type ThreadCategory = "THREAD" | "QNA" 

export type Role = "USER" | "MODERATOR" 

export type User = {
    userName: string
    password: string
    role?: Role
}
export type RegisterUser = User & {
    confirmPassword: string;
  }

export type Thread = {
    id: number
    title: string
    category: ThreadCategory
    creationDate: string
    description: string
    creator: User
    isLocked?: boolean
}

export type QNAThread = Thread & {
    category: "QNA"
    isAnswered: boolean
    commentAnswerId?: number
}

export type Comment = {
    id: number
    thread: number
    content: string
    creator: User
}