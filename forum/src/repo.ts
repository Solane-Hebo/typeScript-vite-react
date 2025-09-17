import { useEffect, useState } from "react";
import { type AdvertisememtClicktrough, type Advertisement, type Comment, type QNAThread, type Thread, type ThreadCategory, type ThreadTag, type User } from "./types";
import { readLS, LS_KEYS, writeLS, type Sequences, defaultSequences } from "./storage";

const BAD_WORDS = ["dumma", "idiot"].map((w) => w.toLocaleLowerCase())

export const containsBadLanguage = (text: string) => 
  BAD_WORDS.some((w) => 
  new RegExp(`(^|[^a-zåäö])${w}([^a-zåäö]|$)`, "i").test(
    text.toLowerCase()
  ))

  export const censorText = (text: string) => 
    text 
    .split(/(\b)/)
    .map((t) =>
      BAD_WORDS.includes(t.toLocaleLowerCase())
        ? "*".repeat(Math.max(t.length, 4))
        : t
  )
  .join("")
  

export function useRepo() {
    const [users, setUsers] = useState<User[]>(() => readLS<User[]>(LS_KEYS.users, []))
   
  const [threads, setThreads] = useState<Array<Thread | QNAThread | Advertisement>>(
    () => readLS<Array<Thread | QNAThread | Advertisement>>(LS_KEYS.threads, []) ?? []
  );

    const [comments, setComments] = useState<Comment[]>(() => {
    const raw = readLS<Comment[]>(LS_KEYS.comments, []) ?? [];
    return raw.map((c) => ({
      ...c,
      isAnswer: typeof c.isAnswer === "boolean" ? c.isAnswer : false,
      creationDate: c.creationDate ?? new Date().toISOString(),
    }));
  });

    const [tags, setTags] = useState<ThreadTag[]>(() => readLS<ThreadTag[]>(LS_KEYS.tags, []))
    const [seq, setSeq] = useState<Sequences>(() => readLS(LS_KEYS.seq, defaultSequences))
    const [clicks, setClicks] = useState<AdvertisememtClicktrough[]>(
      () => readLS<AdvertisememtClicktrough[]>(LS_KEYS.clicks, []) ?? []
    )

        useEffect(() => writeLS(LS_KEYS.users, users), [users])
        useEffect(() => writeLS((LS_KEYS.threads), threads), [threads])
        useEffect(() => writeLS((LS_KEYS.comments), comments), [comments])
        useEffect(() => writeLS(LS_KEYS.tags, tags), [tags])
        useEffect(() => writeLS(LS_KEYS.clicks, clicks), [clicks])
        useEffect(() => writeLS((LS_KEYS.seq),seq), [seq]) 


        function nextId<K extends keyof Sequences>(key: K): number {
          let newVal = 0
          setSeq(prev => {
            const v = prev[key] + 1 as number
            newVal = v
            return {...prev, [key]: v} as Sequences
          })
          return newVal
        }

        // Add Auth
    const register = (
      userName: string, 
      password: string
    ): User => {
    if(!userName.trim()) throw new Error("Ange ett användernamn.")
    if(!password.trim()) throw new Error("Ange ett lösenord.")
    if (users.some((u) => u.userName.toLocaleLowerCase() === userName.toLocaleLowerCase())) {
      throw new Error("Användarnamn upptaget.");
    }


    const newUserId = nextId("user")

    const user: User = { 
      id: newUserId,
      userName: userName.trim(),
      password };

    setUsers([...users, user]);
    return user;
  };

  const login = (userName: string, password: string): User => {
    const u = users.find((x) => x.userName === userName && x.password === password);
    if (!u) throw new Error("Fel användarnamn eller lösenord.");
    return u;
  };

  const ensureTags = (names: string[]): ThreadTag[] => {
    const result: ThreadTag[] = [];
    (names ?? []).forEach((raw: string) => {
        const name = (raw ?? "").trim()
        if(!name) return
        let existing = tags.find((tg) => tg.name.toLowerCase() === name.toLowerCase()
    )
    if(!existing) {

        const newId = nextId("tag")
        existing = {id: newId, name}
        setTags((prev) => [...prev, existing!])
    }
    result.push(existing)
    })
    return result
  }

   type BaseCreate = Omit<Thread, "id" | "creationDate" | "tags"> & {
    tags: string[];
  };

        // Create Thread
 const createThread = (
    input: BaseCreate &
      Partial<Omit<Advertisement, "category" | "id" | "creationDate" | "tags">> &
      Partial<Omit<QNAThread, "category" | "id" | "creationDate" | "tags">>
  ): Thread | QNAThread | Advertisement => {
    const category: ThreadCategory = input.category; 

    const newThreadId = nextId("thread")
    const base: Thread = {
      id: newThreadId,
      title: input.title,
      category,
      creationDate: new Date().toISOString(),
      description: input.description,
      creator: input.creator,
      tags: ensureTags(input.tags),
    };

    let thread: Thread | QNAThread | Advertisement = base;

    if (category === "QNA") {
      thread = { ...base, category: "QNA", isAnswered: false } as QNAThread;
    } else if (category === "AD") {
      thread = {
        ...base,
        category: "AD",
        link: input.link ?? "",
      } as Advertisement;
    }

    setThreads((prev) => [thread, ...prev]);
    return thread;
  };

const deleteThread = (id: number) => {
    setThreads((prev) => prev.filter((t) => t.id !== id));
    setComments((prev) => prev.filter((c) => c.thread !== id));
  };

 const addComment = (
    input: Omit<Comment, "id" | "creationDate" | "hiddenForLanguage">
  ): Comment => {
    const flagged = containsBadLanguage(input.content);
    const newCommentId = nextId("comment")
    const c: Comment = {
      ...input,
      id: newCommentId ,
      creationDate: new Date().toISOString(),
      hiddenForLanguage: flagged,
      isAnswer: false,
    };
    setComments((prev) => [...prev, c]);
    return c;
  };


  const updateComment = (updated: Comment) => 
    setComments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    
  const deleteComment = (id: number) =>
    setComments((prev) => prev.filter((c) => c.id !== id))
 
const updateThread = (updated: Thread | QNAThread | Advertisement) => {
    setThreads((prev) => prev.map((t) => (t.id === updated.id ? updated : t )))
}

const recordClick = (adId: number, user?: User) => {
  const r: AdvertisememtClicktrough = {
    advertisement: adId,
    user: user?.id,
    ts: new Date().toISOString(),
  }
  setClicks((prev) => [...prev, r])
}

return {
    state: {users, threads, comments, tags, seq},
    actions: { 
        register, 
        login, 

         createThread,
         updateThread,
         deleteThread,
         

         addComment, 
         updateComment,
         deleteComment,


        ensureTags,
        recordClick
        }
} as const
}