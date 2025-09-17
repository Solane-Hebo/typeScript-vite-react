import { BrowserRouter, Link, Route, Routes, useNavigate, } from "react-router-dom";
import { useRepo } from "./repo";
import React, { useEffect } from "react";
import type { Advertisement, QNAThread} from "./types";
import { useSession } from "./auth";
import ListRoute from "./routes/ListRoute";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import NewRoute from "./routes/NewRoute";
import DetailRoute from "./routes/DetailRoute";

function RouteAwareSearch() {
  const navigate = useNavigate()
  const [v, setV] = React.useState("");
  return (
      <div className="flex items-center gap-0.5 justify-center mt-6 px-2">
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="Sök trådar eller taggar..."
        className="px-3 py-2 rounded-xl border w-64 hover:bg-gray-800"
      />
      <button className="px-3 py-2 rounded-xl border hover:bg-gray-800" onClick={() => navigate(`/?q=${encodeURIComponent(v)}`)}>
        Sök
      </button>
      <Link className="px-3 py-2 rounded-xl ml-3 border hover:bg-gray-800" to="/new">
        Skapa ny tråd
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
 
  useEffect(() => {
    if (repo.state.users.length === 0) {
      const Jone = repo.actions.register("Jone", "pass");
      const bob = repo.actions.register("bob", "pass");
      
      repo.actions.createThread({
        title: "Välkommen!",
        category: "THREAD",
        description: "Presentera dig här.",
        creator: Jone,
        tags: ["Introduction", "Regler"]
      });

      const qna = repo.actions.createThread({
        title: "Hur kan man nesta kommentarer i TS",
        category: "QNA",
        description: "Behöver exempel på typer och rendering?",
        creator: bob,
        tags: ["Typescript", "qna"],
      }) as QNAThread;
      repo.actions.addComment({ thread: qna.id, content: "Använd 'comment?: number' som parent-id", creator: bob, isAnswer: false })
      repo.actions.createThread({
        title: "50% rabbatt på alla prylar!",
        category: "AD",
        description: "Kolla in vår hemsida för mer info.",
        creator: Jone,
        tags: ["Ad", "Rabatt", "Prylar"],
        link: "https://www.example.com"
      }) as Advertisement  
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <header className="sticky top-0 z-10 bg-gray-950 border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
         <Link to="/" className="py-2 wrapper text-4xl bg-clip-text text-transparent font-extrabold bg-gradient-to-r from-purple-500 via-sky-400 to-sky-50">Forum</Link>
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span> Hej! <b>{currentUser.userName}</b></span>
                 <button className="px-3 py-1.5 border rounded-xl hover:bg-gray-700"
                  onClick={() => setCurrentUser(null)}
                 >
                  Logga ut
                </button>
             </div>
         
        ) : (
          <div className="flex gap-3">
              <Link to="/login" className="px-3 py-1.5 border rounded-xl hover:bg-gray-700">Logga in</Link>
              <Link to="/register" className="px-3 py-1.5 border rounded-xl hover:bg-gray-700">Registrera</Link>
            </div>
          )}
        </div>
      </header>

          <RouteAwareSearch />
      <main>
        <Routes>
           <Route path="/" element={
            <ListRoute 
            threads={repo.state.threads} 
            comments={repo.state.comments}
            tags={repo.state.tags}
            /> 
            }
            />
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
