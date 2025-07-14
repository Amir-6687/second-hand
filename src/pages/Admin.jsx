import React, { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { BASE_URL } from "../lib/api";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", price: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  // گرفتن لیست محصولات
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await apiFetch("/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Error fetching products");
    } finally {
      setLoading(false);
    }
  }

  // افزودن محصول جدید
  async function handleAdd(e) {
    e.preventDefault();
    try {
      const res = await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          price: parseFloat(form.price),
          description: form.description,
          image: imageUrl, // ← این خط باید باشد!
        }),
      });
      if (!res.ok) throw new Error("Error adding product");
      setForm({ name: "", price: "", description: "" });
      setImageUrl("");
      setImage(null);
      fetchProducts();
    } catch (err) {
      setError("Error adding product");
    }
  }

  // حذف محصول
  async function handleDelete(id) {
    if (!window.confirm("Are you sure?")) return;
    try {
      await apiFetch(`/products/${id}`, {
        method: "DELETE",
      });
      fetchProducts();
    } catch (err) {
      setError("Error deleting product");
    }
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("image", image);
    const res = await fetch(BASE_URL + "/products/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        // مهم: Content-Type را اینجا نگذار! (خود fetch برای FormData می‌سازد)
      },
      body: formData,
    });
    const data = await res.json();
    setImageUrl(data.imageUrl);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>
      <form onSubmit={handleAdd} className="mb-6 space-y-2">
        <input
          className="w-full border p-2 rounded"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          required
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="button" onClick={handleImageUpload}>
          Upload Image
        </button>
        {imageUrl && (
          <img src={BASE_URL + imageUrl} alt="Preview" width={100} />
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {products.map((p) => (
            <li
              key={p._id}
              className="flex justify-between items-center border p-2 rounded"
            >
              {editId === p._id ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await apiFetch(`/products/${p._id}`, {
                        method: "PUT",
                        body: JSON.stringify({
                          name: editForm.name,
                          price: parseFloat(editForm.price),
                          description: editForm.description,
                        }),
                      });
                      setEditId(null);
                      fetchProducts();
                    } catch {
                      setError("Error editing product");
                    }
                  }}
                  className="flex flex-col gap-1 w-full"
                >
                  <input
                    className="border p-1 rounded"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                  />
                  <input
                    className="border p-1 rounded"
                    type="number"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, price: e.target.value }))
                    }
                    required
                  />
                  <textarea
                    className="border p-1 rounded"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="bg-gray-300 px-2 py-1 rounded"
                      onClick={() => setEditId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div>
                    <b>{p.name}</b> - €{p.price}
                    <div className="text-sm text-gray-500">{p.description}</div>
                    {p.image && (
                      <img src={BASE_URL + p.image} alt={p.name} width={60} />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditId(p._id);
                        setEditForm({
                          name: p.name,
                          price: p.price,
                          description: p.description,
                        });
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}
