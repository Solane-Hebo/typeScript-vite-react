import EditThreadForm from "../components/EditThreadForm"
import { useNavigate, useParams } from "react-router-dom"
import { useRepo } from "../repo"
import type { User } from "../types"

export default function EditRoute({
  repo,
  currentUser,
}: {
  repo: ReturnType<typeof useRepo>
  currentUser: User | null
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const thread = repo.state.threads.find((t) => t.id === Number(id))
  if (!thread) return <p>Tråd saknas.</p>
  if (!currentUser) return <p>Du måste vara inloggad.</p>
  const canEdit = currentUser.role === "MODERATOR" || currentUser.id === thread.creator.id;
  if (!canEdit) return <p>Du har inte behörighet att redigera denna tråd.</p>;
  return (
    <EditThreadForm
      thread={thread}
      ensureTags={repo.actions.ensureTags}
      onSave={(updated) => {
        const names = updated.tags.map((t) => t.name);
        const ensured = repo.actions.ensureTags(names);
        repo.actions.updateThread({ ...updated, tags: ensured });
        navigate(`/thread/${thread.id}`);
      }}
      onDelete={() => {
        repo.actions.deleteThread(thread.id);
        navigate("/");
      }}
    />
  );
}
