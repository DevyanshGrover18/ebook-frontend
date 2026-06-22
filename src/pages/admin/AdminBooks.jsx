import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Star,
  X,
} from "lucide-react";
import { booksService, categoriesService } from "../../services/api.js";
import AdminModal from "../../components/admin/AdminModal.jsx";

const emptyForm = {
  id: "",
  title: "",
  author: "",
  price: "",
  rating: "",
  reviewCount: "",
  badge: "",
  category: "",
  publisher: "",
  edition: "",
  publicationDate: "",
  pages: "",
  isbn: "",
  language: "English",
  image: "",
  images: [],
  imageFile: null,
  imagesFiles: [],
  imageAlt: "",
  description: "",
  keyFeatures: [],
  contents: [],
};

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div
      className={`admin-toast ${type === "error" ? "admin-toast-error" : "admin-toast-success"}`}
    >
      {type === "error" ? (
        <AlertCircle className="w-4 h-4 shrink-0" />
      ) : (
        <CheckCircle className="w-4 h-4 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: "create" });
  const [activeTab, setActiveTab] = useState("details");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [booksData, catsData] = await Promise.all([
        booksService.getAll(),
        categoriesService.getAll(),
      ]);
      setBooks(Array.isArray(booksData) ? booksData : []);
      setCategories(Array.isArray(catsData) ? catsData : []);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setForm({ ...emptyForm, keyFeatures: [], contents: [] });
    setActiveTab("details");
    setModal({ open: true, mode: "create" });
  };

  const openEdit = (book) => {
    setForm({
      id: book.id || "",
      title: book.title || "",
      author: book.author || "",
      price: book.price ?? "",
      rating: book.rating ?? "",
      reviewCount: book.reviewCount ?? "",
      badge: book.badge || "",
      category: book.category || "",
      publisher: book.publisher || "",
      edition: book.edition || "",
      publicationDate: book.publicationDate || "",
      pages: book.pages ?? "",
      isbn: book.isbn || "",
      language: book.language || "English",
      image: book.image || "",
      images: book.images || [],
      imageFile: null,
      imagesFiles: [],
      imageAlt: book.imageAlt || "",
      description: book.description || "",
      keyFeatures: Array.isArray(book.keyFeatures) ? book.keyFeatures : [],
      contents: Array.isArray(book.tableOfContents)
        ? book.tableOfContents.map((c) => {
            const match = c.pages?.match(/(\d+)\s*[-–]\s*(\d+)/);
            return {
              topic: c.title || "",
              startPage: match ? match[1] : "",
              endPage: match ? match[2] : "",
            };
          })
        : Array.isArray(book.contents)
          ? book.contents.map((c) => ({
              topic: c.topic || "",
              startPage: c.startPage ?? "",
              endPage: c.endPage ?? "",
            }))
          : [],
    });
    setActiveTab("details");
    setModal({ open: true, mode: "edit", bookId: book.id });
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // ── Key features ──
  const handleFeatureChange = (index, value) => {
    setForm((f) => {
      const next = [...f.keyFeatures];
      next[index] = value;
      return { ...f, keyFeatures: next };
    });
  };

  const addFeature = () => {
    setForm((f) =>
      f.keyFeatures.length >= 10
        ? f
        : { ...f, keyFeatures: [...f.keyFeatures, ""] },
    );
  };

  const removeFeature = (index) => {
    setForm((f) => ({
      ...f,
      keyFeatures: f.keyFeatures.filter((_, i) => i !== index),
    }));
  };

  // ── Contents / table of contents ──
  const handleContentChange = (index, field, value) => {
    setForm((f) => {
      const next = [...f.contents];
      next[index] = { ...next[index], [field]: value };
      return { ...f, contents: next };
    });
  };

  const addContentRow = () => {
    setForm((f) => ({
      ...f,
      contents: [...f.contents, { topic: "", startPage: "", endPage: "" }],
    }));
  };

  const removeContentRow = (index) => {
    setForm((f) => ({
      ...f,
      contents: f.contents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (
        [
          "image",
          "images",
          "imageFile",
          "imagesFiles",
          "keyFeatures",
          "contents",
        ].includes(key)
      )
        return;
      formData.append(key, form[key]);
    });

    formData.append(
      "keyFeatures",
      JSON.stringify(
        form.keyFeatures
          .map((f) => f.trim())
          .filter(Boolean)
          .slice(0, 10),
      ),
    );

    formData.append(
      "contents",
      JSON.stringify(
        form.contents
          .filter((c) => c.topic.trim())
          .map((c) => ({
            topic: c.topic.trim(),
            startPage: parseInt(c.startPage, 10) || 0,
            endPage: parseInt(c.endPage, 10) || 0,
          })),
      ),
    );

    if (form.imageFile) {
      formData.append("image", form.imageFile);
    } else {
      formData.append("image", form.image);
    }

    if (form.imagesFiles && form.imagesFiles.length > 0) {
      form.imagesFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    if (form.images && form.images.length > 0) {
      formData.append("existingImages", JSON.stringify(form.images));
    }

    try {
      if (modal.mode === "create") {
        await booksService.create(formData);
        showToast("Book created successfully");
      } else {
        await booksService.update(modal.bookId, formData);
        showToast("Book updated successfully");
      }
      setModal({ open: false });
      loadData();
    } catch (err) {
      showToast(err.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (book) => {
    if (!window.confirm(`Delete "${book.title}"? This cannot be undone.`))
      return;
    setDeleting(book._id);
    try {
      await booksService.delete(book.id);
      showToast("Book deleted");
      loadData();
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <Toast {...toast} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" /> Books
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            {books.length} publications in the catalog
          </p>
        </div>
        <button
          id="admin-add-book-btn"
          onClick={openCreate}
          className="admin-btn-primary flex items-center gap-2 px-4 py-2"
        >
          <Plus className="w-4 h-4" /> Add Book
        </button>
      </div>

      <div className="admin-panel overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No books yet. Add one to get started.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Author</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Badge</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {book.image && (
                        <img
                          src={book.image}
                          alt={book.imageAlt}
                          className="w-10 h-14 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <div>
                        <p className="text-white font-medium leading-snug">
                          {book.title}
                        </p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          {book.edition}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="text-slate-300 text-sm">{book.author}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 text-xs font-medium border border-amber-400/20">
                      {book.category}
                    </span>
                  </td>
                  <td className="text-slate-300 font-mono text-sm">
                    ₹{book.price?.toFixed(2)}
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-amber-400 text-sm">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {book.rating}
                    </span>
                  </td>
                  <td>
                    {book.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-400/10 text-blue-400 text-xs font-medium border border-blue-400/20">
                        {book.badge}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(book)}
                        className="admin-icon-btn text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(book)}
                        disabled={deleting === book._id}
                        className="admin-icon-btn text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        title="Delete"
                      >
                        {deleting === book._id ? (
                          <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin block" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Book Form Modal */}
      <AdminModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.mode === "create" ? "Add New Book" : "Edit Book"}
        maxWidth="max-w-3xl"
      >
        {/* Tabs */}
        <div className="flex items-center gap-6 -mt-1 mb-5 border-b border-slate-700/60">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`relative pb-3 text-sm font-medium transition-colors ${
              activeTab === "details"
                ? "text-amber-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Details
            {activeTab === "details" && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contents")}
            className={`relative pb-3 text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === "contents"
                ? "text-amber-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Contents
            {form.contents.length > 0 && (
              <span className="text-[11px] bg-slate-700 text-slate-300 rounded-full px-1.5 py-0.5 leading-none">
                {form.contents.length}
              </span>
            )}
            {activeTab === "contents" && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "details" && (
            <>
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">ID (slug)</label>
                  <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    required
                    placeholder="e.g. book-5"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="Publication title"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Author</label>
                  <input
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    required
                    placeholder="Author name"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="admin-input"
                  >
                    <option value="">— Select category —</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    required
                    placeholder="199.00"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Rating (0–5)</label>
                  <input
                    name="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={form.rating}
                    onChange={handleChange}
                    placeholder="4.8"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Review Count</label>
                  <input
                    name="reviewCount"
                    type="number"
                    min="0"
                    value={form.reviewCount}
                    onChange={handleChange}
                    placeholder="124"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Badge (optional)</label>
                  <input
                    name="badge"
                    value={form.badge}
                    onChange={handleChange}
                    placeholder="e.g. New Release"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Publisher</label>
                  <input
                    name="publisher"
                    value={form.publisher}
                    onChange={handleChange}
                    placeholder="Publisher name"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Edition</label>
                  <input
                    name="edition"
                    value={form.edition}
                    onChange={handleChange}
                    placeholder="1st Edition"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Publication Date</label>
                  <input
                    name="publicationDate"
                    value={form.publicationDate}
                    onChange={handleChange}
                    placeholder="January 2024"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Pages</label>
                  <input
                    name="pages"
                    type="number"
                    min="0"
                    value={form.pages}
                    onChange={handleChange}
                    placeholder="450"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">ISBN</label>
                  <input
                    name="isbn"
                    value={form.isbn}
                    onChange={handleChange}
                    placeholder="978-x-xxxx-xxxx-x"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Language</label>
                  <input
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    placeholder="English"
                    className="admin-input "
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Full book description…"
                  className="admin-input min-h-40"
                />
              </div>

              {/* Key Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="admin-label !mb-0">Key Features</label>
                  <span className="text-xs text-slate-500">
                    {form.keyFeatures.length}/10
                  </span>
                </div>

                {form.keyFeatures.length === 0 && (
                  <p className="text-xs text-slate-500 mb-2">
                    Add up to 10 highlights shown on the book's overview page.
                  </p>
                )}

                <div className="space-y-2">
                  {form.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <input
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(index, e.target.value)
                        }
                        placeholder="e.g. Comparative analysis spanning 34 jurisdictions"
                        className="admin-input flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-slate-500 hover:text-red-400 p-1 shrink-0"
                        aria-label="Remove feature"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {form.keyFeatures.length < 10 && (
                  <button
                    type="button"
                    onClick={addFeature}
                    className="mt-2 flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add feature
                  </button>
                )}
              </div>

              {/* Cover Image */}
              <div>
                <label className="admin-label">Cover Image</label>
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-700 hover:border-amber-400/50 rounded-xl p-6 cursor-pointer transition-colors group">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setForm({ ...form, imageFile: e.target.files[0] })
                    }
                  />
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-amber-400/10 transition-colors">
                    <Plus className="w-5 h-5 text-slate-400 group-hover:text-amber-400" />
                  </div>
                  <p className="text-sm text-slate-400 group-hover:text-slate-300">
                    Click to upload cover image
                  </p>
                  <p className="text-xs text-slate-600">PNG, JPG, WEBP</p>
                </label>

                {/* Cover preview */}
                {(form.imageFile || form.image) && (
                  <div className="mt-3 flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={
                          form.imageFile
                            ? URL.createObjectURL(form.imageFile)
                            : form.image
                        }
                        alt="Cover preview"
                        className="w-20 h-28 rounded-lg object-cover border border-slate-700"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm({ ...form, imageFile: null, image: "" })
                        }
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-400 text-white rounded-full p-1 transition-colors"
                        aria-label="Remove cover image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="pt-1">
                      <p className="text-xs font-medium text-slate-300">
                        {form.imageFile ? form.imageFile.name : "Current cover"}
                      </p>
                      {form.imageFile && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {(form.imageFile.size / 1024).toFixed(0)} KB
                        </p>
                      )}
                      {!form.imageFile && form.image && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          Leave empty to keep
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Gallery Images */}
              <div>
                <label className="admin-label">Gallery Images</label>
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-700 hover:border-amber-400/50 rounded-xl p-6 cursor-pointer transition-colors group">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        imagesFiles: Array.from(e.target.files),
                      })
                    }
                  />
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-amber-400/10 transition-colors">
                    <Plus className="w-5 h-5 text-slate-400 group-hover:text-amber-400" />
                  </div>
                  <p className="text-sm text-slate-400 group-hover:text-slate-300">
                    Click to upload gallery images
                  </p>
                  <p className="text-xs text-slate-600">
                    PNG, JPG, WEBP · Multiple allowed
                  </p>
                </label>

                {/* New gallery files preview */}
                {form.imagesFiles && form.imagesFiles.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
                      New uploads
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {form.imagesFiles.map((file, i) => (
                        <div key={i} className="relative group/img">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New gallery ${i + 1}`}
                            className="w-16 h-16 rounded-lg object-cover border border-slate-700"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                imagesFiles: form.imagesFiles.filter(
                                  (_, idx) => idx !== i,
                                ),
                              })
                            }
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-400 text-white rounded-full p-1 transition-colors opacity-0 group-hover/img:opacity-100"
                            aria-label="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Existing gallery preview */}
                {form.images && form.images.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
                      Existing gallery
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative group/img">
                          <img
                            src={img}
                            alt={`Gallery ${i + 1}`}
                            className="w-16 h-16 rounded-lg object-cover border border-slate-700"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                images: form.images.filter(
                                  (_, idx) => idx !== i,
                                ),
                              })
                            }
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-400 text-white rounded-full p-1 transition-colors opacity-0 group-hover/img:opacity-100"
                            aria-label="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Image Alt Text */}
              <div>
                <label className="admin-label">Image Alt Text</label>
                <input
                  name="imageAlt"
                  value={form.imageAlt}
                  onChange={handleChange}
                  placeholder="Descriptive alt text"
                  className="admin-input"
                />
              </div>
            </>
          )}

          {activeTab === "contents" && (
            <div className="space-y-3">
              {form.contents.length === 0 && (
                <p className="text-sm text-slate-500">
                  No topics yet. Add the chapters or sections that make up this
                  book's table of contents.
                </p>
              )}

              {form.contents.map((row, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-800/60 border border-slate-700/60 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-8 h-8 shrink-0 rounded-md bg-slate-900 text-slate-300 text-xs font-semibold flex items-center justify-center">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <input
                      value={row.topic}
                      onChange={(e) =>
                        handleContentChange(index, "topic", e.target.value)
                      }
                      placeholder="Topic title"
                      className="admin-input w-full!"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pl-11 sm:pl-0">
                    <input
                      type="number"
                      min="0"
                      value={row.startPage}
                      onChange={(e) =>
                        handleContentChange(index, "startPage", e.target.value)
                      }
                      placeholder="Start"
                      className="admin-input w-16! sm:w-20! shrink-0"
                      style={{ width: "5rem" }}
                    />
                    <span className="text-slate-500 text-sm shrink-0">–</span>
                    <input
                      type="number"
                      min="0"
                      value={row.endPage}
                      onChange={(e) =>
                        handleContentChange(index, "endPage", e.target.value)
                      }
                      placeholder="End"
                      className="admin-input w-16! sm:w-20! shrink-0"
                      style={{ width: "5rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeContentRow(index)}
                      className="text-slate-500 hover:text-red-400 p-1 shrink-0"
                      aria-label="Remove topic"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addContentRow}
                className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300"
              >
                <Plus className="w-3.5 h-3.5" /> Add topic
              </button>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModal({ open: false })}
              className="admin-btn-ghost px-5 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="admin-btn-primary px-5 py-2 flex items-center gap-2"
            >
              {saving && (
                <span className="w-4 h-4 border-2 border-slate-900/40 border-t-slate-900 rounded-full animate-spin" />
              )}
              {modal.mode === "create" ? "Create Book" : "Save Changes"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

export default AdminBooks;
