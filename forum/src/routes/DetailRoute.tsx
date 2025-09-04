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
  const { id } = useParams();
  const thread = repo.state.threads.find((t) => t.id === Number(id));
  if (!thread) return <p>Tråd saknas.</p>;
  return <ThreadDetail thread={thread} currentUser={currentUser} repo={repo} />;
}
