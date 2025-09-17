import { useState } from "react"
import type { Advertisement, QNAThread, Thread, ThreadTag } from "../types"

type ThreadLike = Thread | QNAThread | Advertisement

export default function EditThreadForm ({
    thread,
    onSave,
    ensureTags
}: {
    thread: ThreadLike
    onSave: (t: ThreadLike) => void
    onDelete: () => void
    ensureTags: (names: string[]) => ThreadTag[]
}) {

    const [title, setTitle] = useState(thread.title)
    const [description, setDescription] = useState(thread.description)
    const [tags, setTags] = useState(
        (thread.tags ?? []).map((t) => t.name).join(",")
    )
    const [link, setLink] = useState<string>(
        thread.category === "AD" ? ( thread as Advertisement).link ?? "" : ""
    )

    const handleSave = () => {
        const t = title.trim()
        const d = description.trim()
        if(!t) return alert("Title får inte vara tomt")
        if(!d) return alert("Beskrivning får inte vara tomt")
    
    const tagsNames = tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)        

    const updateTags = ensureTags(tagsNames)

    const base: Thread = {
        ...(thread as Thread),
        title: t,
        description: d,
        tags: updateTags,
    }    
    
    if(thread.category === "AD") {
        const cleanedLink = link.trim()
        onSave({
            ...(base as Advertisement), 
            category: "AD", 
            link: cleanedLink} as Advertisement)
        return
    }

    if(thread.category === "QNA") {
        const q = thread as QNAThread
        onSave({
            ...(base as QNAThread), 
            category: "QNA", 
            isAnswered: q.isAnswered, 
            commentAnswerId: q.commentAnswerId
        } as QNAThread)
        return
    }
    onSave(base)
}
    
    return (
        <div className="rounded-xl border bg-white p-3 shadow-sm space-y-4 text-gray-800">
            <h2 className="text-lg font-semibold">Redigera tråd</h2>
            <div>
             <label className="block text-sm mb-1 text-gray-300">Kategori</label>
              <div className="text-sm px-2 py-1 rounded border inline-block bg-gray-900">
                {thread.category}
                 </div>
              </div>
            <div>
                <label className="block text-sm mb-1 text-gray-300">Titel</label>
                <input className="w-full border rounded px-3 py-2 text-black" value={title} onChange={(e) => setTitle(e.target.value)}/>
            </div>
            {thread.category === "AD" && (
                <div>
                    <label>Länk (För reklam)</label>
                    <input 
                    value={link} 
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://exemple.com"
                    />
               </div>
            )}

            <div>
                <label className="block text-sm mb-1 text-gray-600">Beskrivning</label>
            </div>
     </div>       
    )
}