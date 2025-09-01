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
    <div className="flex items-center gap-2 mb-4">
        <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Sök trådar..." className="px-3 py-2 rounded-xl border w-64"
        />
    </div>
    <ThreadList threads={filtered} />
    </>
)
}
