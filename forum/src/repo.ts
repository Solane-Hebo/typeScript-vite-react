import { useEffect, useState } from "react";
import { type Comment, type QNAThread, type Thread, type ThreadCategory, type User } from "./types";
import { readLS, LS_KEYS, writeLS, type Sequences, defaultSequences } from "./storage";

export function useRepo() {
    const [users, setUsers] = useState<User[]>(() => readLS<User[]>(LS_KEYS.users, []))
    const [threads, setThreads] = useState<Array<Thread | QNAThread>>(() => readLS(LS_KEYS.threads, []))
    const [comments, setComments] = useState<Comment[]>(() => readLS(LS_KEYS.comments, []))
    const [seq, setSeq] = useState<Sequences>(() => readLS(LS_KEYS.seq, defaultSequences))
    

        useEffect(() => writeLS(LS_KEYS.users, users), [users])
        useEffect(() => writeLS((LS_KEYS.threads), threads), [threads])
        useEffect(() => writeLS((LS_KEYS.comments), threads), [comments])
        useEffect(() => writeLS((LS_KEYS.seq),seq), [seq]) 


        // Add Auth
    const register = (userName: string, password: string): User => {
    if (users.some((u) => u.userName === userName)) throw new Error("Användarnamn upptaget.");
    const user: User = { userName, password };
    setUsers([...users, user]);
    return user;
  };

  const login = (userName: string, password: string): User => {
    const u = users.find((x) => x.userName === userName && x.password === password);
    if (!u) throw new Error("Fel användarnamn eller lösenord.");
    return u;
  };


        // Create Thread
const createThread = (
    input: Omit<Thread, "id" | "creationDate"> & { category: ThreadCategory}
): Thread | QNAThread => {
    const base: Thread = {
        id: seq.thread++,
        title: input.title,
        category: input.category,
        creationDate: new Date().toISOString(),
        description: input.description,
        creator: input.creator,
    }
    setSeq(seq)

    const t: Thread | QNAThread = 
        input.category === "QNA" ? ({...base, category: "QNA", isAnswered: false} as QNAThread) :base
       setThreads((prev) => [t, ...prev])
       return t
}

const addComment = (threadId: number, content: string, creator: User): Comment => {
    const comment: Comment = {
        id: seq.comment++,  
        thread: threadId,
        content,
        creator
    };
    setComments((prev) => [comment, ...prev]);
    setSeq({ ...seq }); 
    return comment;
};


return {
    state: {users, threads, comments, seq},
    actions: { createThread, register, login, addComment }
} as const
}