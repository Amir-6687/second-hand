import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwörter stimmen nicht überein";
    }
    if (form.password.length < 6) {
      newErrors.password = "Passwort muss mindestens 6 Zeichen lang sein";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          address: form.address,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ general: data.error || "Registration failed" });
      } else {
        alert("✅ Registrierung erfolgreich!");
        navigate("/login");
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="max-w-md mx-auto p-6 space-y-4 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-bold text-center mb-4">Registrieren</h2>
      {errors.general && (
        <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
          {errors.general}
        </div>
      )}
      <div>
        <input
          name="username"
          placeholder="Username"
          required
          value={form.username}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <input
          type="email"
          name="email"
          placeholder="E-Mail"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="Passwort"
          required
          value={form.password}
          onChange={handleChange}
          className={`w-full border px-3 py-2 rounded ${
            errors.password ? "border-red-500" : ""
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
      </div>
      <div>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Passwort bestätigen"
          required
          value={form.confirmPassword}
          onChange={handleChange}
          className={`w-full border px-3 py-2 rounded ${
            errors.confirmPassword ? "border-red-500" : ""
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
        )}
      </div>
      <div>
        <input
          name="first_name"
          placeholder="Vorname"
          value={form.first_name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <input
          name="last_name"
          placeholder="Nachname"
          value={form.last_name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <input
          name="phone"
          placeholder="Telefonnummer"
          value={form.phone}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <input
          name="address"
          placeholder="Adresse"
          value={form.address}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400"
      >
        {loading ? "Registrierung läuft..." : "Registrieren"}
      </button>
    </form>
  );
}
