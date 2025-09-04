import { type QNAThread, type Thread, type Comment } from "../types";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

function clsx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function ThreadList({
  threads,
  comments,
}: {
  threads: Array<Thread | QNAThread>;
  comments: Comment[];
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {threads.map((t) => {
        const commentCount = comments.filter((c) => c.thread === t.id).length;

        return (
          <Link key={t.id} to={`/thread/${t.id}`} className="block">
            <article className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-600">{t.title}</h3>
                <span
                  className={clsx(
                    "text-xs px-2 py-0.5 rounded-full border",
                    t.category === "THREAD" &&
                      "bg-blue-50 text-blue-700 border-blue-200",
                    t.category === "QNA" &&
                      "bg-emerald-50 text-emerald-700 border-emerald-200"
                  )}
                >
                  {t.category}
                </span>
              </div>
              <p className="text-sm mt-1 line-clamp-2">{t.description}</p>
              <div className="mt-3 text-xs text-gray-500 flex justify-between items-center">
                <span>
                  Skapad {new Date(t.creationDate).toLocaleString()} av{" "}
                  {t.creator.userName}
                </span>
                <span className="flex items-center gap-1 text-gray-600">
                  <MessageCircle size={14} />
                  {commentCount}
                </span>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}
