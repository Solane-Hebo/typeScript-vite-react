import { useState } from "react";
import { useNavigate } from "react-router-dom";

type LoginProps = {
  repo: ReturnType<typeof import("../repo").useRepo>;
  setCurrentUser: (user: any) => void;
};

const Login: React.FC<LoginProps> = ({ repo, setCurrentUser }) => {
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [error, setError] = useState<{ name?: string; password?: string; general?: string }>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError({});
  };

  const validateForm = (): boolean => {
    const newErrors: typeof error = {};

    if (!formData.name.trim()) newErrors.name = "Användarnamn får inte vara tomt";
    if (!formData.password.trim()) newErrors.password = "Lösenord får inte vara tomt";
    else if (formData.password.length < 6) newErrors.password = "Lösenord måste vara minst 6 tecken";

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const user = repo.actions.login(formData.name, formData.password);
      setCurrentUser(user);
      navigate("/");
    } catch (err) {
      setError({ general: err instanceof Error ? err.message : "Fel vid inloggning" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-6 bg-gray-800 rounded-xl w-80">
        <h2 className="text-2xl font-bold mb-4">Logga in</h2>

        {error.general && <p className="text-red-500">{error.general}</p>}

        <label htmlFor="name">Användarnamn</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded text-black"
        />
        {error.name && <p className="text-red-500 text-sm">{error.name}</p>}

        <label htmlFor="password">Lösenord</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 rounded text-black"
        />
        {error.password && <p className="text-red-500 text-sm">{error.password}</p>}

        <button type="submit" className="mt-4 bg-blue-500 rounded p-2 hover:bg-blue-600">
          Logga in
        </button>
      </form>
    </div>
  );
};

export default Login;
