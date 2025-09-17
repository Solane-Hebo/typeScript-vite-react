import { type QNAThread, type Thread, type Comment, type ThreadTag, type Advertisement } from "../types";
import { Link } from "react-router-dom";
import { CheckCircle2, MessageCircle } from "lucide-react";

function clsx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type ThreadLike = Thread | QNAThread | Advertisement

export default function ThreadList({
  threads,
  comments,
  allTags,
  tagFilter,
  setTagFilter
}: {
  threads: ThreadLike[],
  comments: Comment[],
  allTags: ThreadTag[]
  tagFilter: number | null
  setTagFilter: (id: number | null) => void
}) {

  const filtered: ThreadLike[] = 
  tagFilter == null
    ? threads
    : threads.filter((t) => 
      (t.tags ?? []).some((tg) => Number(tg.id) === tagFilter))

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2 flex-wrap  ">
        <span className ="text-sm font-medium">Alla Trådar</span>
        {allTags.map((tg) => (
        <button key={`${tg.id}-${tg.name}`}
          className={clsx(
            "px-4 py-2 rounded-full border text-md",
          tagFilter === Number(tg.id) && "bg-blue-50 text-blue-700 border-blue-200"
        )}
        onClick={() => setTagFilter(Number(tg.id))}>
        #{tg.name}
         </button>
        ))}
        </div>
         
         <div className="text-md text-gray-200">
        Visar <b>{filtered.length}</b> av <b>{threads.length}</b> trådar
        {tagFilter != null && (
         <span> {" "}·
         <button
            className="underline"
            onClick={() => setTagFilter(null)}
            >
              rensa filter
          </button>
          </span>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-2xl font-semibold text-gray-200 text-center italic mt-4">
          Inga trådar matchade din sökning eller filter.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((t, idx) => {
            const commentCount = comments.filter(
              (c) =>String(c.thread) === String(t.id)).length;
            const isQNA = t.category === "QNA";
            const answeredByThread = isQNA && (t as QNAThread).isAnswered === true;
            const answeredByComment =
              isQNA &&
              comments.some((c) => c.thread === t.id && c.isAnswer === true);
            const isAnswered = answeredByThread || answeredByComment;

          const seen = new Set<String>();
            const uniqueTags = (t.tags ?? []).filter((tg) => {
              const key = String(tg.id)
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });
            

          return (
            <Link key={`thread-${String(t.id)}-${t.creationDate}-${idx}`} to={`/thread/${String(t.id)}`} className="block">
            <article className={clsx("rounded-2xl border bg-white p-4 shadow-sm hover:shadow", 
             t.category === "AD" && "ring-2 ring-amber-400"
            )}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-gray-800">{t.title}</h3>

                  {isAnswered && (
                    <span className="flex items-center text-emerald-700 text-xs font-medium">
                      <CheckCircle2 size={14} className="mr-1" />
                        Besvarad
                    </span>
                  )}
                  <span
                    className={clsx(
                      "text-xs px-2 py-0.5 rounded-full border",
                      t.category === "THREAD" &&
                      "bg-blue-50 text-blue-700 border-blue-200",
                      t.category === "QNA" &&
                      "bg-emerald-50 text-emerald-700 border-emerald-200",
                      t.category === "AD" &&
                      "bg-emerald-50 text-amber-700 border-amber-200"

                    )}
                    >
                    {t.category}
                  </span>
                </div>
           
                <p className="text-sm text-gray-900 mt-1 line-clamp-2">{t.description}</p>
                <div className="mt-3 text-gray-500 flex items-center flex-wrap">
                  {uniqueTags.map((tg, i) =>(
                    <span
                      key={`${String(t.id)}-${String(tg.id)}-${i}`}
                      className="text-xs px-2 py-0.5 bg-gray-200 rounded-full"
                      >
                        #{tg.name}
                    </span>
                  ))}


                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Skapad {new Date(t.creationDate).toLocaleString()} av{" "}
                    {t.creator.userName}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle size={16} />
                    {commentCount}
                  </span>
              </div>
            </article>
          </Link>
        );
      })}
      </div>
)}
    </div>
  );
}
