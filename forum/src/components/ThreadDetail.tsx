import React, { useState } from "react";
import type { useRepo } from "../repo";
import type { QNAThread, Thread, User, Comment } from "../types";
import { MessageCircle } from "lucide-react";

export default function ThreadDetail({
     thread,
     currentUser,
     repo,
}: {
    thread: Thread | QNAThread
   //comment 
   currentUser: User | null
   repo: ReturnType<typeof useRepo>

}) {

    const [newComment, setNewComment] = useState("");

    const comments = repo.state.comments.filter((c) => c.thread === thread.id )

    const isQNA = (thread as QNAThread).category === "QNA";
    const qna = isQNA ? (thread as QNAThread) : null



    const handleAddComment = () => {
        if(!currentUser) {
            alert("Du måste vara inloggad för att kommentera.")
            return;
        }

        if(!newComment.trim()) return;
    
    repo.actions.addComment(thread.id, newComment, currentUser);
    setNewComment("")

   
};

const handleMarkAsAnswer = (commentId: number) => {

    if(!currentUser ) return;
    if(currentUser.userName !== thread.creator.userName) return
    if(!isQNA) return; 

    const updatedThread: QNAThread = { ...qna!, isAnswered: true, commentAnswerId: commentId };
    repo.actions.updateThread(updatedThread);
};


   
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

            {/* Todo Add Comments and functions commentItem and commentform*/}
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
               <MessageCircle size={18} className="text-blue-600" />
                Kommentarer
            </h3>
                {comments.length === 0 ? (
                    <p className="text-sm text-gray-500">Inga kommentarer än.</p>
                ): (

                    <ul className="space-y-3">
                    {comments.map((c: Comment) => {
                        const isAnswer = qna?.commentAnswerId === c.id;
                        return (
                            <li key={c.id}>
                                {isAnswer && (
                                    <div className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-t-lg inline-block mb-1">
                                        Markerad som svar
                                    </div>
                                )}
                                <div
                                    className={`p-3 rounded-lg border ${
                                        isAnswer ? "border-emerald-600 bg-emerald-50" : "border-gray-200"
                                    }`}
                                >
                                    <p className="text-sm text-gray-700">{c.content}</p>
                                    <span className="text-xs text-gray-500">{c.creator.userName}</span>

                                    {/* Mark as Answer button */}
                                    {!isAnswer &&
                                        currentUser?.userName === thread.creator.userName &&
                                        isQNA && (
                                            <button
                                                onClick={() => handleMarkAsAnswer(c.id)}
                                                className="mt-2 text-xs text-blue-600 hover:underline"
                                            >
                                                Markera som svar
                                            </button>
                                        )}
                                </div>
                            </li>
                        );
                    })}
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
                          >Skicka
                        </button>
                    </div>
                 )}
            </div>
        </div>
    )
}