import { useState } from "react";
import { useNavigate } from "react-router-dom";

type RegisterProps = {
  repo: ReturnType<typeof import("../repo").useRepo>;
  setCurrentUser: (user: any) => void;
};

const Register: React.FC<RegisterProps> = ({ repo, setCurrentUser }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; general?: string }>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError({});
  };

  const validateForm = (): boolean => {
    const newErrors: typeof error = {};

    if (!formData.name.trim()) newErrors.name = "Användarnamn får inte vara tomt";
    if (!formData.email.trim()) newErrors.email = "Email får inte vara tomt";
    else if (!formData.email.includes("@")) newErrors.email = "Ogiltig email";

    if (!formData.password.trim()) newErrors.password = "Lösenord får inte vara tomt";
    else if (formData.password.length < 6) newErrors.password = "Lösenord måste vara minst 6 tecken";

    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = "Bekräfta lösenord";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Lösenorden matchar inte";

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const user = repo.actions.register(formData.name, formData.password);
      setCurrentUser(user);
      navigate("/");
    } catch (err) {
      setError({ general: err instanceof Error ? err.message : "Fel vid registrering" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-6 bg-gray-800 rounded-xl w-80">
        <h2 className="text-2xl font-bold mb-4">Registrera</h2>

        {error.general && <p className="text-red-500">{error.general}</p>}

        <label htmlFor="name">Användarnamn</label>
        <input id="name" type="text" value={formData.name} onChange={handleChange} className="border p-2 rounded text-black" />
        {error.name && <p className="text-red-500 text-sm">{error.name}</p>}

        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={formData.email} onChange={handleChange} className="border p-2 rounded text-black" />
        {error.email && <p className="text-red-500 text-sm">{error.email}</p>}

        <label htmlFor="password">Lösenord</label>
        <input id="password" type="password" value={formData.password} onChange={handleChange} className="border p-2 rounded text-black" />
        {error.password && <p className="text-red-500 text-sm">{error.password}</p>}

        <label htmlFor="confirmPassword">Bekräfta lösenord</label>
        <input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="border p-2 rounded text-black" />
        {error.confirmPassword && <p className="text-red-500 text-sm">{error.confirmPassword}</p>}

        <button type="submit" className="mt-4 bg-green-500 rounded p-2 hover:bg-green-600">
          Registrera
        </button>
      </form>
    </div>
  );
};

export default Register;
