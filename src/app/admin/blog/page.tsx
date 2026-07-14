"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { collections, db, storage } from "@/lib/firebase";
import { getDocs, query, orderBy, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { BlogPostDocument } from "@/lib/schema";
import { Search, Plus, Edit2, Trash2, Image as ImageIcon, CheckCircle, XCircle } from "lucide-react";

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPostDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPostDocument>>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    authorId: "Admin",
    tags: [],
    published: false,
    coverImageUrl: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const q = query(collections.blogPosts, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(data);
    setLoading(false);
  };

  const handleOpenModal = (post?: BlogPostDocument) => {
    if (post) {
      setEditingId(post.id!);
      setFormData(post);
      setTagsInput(post.tags.join(", "));
    } else {
      setEditingId(null);
      setFormData({
        title: "", slug: "", content: "", excerpt: "", authorId: "Admin", tags: [], published: false, coverImageUrl: ""
      });
      setTagsInput("");
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleUploadImage = async (file: File) => {
    const storageRef = ref(storage, `blog/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalImageUrl = formData.coverImageUrl;

      if (imageFile) finalImageUrl = await handleUploadImage(imageFile);

      const payload = {
        ...formData,
        tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
        coverImageUrl: finalImageUrl,
        updatedAt: new Date(),
        createdAt: editingId ? formData.createdAt : new Date(),
        publishedAt: formData.published && !formData.publishedAt ? new Date() : formData.publishedAt
      } as BlogPostDocument;

      if (editingId) {
        await updateDoc(doc(db, "blogPosts", editingId), payload);
        setPosts(prev => prev.map(post => post.id === editingId ? { id: editingId, ...payload } : post));
      } else {
        const docRef = await addDoc(collections.blogPosts, payload);
        setPosts([{ id: docRef.id, ...payload }, ...posts]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving blog post:", error);
      alert("Failed to save post. Check console and Storage rules.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteDoc(doc(db, "blogPosts", id));
      setPosts(prev => prev.filter(post => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const generateSlug = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    });
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontFamily: "var(--font-poppins)" }}>Blog CMS</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#f8fafc", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <Search size={18} color="#64748b" style={{ marginRight: "0.5rem" }} />
            <input 
              type="text" 
              placeholder="Search posts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input"
              style={{ padding: "0.25rem 0.5rem", border: "none", background: "transparent" }}
            />
          </div>
          <button onClick={() => handleOpenModal()} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--color-primary)", color: "white", border: "none", padding: "0.5rem 1.2rem", borderRadius: "8px", cursor: "pointer", fontWeight: 500 }}>
            <Plus size={18} /> New Post
          </button>
        </div>
      </div>

      <Card className="glass-card" style={{ padding: "1.5rem" }}>
        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{post.title}</div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b" }}>/{post.slug}</div>
                    </td>
                    <td style={{ padding: "1rem 0" }}>
                      <span style={{ 
                        display: "inline-flex", alignItems: "center", gap: "0.25rem",
                        padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 500,
                        background: post.published ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.1)",
                        color: post.published ? "#10b981" : "#94a3b8"
                      }}>
                        {post.published ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                      {post.createdAt ? new Date((post.createdAt as any).seconds * 1000).toLocaleString() : ""}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button onClick={() => handleOpenModal(post)} style={{ background: "transparent", border: "none", color: "#2D9CDB", cursor: "pointer", marginRight: "1rem" }} title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(post.id!)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPosts.length === 0 && (
              <p style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>No blog posts found.</p>
            )}
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: "800px" }}>
            <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            <h2 style={{ fontFamily: "var(--font-poppins)", marginBottom: "1.5rem", fontSize: "1.5rem" }}>{editingId ? "Edit Post" : "Create New Post"}</h2>
            
            <form onSubmit={handleSave} style={{ display: "grid", gap: "1.2rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Title *</label>
                  <input required value={formData.title} onChange={e => generateSlug(e.target.value)} className="admin-input" />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>URL Slug *</label>
                  <input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="admin-input" />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Excerpt (Short description) *</label>
                <textarea required rows={2} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="admin-input" style={{ resize: "vertical" }} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Content (Markdown Supported) *</label>
                <textarea required rows={10} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="admin-input" style={{ resize: "vertical", fontFamily: "monospace" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Tags (Comma separated)</label>
                  <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="printing, signage, tips" className="admin-input" />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Cover Image {editingId ? "(leave empty to keep current)" : ""}</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} style={{ color: "#94a3b8" }} />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem", padding: "1rem", background: "#f8fafc", borderRadius: "8px" }}>
                <input type="checkbox" id="published" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} style={{ width: "18px", height: "18px" }} />
                <label htmlFor="published" style={{ color: "white", fontWeight: 500 }}>Publish immediately</label>
              </div>

              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "0.75rem 1.5rem", background: "transparent", color: "#64748b", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={uploading} style={{ padding: "0.75rem 1.5rem", background: "var(--color-primary)", color: "white", border: "none", borderRadius: "8px", cursor: uploading ? "not-allowed" : "pointer", fontWeight: 600 }}>
                  {uploading ? "Saving..." : "Save Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
