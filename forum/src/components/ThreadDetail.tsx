<<<<<<< HEAD
import type { useRepo } from "../repo";
import type { QNAThread, Thread, User } from "../types";

export default function ThreadDetail({
    thread,
    //comments,
    // currentUser,
    // repo,
=======
import React, { useState } from "react";
import type { useRepo } from "../repo";
import type { QNAThread, Thread, User, Comment } from "../types";

export default function ThreadDetail({
    thread,
     currentUser,
     repo,
>>>>>>> origin/main
}: {
    thread: Thread | QNAThread
   //comment 
   currentUser: User | null
   repo: ReturnType<typeof useRepo>

}) {
<<<<<<< HEAD
    const isQNA = thread.category === "QNA"
=======

    const [newComment, setNewComment] = useState("");

    const comments = repo.state.comments.filter((c) => c.thread === thread.id )

    const handleAddComment = () => {
        if(!currentUser) {
            alert("Du måste vara inloggad för att kommentera.")
            return;
        }

        if(!newComment.trim()) return;
    
    repo.actions.addComment(thread.id, newComment, currentUser);
    setNewComment("")

   
}


    const isQNA = (thread as QNAThread).category === "QNA";
>>>>>>> origin/main
    const qna = isQNA ? (thread as QNAThread) : null

    return (
        <div className="space-y-4 mt-9">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-600 flex items-center gap-2">
                    {thread.title}
                    {isQNA && qna?.isAnswered && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-800">Besvarad</span>
                    )}
                </h2>
                <div className="text-xs text-gray-600 mt-1">
                    Skapad {new Date(thread.creationDate).toLocaleString()} av {thread.creator.userName}
                </div>
                <p className="mt-3 text-gray-600">
                    {thread.description }
                </p>
            </div>
<<<<<<< HEAD
            {/* Todo Add Comments and functions commentItem and commentform*/}
=======

            {/* Todo Add Comments and functions commentItem and commentform*/}
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Kommentarer</h3>
                {comments.length === 0 ? (
                    <p className="text-sm text-gray-500">Inga kommentarer än.</p>
                ): (

                 <ul className="space-y-2">
                    {comments.map(( c: Comment) => (
                      <li 
                        key ={c.id}
                        className="border-b border-gray-200 pb-2 last:border-none"  
                     >
                        <p className="text-sm text-gray-700">{c.content}</p>
                        <span className="text-xs text-gray-500"> {c.creator.userName}</span>
                      </li>

                     ))}
                 </ul>
                 )}
                 {currentUser && (
                    <div className="mt-4">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full border rounded p-2 text-sm text-black"
                          placeholder="Skriv en kommentar..."
                        />
                        <button 
                          onClick={handleAddComment}
                          className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >Skicka</button>
                    </div>
                 )}
            </div>
>>>>>>> origin/main
        </div>
    )
}