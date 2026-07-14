"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { collections, db } from "@/lib/firebase";
import { getDocs, query, orderBy, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import type { ServiceDocument } from "@/lib/schema";
import { Search, Plus, Edit2, Trash2, LayoutGrid } from "lucide-react";
import * as LucideIcons from "lucide-react";

export default function ServicesAdminPage() {
  const [services, setServices] = useState<ServiceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ServiceDocument>>({
    title: "",
    desc: "",
    longContent: "",
    iconName: "LayoutGrid",
    color: "#2D9CDB",
    order: 0,
    importantWords: [],
  });
  const [importantWordsInput, setImportantWordsInput] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const q = query(collections.services, orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setServices(data);
    setLoading(false);
  };

  const handleOpenModal = (service?: ServiceDocument) => {
    if (service) {
      setEditingId(service.id!);
      setFormData(service);
      setImportantWordsInput((service.importantWords || []).join(", "));
    } else {
      setEditingId(null);
      setFormData({
        title: "", desc: "", longContent: "", iconName: "LayoutGrid", color: "#2D9CDB", order: services.length, importantWords: []
      });
      setImportantWordsInput("");
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        importantWords: importantWordsInput.split(",").map(w => w.trim()).filter(Boolean),
        createdAt: editingId ? formData.createdAt : new Date(),
      } as ServiceDocument;

      if (editingId) {
        await updateDoc(doc(db, "services", editingId), payload as any);
        setServices(prev => prev.map(s => s.id === editingId ? { id: editingId, ...payload } : s).sort((a,b) => (a.order || 0) - (b.order || 0)));
      } else {
        const docRef = await addDoc(collections.services, payload);
        setServices([...services, { id: docRef.id, ...payload }].sort((a,b) => (a.order || 0) - (b.order || 0)));
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteDoc(doc(db, "services", id));
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontFamily: "var(--font-poppins)", margin: 0 }}>Services CMS</h1>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#f8fafc", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <Search size={18} color="#64748b" style={{ marginRight: "0.5rem" }} />
            <input 
              type="text" 
              placeholder="Search services..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input"
              style={{ padding: "0.25rem 0.5rem", border: "none", background: "transparent", width: "200px" }}
            />
          </div>
          <button onClick={() => handleOpenModal()} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--color-primary)", color: "white", border: "none", padding: "0.75rem 1.2rem", borderRadius: "8px", cursor: "pointer", fontWeight: 500, height: "42px" }}>
            <Plus size={18} /> Add Service
          </button>
        </div>
      </div>

      <Card className="glass-card">
        {loading ? (
          <p style={{ padding: "1.5rem" }}>Loading services...</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>Icon</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Order</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => {
                  // Fallback icon to layout grid if invalid name is provided
                  const Icon = (LucideIcons[service.iconName as keyof typeof LucideIcons] as React.ElementType) || LucideIcons.LayoutGrid;
                  
                  return (
                    <tr key={service.id}>
                      <td>
                        <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: `${service.color}15`, color: service.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={20} />
                        </div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{service.title}</td>
                      <td style={{ color: "#94a3b8", fontSize: "0.9rem", maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {service.desc}
                      </td>
                      <td>{service.order}</td>
                      <td style={{ textAlign: "right" }}>
                        <button onClick={() => handleOpenModal(service)} style={{ background: "transparent", border: "none", color: "#2D9CDB", cursor: "pointer", marginRight: "1rem" }} title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(service.id!)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }} title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredServices.length === 0 && (
              <p style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>No services found.</p>
            )}
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            <h2 style={{ fontFamily: "var(--font-poppins)", marginBottom: "1.5rem", fontSize: "1.5rem" }}>{editingId ? "Edit Service" : "Add Service"}</h2>
            
            <form onSubmit={handleSave} style={{ display: "grid", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Title *</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="admin-input" />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Order</label>
                  <input type="number" required value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="admin-input" />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Short Description *</label>
                <textarea required rows={2} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="admin-input" style={{ resize: "vertical" }} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Long Content (Optional, for popup)</label>
                <textarea rows={4} value={formData.longContent} onChange={e => setFormData({...formData, longContent: e.target.value})} className="admin-input" style={{ resize: "vertical" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Lucide Icon Name *</label>
                  <input required value={formData.iconName} onChange={e => setFormData({...formData, iconName: e.target.value})} placeholder="e.g. Printer, PenTool" className="admin-input" />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Brand Color (Hex) *</label>
                  <input required type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} style={{ width: "100%", height: "42px", padding: "0.25rem", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer" }} />
                </div>
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Important Words (Comma separated)</label>
                <input value={importantWordsInput} onChange={e => setImportantWordsInput(e.target.value)} placeholder="e.g. premium, fast, reliable" className="admin-input" />
                <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.25rem" }}>These words will be highlighted in the description.</p>
              </div>

              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "0.75rem 1.5rem", background: "transparent", color: "#64748b", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: "0.75rem 1.5rem", background: "var(--color-primary)", color: "white", border: "none", borderRadius: "8px", cursor: saving ? "not-allowed" : "pointer", fontWeight: 600 }}>
                  {saving ? "Saving..." : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
