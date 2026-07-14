"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { collections, db, storage } from "@/lib/firebase";
import { getDocs, query, orderBy, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { PortfolioDocument } from "@/lib/schema";
import { Search, Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";

export default function PortfolioAdminPage() {
  const [items, setItems] = useState<PortfolioDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PortfolioDocument>>({
    title: "",
    description: "",
    clientName: "",
    category: "Vehicle Wraps",
    featured: false,
    imageUrl: "",
    beforeImageUrl: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [beforeImageFile, setBeforeImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const q = query(collections.portfolio, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setItems(data);
    setLoading(false);
  };

  const handleOpenModal = (item?: PortfolioDocument) => {
    if (item) {
      setEditingId(item.id!);
      setFormData(item);
    } else {
      setEditingId(null);
      setFormData({
        title: "", description: "", clientName: "", category: "Vehicle Wraps", featured: false, imageUrl: "", beforeImageUrl: ""
      });
    }
    setImageFile(null);
    setBeforeImageFile(null);
    setIsModalOpen(true);
  };

  const handleUploadImage = async (file: File, path: string) => {
    const storageRef = ref(storage, `portfolio/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalImageUrl = formData.imageUrl;
      let finalBeforeImageUrl = formData.beforeImageUrl;

      if (imageFile) finalImageUrl = await handleUploadImage(imageFile, "main");
      if (beforeImageFile) finalBeforeImageUrl = await handleUploadImage(beforeImageFile, "before");

      const payload = {
        ...formData,
        imageUrl: finalImageUrl,
        beforeImageUrl: finalBeforeImageUrl,
        createdAt: editingId ? formData.createdAt : new Date(),
      } as PortfolioDocument;

      if (editingId) {
        await updateDoc(doc(db, "portfolio", editingId), payload);
        setItems(prev => prev.map(item => item.id === editingId ? { id: editingId, ...payload } : item));
      } else {
        const docRef = await addDoc(collections.portfolio, payload);
        setItems([{ id: docRef.id, ...payload }, ...items]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving portfolio item:", error);
      alert("Failed to save item. Check console and Storage rules.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteDoc(doc(db, "portfolio", id));
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
    }
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontFamily: "var(--font-poppins)" }}>Portfolio Management</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#f8fafc", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <Search size={18} color="#64748b" style={{ marginRight: "0.5rem" }} />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input"
              style={{ padding: "0.25rem 0.5rem", border: "none", background: "transparent" }}
            />
          </div>
          <button onClick={() => handleOpenModal()} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--color-primary)", color: "white", border: "none", padding: "0.5rem 1.2rem", borderRadius: "8px", cursor: "pointer", fontWeight: 500 }}>
            <Plus size={18} /> Add New Item
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {loading ? (
          <p>Loading portfolio...</p>
        ) : filteredItems.length === 0 ? (
          <p style={{ color: "#64748b", gridColumn: "1 / -1" }}>No portfolio items found.</p>
        ) : (
          filteredItems.map(item => (
            <Card key={item.id} className="glass-card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: "200px", background: "#f1f5f9", position: "relative" }}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: "#64748b" }}><ImageIcon size={48} /></div>
                )}
                {item.featured && (
                  <span style={{ position: "absolute", top: "1rem", right: "1rem", background: "var(--color-primary)", color: "white", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600 }}>Featured</span>
                )}
              </div>
              <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ color: "var(--color-primary)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem", textTransform: "uppercase" }}>{item.category}</div>
                <h3 style={{ fontSize: "1.2rem", fontFamily: "var(--font-poppins)", marginBottom: "0.5rem" }}>{item.title}</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ color: "#64748b", fontSize: "0.85rem" }}>{item.clientName || "Unknown Client"}</span>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => handleOpenModal(item)} style={{ background: "transparent", border: "none", color: "#2D9CDB", cursor: "pointer" }}><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(item.id!)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }}><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            <h2 style={{ fontFamily: "var(--font-poppins)", marginBottom: "1.5rem", fontSize: "1.5rem" }}>{editingId ? "Edit Item" : "Add Portfolio Item"}</h2>
            
            <form onSubmit={handleSave} style={{ display: "grid", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Title *</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="admin-input" />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Category *</label>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="admin-input" style={{ background: "rgba(15, 23, 42, 0.95)" }}>
                    <option value="Vehicle Wraps">Vehicle Wraps</option>
                    <option value="Shopfront Signs">Shopfront Signs</option>
                    <option value="Business Printing">Business Printing</option>
                    <option value="Corporate Branding">Corporate Branding</option>
                    <option value="Construction">Construction</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Client Name</label>
                <input value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="admin-input" />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Description *</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="admin-input" style={{ resize: "vertical" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Main Image {editingId ? "(leave empty to keep current)" : "*"}</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} required={!editingId} style={{ color: "#94a3b8" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Before Image (Optional)</label>
                  <input type="file" accept="image/*" onChange={e => setBeforeImageFile(e.target.files?.[0] || null)} style={{ color: "#94a3b8" }} />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} style={{ width: "18px", height: "18px" }} />
                <label htmlFor="featured" style={{ color: "#1e293b" }}>Featured Project (Shows on homepage)</label>
              </div>

              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "0.75rem 1.5rem", background: "transparent", color: "#64748b", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={uploading} style={{ padding: "0.75rem 1.5rem", background: "var(--color-primary)", color: "white", border: "none", borderRadius: "8px", cursor: uploading ? "not-allowed" : "pointer", fontWeight: 600 }}>
                  {uploading ? "Saving..." : "Save Portfolio Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
