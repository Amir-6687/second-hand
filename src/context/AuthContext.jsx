import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user: { userId, email, role }
  const [loading, setLoading] = useState(true);

  // توکن را از localStorage بخوان و decode کن
  const loadUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          userId: decoded.userId,
          email: decoded.email,
          username: decoded.username, // ← این خط باید باشد
          role: decoded.role,
        });
      } catch (err) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  // login: توکن را ذخیره کن و user را ست کن
  const login = (token) => {
    localStorage.setItem("token", token);
    loadUserFromToken();
  };

  // logout: توکن را حذف کن ولی Cart/Wishlist را نگه دار
  const logout = () => {
    localStorage.removeItem("token");

    // Cart و Wishlist کاربر فعلی را نگه می‌داریم
    // تا بعد از login مجدد در دسترس باشند

    setUser(null);

    // کاربر را به صفحه Home هدایت کن
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        email: user?.email || null,
        username: user?.username || null, // ← این خط باید باشد
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
