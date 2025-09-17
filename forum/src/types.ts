export type ThreadCategory = "THREAD" | "QNA" | "AD"

export type Role = "USER" | "MODERATOR" 

export type ThreadTag = {
    id: number
    name: string
}

export type User = {
    id: number
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
    tags: ThreadTag[]
}

export type QNAThread = Thread & {
    category: "QNA"
    isAnswered: boolean
    commentAnswerId?: number
}

export type Advertisement = Thread & {
    category: "AD"
    link?: string
}
export type Comment = {
    id: number
    thread: number
    comment?: number
    content: string
    creator: User
    isAnswer?: boolean
    creationDate: string
    hiddenForLanguage?: boolean
}

export type AdvertisememtClicktrough = {
    advertisement: number
    user?: number
    ts: string
}