import ThreadDetail from "../components/ThreadDetail";
import {useParams } from "react-router-dom";
import { useRepo } from "../repo";
import type { User } from "../types";

export default function DetailRoute({
  repo,
  currentUser,
}: {
  repo: ReturnType<typeof useRepo>;
  currentUser: User | null;
}) {
  const { id } = useParams<{id: string}>();
  const routeId = String(id)
  const thread = repo.state.threads.find((t) => String(t.id )=== routeId);
  if (!thread) return <p className="min-h-screen text-lg font-semibold text-center p-6">Tråd saknas.</p>;

  const comments = repo.state.comments.filter(
    (c) => String(c.thread )=== String(thread.id)
  )
  
  return (
    <ThreadDetail 
    thread={thread} 
    comments={comments}
    currentUser={currentUser} 
    repo={repo} />
  )
  }
  
