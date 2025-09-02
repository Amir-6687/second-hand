// آدرس IP کامپیوترت را اینجا بگذار
// export const BASE_URL = "https://thegrrrlsclub-backend.onrender.com";

// export async function apiFetch(url, options = {}) {
//   const token = localStorage.getItem("token");
//   const headers = {
//     ...(options.headers || {}),
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     "Content-Type": "application/json",
//   };
// اگر url کامل نبود، BASE_URL را اضافه کن
//   const fullUrl = url.startsWith("http") ? url : BASE_URL + url;
//   return fetch(fullUrl, { ...options, headers });
// }

// استفاده از environment variable با fallback به URL جدید
export const BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.thegrrrlsclub.de";

export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };
  // اگر url کامل نبود، BASE_URL را اضافه کن
  const fullUrl = url.startsWith("http") ? url : BASE_URL + url;
  return fetch(fullUrl, { ...options, headers });
}
