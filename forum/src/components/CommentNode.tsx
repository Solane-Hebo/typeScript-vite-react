import { useState } from "react";
import { useRepo, censorText, containsBadLanguage } from "../repo";
import type { QNAThread, Thread, User,Comment } from "../types";

export type CommentTreeNode = {
  comment: Comment;
  children: CommentTreeNode[];
};

type CommentNodeProps = {
  node: CommentTreeNode;
  level: number;
  showCensored: boolean;
  isQNA: boolean;
  qna: QNAThread | null;
  thread: Thread | QNAThread;
  currentUser: User | null;
  repo: ReturnType<typeof useRepo>;
  onMarkAsAnswer?: (commentId: number) => void;
  onUnmarkAsAnswer?: () => void;
  canMarkAsAnswer?: boolean;
};


export function CommentNode({
  node,
  level,
  showCensored,
  isQNA,
  qna,
  thread,
  currentUser,
  repo,
  onMarkAsAnswer,
  onUnmarkAsAnswer,
  canMarkAsAnswer

}: CommentNodeProps) {
  const c = node.comment;
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(c.content);

  const canEdit =
    !!currentUser &&
    (currentUser.role === "MODERATOR" ||
      currentUser.id === c.creator.id);

      

  const content =
    c.hiddenForLanguage && !showCensored
      ? "(censurerad kommentar)"
      : c.hiddenForLanguage && showCensored
      ? censorText(c.content)
      : c.content;


  const isAnswer = isQNA && qna?.commentAnswerId === c.id;
  const canUnmark =
    isQNA &&
    c.isAnswer &&
    !!currentUser &&
    (currentUser.role === "MODERATOR"|| currentUser.id === thread.creator.id);

  return (
    <li style={{ marginLeft: level * 16 }}>
      <div className="rounded-xl border p-3">
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <span>{c.creator.userName}</span>
          <span>•</span>
          <span>{new Date(c.creationDate).toLocaleString()}</span>
            {isAnswer && (
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-800 text-white">
              Markerad som svar
            </span>
          )}
        </div>

        {!editing ? (
          <p className="mt-1 whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="mt-1">
            <textarea
              className="w-full border rounded-lg p-2 min-h-[80px]"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="mt-2 flex items-center gap-2">
              <button
                className="px-3 py-1.5 rounded-xl border"
                onClick={() => {
                  repo.actions.updateComment({
                    ...c,
                    content: text,
                    hiddenForLanguage: containsBadLanguage(text),
                  });
                  setEditing(false);
                }}
              >
                Spara
              </button>
              <button
                className="px-3 py-1.5 rounded-xl border"
                onClick={() => {
                  setText(c.content);
                  setEditing(false);
                }}
              >
                Avbryt
              </button>
            </div>
          </div>
        )}

        
        {canEdit && (
          <div className="mt-2 flex items-center gap-2">
            {!editing && (
              <button
                className="text-xs px-2 py-1 rounded border"
                onClick={() => setEditing(true)}
              >
                Redigera
              </button>
            )}
            {

            }
            <button
              className="text-xs px-2 py-1 rounded border"
              onClick={() => repo.actions.deleteComment(c.id)}
            >
              Radera
            </button>
          </div>
        )}
        {isQNA && !isAnswer && canMarkAsAnswer && onMarkAsAnswer && (
            <button
              className="text-xs px-2 py-1 mt-2 rounded border text-blue-600"
              onClick={() => onMarkAsAnswer(c.id)}
            >
              Markera som svar
            </button>
          )}
          {canUnmark && onUnmarkAsAnswer && (
            <button
              className="text-xs px-2 py-1 mt-2 rounded border text-emerald-700"
              onClick={onUnmarkAsAnswer}
            >
              Avmarkera svar
            </button>
             )}
        </div>

    {node.children.length > 0 && (
        <ul className="mt-2 space-y-2">
          {node.children.map((child, idx) => (
            <CommentNode
              key={`c-${child.comment.id}-lvl-${level + 1}-i-${idx}`}
              node={child}
              level={level + 1}
              showCensored={showCensored}
              isQNA={isQNA}
              qna={qna}
              thread={thread}
              currentUser={currentUser}
              repo={repo}
              onMarkAsAnswer={onMarkAsAnswer}
              onUnmarkAsAnswer={onUnmarkAsAnswer}
              canMarkAsAnswer={canMarkAsAnswer}
            />
          ))}
        </ul>
      )}
      <ReplyBox parent={c} thread={thread} currentUser={currentUser} repo={repo} />

      </li>
  );
}

function ReplyBox({
  parent,
  thread,
  currentUser,
  repo,
}: {
  parent: Comment;
  thread: Thread | QNAThread;
  currentUser: User | null;
  repo: ReturnType<typeof useRepo>;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  if (thread.isLocked || thread.category === "AD") return null;

  return (
    <div className="mt-2" style={{ marginLeft: 16 }}>
      {!currentUser ? (
        <p className="text-xs text-gray-600">Logga in för att svara.</p>
      ) : !open ? (
        <button className="text-xs underline" onClick={() => setOpen(true)}>
          Svara
        </button>
      ) : (
        <div className="rounded-xl border p-3 mt-2">
          <textarea
            className="w-full border rounded-lg p-2 min-h-[80px]"
            placeholder="Skriv ett svar..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-xl border"
              onClick={() => {
                const t = value.trim();
                if (!t) return;
                repo.actions.addComment({
                  thread: thread.id,
                  content: t,
                  creator: currentUser!,
                  isAnswer: false,
                  comment: parent.id,
                });
                setValue("");
                setOpen(false);
              }}
            >
              Publicera
            </button>
            <button className="px-3 py-1.5 rounded-xl border" onClick={() => setOpen(false)}>
              Avbryt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}