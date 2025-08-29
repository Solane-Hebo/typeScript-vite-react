import { useEffect, useState } from "react";
import { type User } from "./types";
import { LS_KEYS, readLS, writeLS } from "./storage";
import { useRepo } from "./repo";

export function useSession() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => readLS<User | null>(LS_KEYS.session, null));
  useEffect(() => writeLS(LS_KEYS.session, currentUser), [currentUser]);
  return { currentUser, setCurrentUser };
}

export function AuthWidget({
  repo,
  currentUser,
  setCurrentUser,
}: {
  repo: ReturnType<typeof useRepo>;
  currentUser: User | null;
  setCurrentUser: (u: User | null) => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (currentUser) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm">Inloggad som <b>{currentUser.userName}</b></span>
        <button className="px-3 py-1.5 rounded-xl border" onClick={() => setCurrentUser(null)}>Logga ut</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <select className="px-2 py-1.5 border rounded-xl text-sm" value={mode} onChange={(e) => setMode(e.target.value as "login" | "register")}>
        <option value="login">Logga in</option>
        <option value="register">Registrera</option>
      </select>
      <input className="px-3 py-1.5 border rounded-xl text-sm" placeholder="Användarnamn" value={userName} onChange={(e) => setUserName(e.target.value)} />
      <input className="px-3 py-1.5 border rounded-xl text-sm" type="password" placeholder="Lösenord" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button
        className="px-3 py-1.5 rounded-xl border"
        onClick={() => {
          try {
            const u = mode === "login" ? repo.actions.login(userName, password) : repo.actions.register(userName, password);
            setCurrentUser(u);
            setError(null);
          } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Något gick fel");
          }
        }}
      >
        {mode === "login" ? "Logga in" : "Skapa konto"}
      </button>
      {error && <span className="text-red-600 text-sm ml-2">{error}</span>}
    </div>
  );
}
