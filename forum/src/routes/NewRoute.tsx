import NewThreadForm from "../components/NewThreadForm";
import { useNavigate } from "react-router-dom";
import { useRepo } from "../repo";
import type { User } from "../types";

export default function NewRoute({
  repo,
  currentUser,
}: {
  repo: ReturnType<typeof useRepo>;
  currentUser: User | null;
}) {
  const navigate = useNavigate();
  if (!currentUser) return(
     <div className="flex items-center justify-center min-h-screen">
      <p className="text-2xl font-semibold text-gray-200 text-center">
        Du måste vara inloggad för att skapa en tråd.
      </p>
    </div>
  )
  
  return <NewThreadForm repo={repo} currentUser={currentUser} onCreated={(t) => navigate(`/thread/${t.id}`)} />;
}
