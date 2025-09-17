import { useState } from "react";
import type { useRepo } from "../repo";
import {  type QNAThread, type Thread, type ThreadCategory, type User } from "../types";

export default function NewThreadForm({
    repo,
    currentUser,
    onCreated,
}: {
    repo: ReturnType<typeof useRepo>
    currentUser: User
    onCreated: (t: Thread | QNAThread) => void
}) {
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState<ThreadCategory>("THREAD")
    const [tags, setTags] = useState("")
    const [link, setLink] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError] = useState<string |null>(null)

  if (!currentUser) return(
     <div className="flex items-center justify-center min-h-screen">
      <p className="text-2xl font-semibold text-gray-200 text-center">
        Du måste vara inloggad för att skapa en tråd.
      </p>
    </div>
  )


    return (
      <main className="w-full flex justify-center px-6 py-10">
      <div className="max-w-4xl w-full">
         <h2 className="text-xl font-semibold mb-3">Skapa tråd</h2>
         <div className="space-y-3"></div>
           <div>
             <label className="block text-sm mb-1">Titel</label>
             <input className="w-full border rounded-xl px-3 py-2 bg-white text-gray-900" value={title} onChange={(e) => setTitle(e.target.value)} />
           </div>
           <div>
             <label className="block text-sm mb-1 ">Kategori</label>
             <select className="w-full border rounded-xl px-3 py-2 bg-white text-gray-900" value={category} onChange={(e) => setCategory(e.target.value as ThreadCategory)}>
               <option value="THREAD">THREAD (diskussion)</option>
               <option value="QNA">QNA (fråga/svar)</option>
               <option value="AD">AD (Reklam)</option>
            </select>
            </div>
            {category === "AD" && (
            <div>
             <label className="block text-sm mb-1 ">Länk (För reklam)</label>
             <input className="w-full border rounded-xl px-3 py-2" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
            </div>
            )}
            <div>
              <label className="block text-sm mb-1">Beskrivning</label>
              <textarea className=" bg-white text-gray-900 w-full border rounded-xl px-3 py-2 min-h-[120px]" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

           <div>
              <label className="block text-sm mb-1">Taggar (kommaseparerade)</label>
              <input className="w-full border rounded-xl px-3 py-2" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="typescript, qna" />
           </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

         <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded-xl border"
            onClick={() => {
              try {
                if (!title.trim()) throw new Error("Titel saknas");
                if (!description.trim()) throw new Error("Beskrivning saknas");
                const created = repo.actions.createThread({
                  title: title.trim(),
                  category,
                  description: description.trim(),
                  creator: currentUser,
                  tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
                  ...(category === "AD" ? { link } : {}),
                });
                onCreated(created);
              } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : "Kunde inte skapa tråd";
                setError(msg);
              }
            }}
          >
            Skapa
          </button>
        </div>
      </div>
    </main>
    )

}