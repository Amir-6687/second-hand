import React, { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { BASE_URL } from "../lib/api";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    zustand: "",
    width: "",
    depth: "",
    height: "",
    brand: "",
    model: "",
    color: "",
    material: "",
    pattern: "",
  });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    description: "",
    zustand: "",
    width: "",
    depth: "",
    height: "",
    brand: "",
    model: "",
    color: "",
    material: "",
    pattern: "",
    images: [],
  });
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState([]); // for multiple images

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
          zustand: form.zustand,
          width: form.width,
          depth: form.depth,
          height: form.height,
          brand: form.brand,
          model: form.model,
          color: form.color,
          material: form.material,
          pattern: form.pattern,
          image: imageUrls[0] || imageUrl, // main image for backward compatibility
          images: imageUrls, // all images
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
      },
      body: formData,
    });
    const data = await res.json();
    setImageUrl(data.imageUrl);
    setImageUrls((prev) => [...prev, data.imageUrl]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>
      <form onSubmit={handleAdd} className="mb-6 space-y-2">
        <div className="font-bold">Product Name</div>
        <input
          className="w-full border p-2 rounded"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />

        <div className="font-bold">Price</div>
        <input
          className="w-full border p-2 rounded"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          required
        />

        <div className="font-bold">Description</div>
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />

        <div className="font-bold">Zustand</div>
        <select
          className="w-full border p-2 rounded"
          value={form.zustand}
          onChange={(e) => setForm((f) => ({ ...f, zustand: e.target.value }))}
          required
        >
          <option value="">Select Zustand</option>
          <option value="New">New</option>
          <option value="Like New">Like New</option>
          <option value="Very Good">Very Good</option>
          <option value="Good">Good</option>
          <option value="Acceptable">Acceptable</option>
          <option value="For Parts / Not Working">
            For Parts / Not Working
          </option>
        </select>

        <div className="font-bold">Size (cm)</div>
        <div className="flex gap-2">
          <input
            className="border p-2 rounded w-1/3"
            placeholder="Width"
            type="number"
            value={form.width}
            onChange={(e) => setForm((f) => ({ ...f, width: e.target.value }))}
          />
          <input
            className="border p-2 rounded w-1/3"
            placeholder="Depth"
            type="number"
            value={form.depth}
            onChange={(e) => setForm((f) => ({ ...f, depth: e.target.value }))}
          />
          <input
            className="border p-2 rounded w-1/3"
            placeholder="Height"
            type="number"
            value={form.height}
            onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
          />
        </div>

        <div className="font-bold">Details</div>
        <input
          className="w-full border p-2 rounded"
          placeholder="Brand"
          value={form.brand}
          onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Model"
          value={form.model}
          onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Color"
          value={form.color}
          onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Material"
          value={form.material}
          onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Pattern"
          value={form.pattern}
          onChange={(e) => setForm((f) => ({ ...f, pattern: e.target.value }))}
        />

        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="button" onClick={handleImageUpload}>
          Upload Image
        </button>
        {imageUrls.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="relative">
                <img src={BASE_URL + url} alt="Preview" width={60} />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  onClick={() =>
                    setImageUrls((prev) => prev.filter((u, i) => i !== idx))
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
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
                      const updateData = {
                        name: editForm.name,
                        price: parseFloat(editForm.price),
                        description: editForm.description,
                        zustand: editForm.zustand,
                        width: editForm.width,
                        depth: editForm.depth,
                        height: editForm.height,
                        brand: editForm.brand,
                        model: editForm.model,
                        color: editForm.color,
                        material: editForm.material,
                        pattern: editForm.pattern,
                        image:
                          (editForm.images && editForm.images[0]) || p.image,
                        images: editForm.images || [],
                      };
                      await apiFetch(`/products/${p._id}`, {
                        method: "PUT",
                        body: JSON.stringify(updateData),
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
                  <select
                    className="border p-1 rounded"
                    value={editForm.zustand}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, zustand: e.target.value }))
                    }
                    required
                  >
                    <option value="">Select Zustand</option>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Acceptable">Acceptable</option>
                    <option value="For Parts / Not Working">
                      For Parts / Not Working
                    </option>
                  </select>
                  <div className="flex gap-2">
                    <input
                      className="border p-1 rounded w-1/3"
                      placeholder="Width"
                      type="number"
                      value={editForm.width}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, width: e.target.value }))
                      }
                    />
                    <input
                      className="border p-1 rounded w-1/3"
                      placeholder="Depth"
                      type="number"
                      value={editForm.depth}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, depth: e.target.value }))
                      }
                    />
                    <input
                      className="border p-1 rounded w-1/3"
                      placeholder="Height"
                      type="number"
                      value={editForm.height}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, height: e.target.value }))
                      }
                    />
                  </div>
                  <input
                    className="border p-1 rounded"
                    placeholder="Brand"
                    value={editForm.brand}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, brand: e.target.value }))
                    }
                  />
                  <input
                    className="border p-1 rounded"
                    placeholder="Model"
                    value={editForm.model}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, model: e.target.value }))
                    }
                  />
                  <input
                    className="border p-1 rounded"
                    placeholder="Color"
                    value={editForm.color}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, color: e.target.value }))
                    }
                  />
                  <input
                    className="border p-1 rounded"
                    placeholder="Material"
                    value={editForm.material}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, material: e.target.value }))
                    }
                  />
                  <input
                    className="border p-1 rounded"
                    placeholder="Pattern"
                    value={editForm.pattern}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, pattern: e.target.value }))
                    }
                  />
                  {/* Image upload for edit */}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const files = Array.from(e.target.files);
                      for (const file of files) {
                        const formData = new FormData();
                        formData.append("image", file);
                        const res = await fetch(BASE_URL + "/products/upload", {
                          method: "POST",
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                              "token"
                            )}`,
                          },
                          body: formData,
                        });
                        const data = await res.json();
                        setEditForm((f) => ({
                          ...f,
                          images: [...(f.images || []), data.imageUrl],
                        }));
                      }
                    }}
                  />
                  {editForm.images && editForm.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {editForm.images.map((url, idx) => (
                        <div key={idx} className="relative">
                          <img src={BASE_URL + url} alt="Preview" width={60} />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            onClick={() =>
                              setEditForm((f) => ({
                                ...f,
                                images: f.images.filter((u, i) => i !== idx),
                              }))
                            }
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                          zustand: p.zustand || "",
                          width: p.width || "",
                          depth: p.depth || "",
                          height: p.height || "",
                          brand: p.brand || "",
                          model: p.model || "",
                          color: p.color || "",
                          material: p.material || "",
                          pattern: p.pattern || "",
                          images: p.images || [],
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
