import { useMemo, useState } from "react";
import ThreadList from "../components/threadList";
import type { QNAThread, Thread, Comment, ThreadTag } from "../types";
import { useLocation } from "react-router-dom";

type ThreadLike = Thread | QNAThread

function useQuery(): string {
    const { search } = useLocation()
    const q = new URLSearchParams(search).get("q") || ""
    return q.trim()
}

function searchThreads(threads: ThreadLike[], query: string): ThreadLike[]{
    if (!query) return threads
    const q = query.toLowerCase()
    return threads.filter((t) => 
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.creator.userName.toLowerCase().includes(q) ||
        (t.tags ?? []).some((tg) => tg.name.toLowerCase().includes(q))
    )
}
export default function ListRoute({ 
    threads, 
    comments, 
    tags 
}: {
    threads: Array<Thread | QNAThread> 
    comments: Comment[]
    tags: ThreadTag[]
}) {
    
    const q = useQuery()
    const [tagFilter, setTagFilter] = useState<number | null>(null)
    
    const searchFiltered = useMemo(() => 
        searchThreads(threads, q),
        [threads, q]
    )
    
        const uniqueTags: ThreadTag[] = useMemo(() => {
            const seen = new Set<number>()
            const out: ThreadTag[] = []
            for (const t of tags) {
                if (!seen.has(t.id)) continue
                    seen.add(t.id)
                    out.push(t)
            }
            return out
            
        }, [tags])

    
    return (
    <>

    <ThreadList 
    threads={searchFiltered} 
    comments={comments}
    allTags={uniqueTags}
    tagFilter={tagFilter}
    setTagFilter={setTagFilter}

    />

    </>
)
}
