import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import OrderHistory from "../components/OrderHistory";

export default function Profile() {
  const { user, loading: authLoading, logout } = useAuth();
  const { clearCart } = useCart();
  const { clearWishlist } = useWishlist();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    const loadProfile = async () => {
      try {
        const res = await apiFetch("/profile", {
          method: "GET",
        });
        if (!res.ok) throw new Error("Fehler beim Laden des Profils");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        alert("❌ Error loading profile: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user, authLoading]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch("/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      alert("✅ Profile updated successfully!");
    } catch (err) {
      alert("❌ Error saving profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await apiFetch("/profile", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete account");
      clearCart();
      clearWishlist();
      logout();
      navigate("/");
    } catch (err) {
      alert("❌ Error deleting account: " + err.message);
    }
  };

  if (authLoading || loading) {
    return <p className="p-4 text-center">Loading profile...</p>;
  }

  if (!user) {
    return <p className="p-4 text-center">Please log in to view your profile.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "profile"
              ? "border-pink-500 text-pink-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Profile Settings
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "orders"
              ? "border-pink-500 text-pink-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Order History
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Username</label>
              <input
                name="username"
                value={profile.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                disabled
                title="Email cannot be changed"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">First Name</label>
                <input
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Last Name</label>
                <input
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Phone Number</label>
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Address</label>
              <input
                name="address"
                value={profile.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className={`w-full py-2 px-4 rounded text-white font-medium ${
                saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600"
              } transition`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
          <div className="mt-6 border-t pt-4 text-center">
            <button
              onClick={handleDeleteAccount}
              className="text-red-500 hover:underline text-sm"
            >
              Delete Account
            </button>
          </div>
        </div>
      ) : (
        <OrderHistory />
      )}
    </div>
  );
}
