import { useMemo, useState } from "react"
import type { QNAThread, Thread, User, Comment, Advertisement } from "../types";
import type { useRepo } from "../repo";
import { Lock, MessageCircle, Unlock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { buildCommentTree } from "./commentTree";
import { CommentNode, type CommentTreeNode } from "./CommentNode";

export default function ThreadDetail({
     thread,
     comments = [],
     currentUser,
     repo,
}: {
    thread: Thread | QNAThread | Advertisement
    comments: Comment[]
    currentUser: User | null
    repo: ReturnType<typeof useRepo>

}) {


     
    const navigate = useNavigate()
    const [newComment, setNewComment] = useState("");

    const tree: CommentTreeNode[] = useMemo(
        () => buildCommentTree(comments ?? []),
        [comments]
    )

    // const comments = repo.state.comments.filter((c) => c.thread === thread.id )

    const isLocked = !!thread.isLocked;
    const isQNA = thread.category === "QNA";
    const qna = isQNA ? (thread as QNAThread) : null;

   const isCreator =
    !!currentUser &&
    (currentUser.id != null
      ? currentUser.id === thread.creator.id
      : currentUser.userName === thread.creator.userName)
    const canLock =
    !!currentUser && (currentUser.role === "MODERATOR"|| currentUser.id === thread.creator.id);

  
   const answered =
     isQNA && ((qna?.isAnswered ?? false) || 
     comments.some((c) => c.isAnswer));

 
   const handleUnmarkAnswer = () => {
     if (!currentUser || !isQNA) return;
     if (!(currentUser.role === "MODERATOR" || currentUser.id === thread.creator.id))return
     if (!qna?.commentAnswerId) return;
      
    const prev = repo.state.comments.find((c) => c.id === qna.commentAnswerId)
    if (prev) repo.actions.updateComment({ ...prev, isAnswer: false })

    const updated: QNAThread = { ...(thread as QNAThread), category: "QNA" }
    updated.isAnswered = false
    delete updated.commentAnswerId
    repo.actions.updateThread(updated)
   };

  
    
    const handleToggleLock = () => {
        if(!currentUser) {
            alert("Endast trådskaparen eller moderatorer låsa tråden.")
            return
        }
        const update = {...thread, isLocked: !isLocked}
        repo.actions.updateThread(update)
    }
    
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

    const t = newComment.trim()
        if (!t) return
    
    repo.actions.addComment({
        thread: thread.id,
         content: t,
         creator: currentUser,

    })
    setNewComment("")

   
};

const handleMarkAsAnswer = (commentId: number) => {

    if(!currentUser || !isCreator || !isQNA || isLocked ) return;
    if(!(currentUser.role === "MODERATOR" || isCreator)) return
    

   if (qna?.commentAnswerId) {
      const prev = repo.state.comments.find((c) => c.id === qna.commentAnswerId)
      if (prev) repo.actions.updateComment({ ...prev, isAnswer: false })
    }

    
    const found = repo.state.comments.find((c) => c.id === commentId)
    if (found) repo.actions.updateComment({ ...found, isAnswer: true })

    repo.actions.updateThread({
      ...(thread as QNAThread),
      category: "QNA",
      isAnswered: true,
      commentAnswerId: commentId,
    } as QNAThread)
  }

    return (
    <div className="mx-auto w-full max-w-6xl text-gray-800 px-4 md:px-6 py-8 space-y-6">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {thread.title}
          <span
            className={`text-xs px-2 py-0.5 rounded-full border
              ${thread.category === "THREAD" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
              ${thread.category === "QNA" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}
              ${thread.category === "AD" ? "bg-amber-50 text-amber-700 border-amber-200" : ""} 
            `}
          >
            {thread.category}
          </span>

          {isQNA && answered && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-800 text-white">
              Besvarad
            </span>
          )}
          {isLocked && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-white">
              Låst
            </span>
          )}
        </h2>

        <p className="mt-3 text-gray-800">{thread.description}</p>
        <div className="text-xs gap-2 text-gray-600 mt-1">
          Skapad {new Date(thread.creationDate).toLocaleString()} av {thread.creator.userName}
        </div>

        {canLock && (
          <button
            onClick={handleToggleLock}
            className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded border 
              ${isLocked ? "bg-gray-100 p-2 text-gray-800 border-gray-300" : "bg-red-50 text-red-700 border-red-200"}
            `}
            title={isLocked ? "Lås upp tråd" : "Lås tråd"}
          >
            {isLocked ? <Unlock size={16} /> : <Lock size={16} />}
            {isLocked ? "Lås upp" : "Lås"}
          </button>
        )}

         {thread.category === "AD" && (
          <div>
           <a className="px-3 py-2 text-blue-500 underline rounded-xl bordermt-2 p-4" 
           href={(thread as Advertisement).link}
           target="_blank"
           rel="noreferrer"
           onClick={() => repo.actions.recordClick(thread.id, currentUser || undefined)}
           > 
           Besök annons
            

          </a>
          </div>
        
        )}
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <MessageCircle size={18} className="text-blue-600" />
          Kommentarer
        </h3>

        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">Inga kommentarer än.</p>
        ) : (
          <ul className="space-y-3">
            {tree.map((node, idx) => (
              <CommentNode
                key={`root-${node.comment.id}-${idx}`} 
                node={node}
                level={0}
                showCensored={false}
                isQNA={isQNA}
                qna={qna}
                thread={thread}
                currentUser={currentUser}
                repo={repo}
                onMarkAsAnswer={handleMarkAsAnswer}     
                onUnmarkAsAnswer={handleUnmarkAnswer}  
                canMarkAsAnswer={
                  !!currentUser &&
                  (currentUser.role === "MODERATOR" || isCreator)
                }                                        
              />
            ))}
          </ul>
        )}

        {currentUser && thread.category !== "AD" && (
          <div className="mt-4">
            <textarea
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border rounded p-2 text-sm text-black"
              placeholder="Skriv en kommentar..."
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleAddComment}
                className={`mt-2 px-3 py-1.5 text-white rounded ${
                  isLocked ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={isLocked}
              >
                Skicka
              </button>
              <button
                className="mt-2 px-3 py-1.5 text-white rounded bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate(-1)}
              >
                ← Tillbaka
              </button>
            </div>
         </div>
        )}

         {thread.category === "AD" && (

          <p className="text-xs text-gray-500 mt-2">Kommentarer är avstängda för reklam.</p>
         )} 
       
      </div>
    </div>
    )
}