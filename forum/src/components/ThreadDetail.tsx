import { useState } from "react"
import type { QNAThread, Thread, User, Comment } from "../types";
import type { useRepo } from "../repo";
import { Lock, MessageCircle, Unlock } from "lucide-react";

export default function ThreadDetail({
     thread,
     currentUser,
     repo,
}: {
    thread: Thread | QNAThread
   currentUser: User | null
   repo: ReturnType<typeof useRepo>

}) {

    const [newComment, setNewComment] = useState("");

    const comments = repo.state.comments.filter((c) => c.thread === thread.id )

    const isQNA = (thread as QNAThread).category === "QNA";
    const qna = isQNA ? (thread as QNAThread) : null

    const isLocked = thread.isLocked === true
    const isCreator = !!currentUser && currentUser.userName === thread.creator.userName
    const canLock = !!currentUser && (currentUser.role === "MODERATOR" || currentUser)
    
    const handleAddComment = () => {
        if(!currentUser) {
            alert("Du måste vara inloggad för att kommentera.")
            return;
        }

        if(isLocked) {
            alert("Tråden är låst. Nya kommentarer är avstängda")
            return
        }

        if(!newComment.trim()) return;
    
    repo.actions.addComment(thread.id, newComment, currentUser);
    setNewComment("")

   
};

const handleMarkAsAnswer = (commentId: number) => {

    if(!currentUser || !isCreator || isLocked ) return;
    if(currentUser.userName !== thread.creator.userName) return
    if(!isQNA) return; 

    const updatedThread: QNAThread = { 
        ...qna!, isAnswered: true, 
        commentAnswerId: commentId, };
    repo.actions.updateThread(updatedThread);
};

const handleToggleLock = () => {
    if(!currentUser) {
        alert("Endast trådskaparen eller moderatorer låsa tråden.")
        return
    }
    const update = {...thread, isLocked: !isLocked}
    repo.actions.updateThread(update)
}


   
    return (
        <div className="space-y-4 mt-9">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-600 flex items-center gap-2">
                    {thread.title}
                    <span
                        className={`text-xs px-2 py-0.5 rounded-full border
                        ${thread.category === "THREAD" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                        ${thread.category === "QNA" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}
                        `}
                    >
                        {thread.category}
                    </span>

                    {isQNA && qna?.isAnswered && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-800 text-white">Besvarad</span>
                    )}
                    {isLocked && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-white">Låst</span>
                    )}
                </h2>
                <div className="text-xs text-gray-600 mt-1">
                    Skapad {new Date(thread.creationDate).toLocaleString()} av {thread.creator.userName}
                </div>

                {canLock && (
                    <button 
                    onClick={handleToggleLock}
                    className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded border 
                        ${isLocked ? "bg-gray-100 text-gray-800 border-gray-300" : "bg-red-50 text-red-700 border-red-200"}
                        `}
                        title={isLocked ? "Lås upp tråd" : "Lås tråd"}
                        >
                            {isLocked ? <Unlock size={14} /> : <Lock size={14} />}
                            {isLocked ? "Los upp" : "Lås"}
                        </button>
                )}
                <p className="mt-3 text-gray-600">
                    {thread.description }
                </p>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">

                <h3 className="text-lg font-semibold text-black mb-2">Kommentarer</h3>
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
                                    <span className="text-xs text-gray-500 ">{c.creator.userName}</span>

                                    {!isAnswer &&
                                        currentUser?.userName === thread.creator.userName &&
                                        isQNA && (
                                            <button
                                                onClick={() => handleMarkAsAnswer(c.id)}
                                                className="mt-2 text-xs text-blue-600 hover:underline pl-4"
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
                          className={`mt-2 px-3 py-1.5 text-white rounded ${
                            isLocked ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700" 
                          }`} 
                          disabled={isLocked}
                           >
                          Skicka
                        </button>
                    </div>
                 )}
            </div>
        </div>
    )
}