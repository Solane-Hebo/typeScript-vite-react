import type { useRepo } from "../repo";
import type { QNAThread, Thread, User } from "../types";

export default function ThreadDetail({
    thread,
    //comments,
    // currentUser,
    // repo,
}: {
    thread: Thread | QNAThread
   //comment 
   currentUser: User | null
   repo: ReturnType<typeof useRepo>

}) {
    const isQNA = thread.category === "QNA"
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
            {/* Todo Add Comments and functions commentItem and commentform*/}
        </div>
    )
}