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
    const [description, setDescription] = useState("")
    const [error, setError] = useState<string |null>(null)

  if (!currentUser) return <p>Du måste vara inloggad för att skapa en tråd.</p>;


    return (
      <div className="max-w-2xl">
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
            </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Beskrivning</label>
              <textarea className=" bg-white text-gray-900 w-full border rounded-xl px-3 py-2 min-h-[120px]" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex item-center-xl gap-2">
              <button
              className="px-3 py-2 rounded-xl border"
              onClick={() => {
                try {
                  if (!title.trim()) throw new Error("Titel saknas")
                  if (!description.trim()) throw new Error("Beskrivning saknas")
                    const created = repo.actions.createThread({
                  title: title.trim(),
                  description: description.trim(),
                  creator: currentUser,
                  } as Omit<Thread, "id" | "creationDate">)
                  onCreated(created)  
                } catch (e: unknown) {
                  setError(e instanceof Error ? e.message : "Kunde inte skapa tråd")
                }
              }}
              >
                Skapa
              </button>

            </div>
      </div>
    )

}