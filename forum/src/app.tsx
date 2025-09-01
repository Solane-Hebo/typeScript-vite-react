import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { useRepo } from "./repo";
import { useEffect } from "react";
import type { QNAThread, Thread } from "./types";
import { AuthWidget, useSession } from "./auth";
import ListeRoute from "./routes/ListRoute";
import ListRoute from "./routes/ListRoute";


export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}

function Shell() {
  const repo = useRepo();

  const {currentUser, setCurrentUser} = useSession()

  // demo-data
  useEffect(() => {
    if (repo.state.users.length === 0) {
      const Jone = repo.actions.register("Jone", "pass");
      const bob = repo.actions.register("bob", "pass");

      const t1 = repo.actions.createThread({
        title: "Välkommen!",
        category: "THREAD",
        description: "Presentera dig här.",
        creator: Jone,
      } as Omit<Thread, "id" | "creationDate">);

      const qna = repo.actions.createThread({
        title: "Utility types",
        category: "QNA",
        description: "Tips på utility types?",
        creator: bob,
      } as Omit<Thread, "id" | "creationDate">) as QNAThread;

     
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <header className="sticky top-0 z-10 bg-gray-950 border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-bold">Forum</Link>
          <AuthWidget repo={repo} currentUser={currentUser} setCurrentUser={setCurrentUser} />
        </div>
      </header>

      <main>
        <Routes>
           <Route path="/" element={
            <ListRoute threads={repo.state.threads}/> }/>
        </Routes>
      </main>
    </div>
  );
}
