import { useMemo, useState } from "react";
import ThreadList from "../components/threadList";
import type { QNAThread, Thread } from "../types";

export default function ListRoute({ threads }: {threads: Array<Thread | QNAThread>}) {
    const params = new URLSearchParams(location.search)
     const initialQ = params.get("q") ?? ""

     const [query, setQuery] = useState(initialQ)
     const filtered = useMemo(() =>{
        const q = query.trim().toLowerCase()
        return threads.filter((t) => !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.creator.userName.toLowerCase().includes(q)
    
    ) 
     }, [threads, query])



    
    return (
    <>
    <ThreadList threads={filtered} />
    </>
)
}
