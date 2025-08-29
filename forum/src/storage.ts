export const LS_KEYS = {
    users: "forum.users.v1",
    threads: "forum.threads.v1",
    comments: "forum.comments.v1",
    seq: "forum.seq.v1",
    session: "forum.session.v1"
} as const

export type Sequences = { user: number, thread: number, comment: number}

export const defaultSequences: Sequences = {user: 1, thread: 1, comment: 1}

export function readLS<T>(key : string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key)
        if(!raw) return fallback
        return JSON.parse(raw) as T
    } catch {
        return fallback
    }
}

export function writeLS<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value))
}