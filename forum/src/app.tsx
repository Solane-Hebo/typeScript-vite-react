import { BrowserRouter, Link } from "react-router-dom";
import { useRepo } from "./repo";
import { useEffect } from "react";
import type { QNAThread, Thread } from "./types";


export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}

function Shell() {
  const repo = useRepo();
  // const { currentUser, setCurrentUser } = useSession();

  useEffect(() => {
    if (repo.state.users.length === 0) {
      const alice = repo.actions.register("alice", "pass");
      const bob = repo.actions.register("bob", "pass");

      const t1 = repo.actions.createThread({
        title: "Välkommen!",
        category: "THREAD",
        description: "Presentera dig här.",
        creator: alice,
      } as Omit<Thread, "id" | "creationDate">);

      const qna = repo.actions.createThread({
        title: "Hur gör jag X i TypeScript?",
        category: "QNA",
        description: "Tips på utility types?",
        creator: bob,
      } as Omit<Thread, "id" | "creationDate">) as QNAThread;

     
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-bold">Forum</Link>
          {/* <AuthWidget repo={repo} currentUser={currentUser} setCurrentUser={setCurrentUser} /> */}
        </div>
      </header>
    </div>
  );
}
