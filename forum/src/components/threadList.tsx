
import { type QNAThread, type Thread } from "../types";
import { Link } from "react-router-dom";

function clsx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function ThreadList({
  threads,
}: {
  threads: Array<Thread | QNAThread>;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {threads.map((t) => (
        <Link key={t.id} to={`/thread/${t.id}`} className="block">
          <article className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t.title}</h3>
              <span
                className={clsx(
                  "text-xs px-2 py-0.5 rounded-full border",
                  t.category === "THREAD" && "bg-blue-50 text-blue-700 border-blue-200",
                  t.category === "QNA" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                )}
              >
                {t.category}
              </span>
            </div>
            <p className="text-sm mt-1 line-clamp-2">{t.description}</p>
            <div className="mt-3 text-xs text-gray-500">
              Skapad {new Date(t.creationDate).toLocaleString()} av {t.creator.userName}
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
