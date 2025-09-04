import { BrowserRouter, Link, Route, Routes, } from "react-router-dom";
import { useRepo } from "./repo";
import React, { useEffect } from "react";
import type { QNAThread, Thread } from "./types";
import { useSession } from "./auth";
import ListRoute from "./routes/ListRoute";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import NewRoute from "./routes/NewRoute";
import DetailRoute from "./routes/DetailRoute";

function RouteAwareSearch() {
  const [] = React.useState("");
  return (
    <div className="flex items-center gap-2">  

      <Link className="px-3 py-2 rounded-xl border hover:bg-gray-100" to="/new">
        Skapa Ny Tråd
      </Link>
    </div>
  );
}

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
      
      repo.actions.createThread({
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
           <RouteAwareSearch />
          {currentUser ? (
            <div className="flex items-center gap-3">
                <span> Inloggad som <b>{currentUser.userName}</b></span>
                <button className="px-3 py-1.5 border rounded-xl hover:bg-gray-700"
                 onClick={() => setCurrentUser(null)}
                >Logga ut</button>
            </div>

          <Link to="/" className="py-2 wrapper text-4xl bg-clip-text text-transparent font-extrabold bg-gradient-to-r from-purple-500 via-sky-400 to-sky-50">S&M Forum</Link>
           <RouteAwareSearch />
          {currentUser ? (
            <span> HEJ! <b>{currentUser.userName}</b></span>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="px-3 py-1.5 border rounded-xl hover:bg-gray-700">Logga in</Link>
              <Link to="/register" className="px-3 py-1.5 border rounded-xl hover:bg-gray-700">Registrera</Link>
            </div>
          )}
        </div>
      </header>

      <main>
        <Routes>
           <Route path="/" element={<ListRoute threads={repo.state.threads} comments={repo.state.comments}/> }/>
           <Route path="/new" element={<NewRoute repo={repo} currentUser={currentUser} />} />
           <Route path="/thread/:id" element={<DetailRoute repo={repo} currentUser={currentUser} />} />
           <Route path="/login" element={<Login  repo={repo} setCurrentUser={setCurrentUser}/>} />
           <Route path="/register" element={<Register repo={repo} setCurrentUser={setCurrentUser}/>} />
           <Route path="*" element={<p>Sidan finns inte.</p>} />
        </Routes>
      </main>
    </div>
  );
}
