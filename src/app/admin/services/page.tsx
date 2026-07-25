"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { collections, db } from "@/lib/firebase";
import { getDocs, query, orderBy, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import type { ServiceDocument, ServiceFeature, ServiceSpec } from "@/lib/schema";
import { Search, Plus, Edit2, Trash2, LayoutGrid, PlusCircle, Minus } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Icon suggestions for the feature tiles
const FEATURE_ICON_OPTIONS = [
  "Sun","Moon","Shield","Leaf","Settings","Clock","Star","Home",
  "Wind","Zap","Eye","Layers","Maximize2","ThumbsUp","Volume2","VolumeX",
  "Wifi","Ruler","HardHat","Palette","CheckCircle2","ArrowRight",
];

const emptyFeature = (): ServiceFeature => ({ iconName: "Sun", label: "", value: "" });
const emptySpec = (): ServiceSpec => ({ label: "", value: "" });

export default function ServicesAdminPage() {
  const [services, setServices] = useState<ServiceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<ServiceDocument>>({
    title: "", desc: "", tagline: "", longContent: "", imageUrl: "",
    iconName: "LayoutGrid", color: "#2D9CDB", order: 0,
    importantWords: [], benefits: [], features: [], specs: [], fabrics: [],
  });
  const [importantWordsInput, setImportantWordsInput] = useState("");
  const [benefitsInput, setBenefitsInput] = useState("");
  const [fabricsInput, setFabricsInput] = useState("");
  const [features, setFeatures] = useState<ServiceFeature[]>([emptyFeature(), emptyFeature(), emptyFeature(), emptyFeature()]);
  const [specs, setSpecs] = useState<ServiceSpec[]>([emptySpec(), emptySpec(), emptySpec(), emptySpec()]);

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    setLoading(true);
    const q = query(collections.services, orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    setServices(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as ServiceDocument[]);
    setLoading(false);
  };

  const handleOpenModal = (service?: ServiceDocument) => {
    if (service) {
      setEditingId(service.id!);
      setFormData(service);
      setImportantWordsInput((service.importantWords || []).join(", "));
      setBenefitsInput((service.benefits || []).join("\n"));
      setFabricsInput((service.fabrics || []).join(", "));
      setFeatures(service.features?.length ? service.features : [emptyFeature(), emptyFeature(), emptyFeature(), emptyFeature()]);
      setSpecs(service.specs?.length ? service.specs : [emptySpec(), emptySpec(), emptySpec(), emptySpec()]);
    } else {
      setEditingId(null);
      setFormData({ title: "", desc: "", tagline: "", longContent: "", imageUrl: "", iconName: "LayoutGrid", color: "#2D9CDB", order: services.length, importantWords: [], benefits: [], features: [], specs: [], fabrics: [] });
      setImportantWordsInput("");
      setBenefitsInput("");
      setFabricsInput("");
      setFeatures([emptyFeature(), emptyFeature(), emptyFeature(), emptyFeature()]);
      setSpecs([emptySpec(), emptySpec(), emptySpec(), emptySpec()]);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: ServiceDocument = {
        ...formData as ServiceDocument,
        importantWords: importantWordsInput.split(",").map(w => w.trim()).filter(Boolean),
        benefits: benefitsInput.split("\n").map(b => b.trim()).filter(Boolean),
        fabrics: fabricsInput.split(",").map(f => f.trim()).filter(Boolean),
        features: features.filter(f => f.label && f.value),
        specs: specs.filter(s => s.label && s.value),
        createdAt: editingId ? formData.createdAt : new Date(),
      };

      if (editingId) {
        await updateDoc(doc(db, "services", editingId), payload as any);
        setServices(prev => prev.map(s => s.id === editingId ? { id: editingId, ...payload } : s).sort((a, b) => (a.order || 0) - (b.order || 0)));
      } else {
        const docRef = await addDoc(collections.services, payload);
        setServices([...services, { id: docRef.id, ...payload }].sort((a, b) => (a.order || 0) - (b.order || 0)));
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

  const filteredServices = services.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateFeature = (i: number, key: keyof ServiceFeature, val: string) => {
    setFeatures(prev => prev.map((f, idx) => idx === i ? { ...f, [key]: val } : f));
  };
  const updateSpec = (i: number, key: keyof ServiceSpec, val: string) => {
    setSpecs(prev => prev.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  };
  const addFeature = () => setFeatures(prev => [...prev, emptyFeature()]);
  const removeFeature = (i: number) => setFeatures(prev => prev.filter((_, idx) => idx !== i));
  const addSpec = () => setSpecs(prev => [...prev, emptySpec()]);
  const removeSpec = (i: number) => setSpecs(prev => prev.filter((_, idx) => idx !== i));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontFamily: "var(--font-poppins)", margin: 0 }}>Services CMS</h1>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#f8fafc", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <Search size={18} color="#64748b" style={{ marginRight: "0.5rem" }} />
            <input type="text" placeholder="Search services..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="admin-input" style={{ padding: "0.25rem 0.5rem", border: "none", background: "transparent", width: "200px" }} />
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
                  <th>Image</th>
                  <th>Order</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => {
                  const Icon = (LucideIcons[service.iconName as keyof typeof LucideIcons] as any) || LucideIcons.LayoutGrid;
                  return (
                    <tr key={service.id}>
                      <td>
                        <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: `${service.color}15`, color: service.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={20} />
                        </div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{service.title}</td>
                      <td style={{ color: "#94a3b8", fontSize: "0.9rem", maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{service.desc}</td>
                      <td style={{ fontSize: "0.8rem", color: service.imageUrl ? "#10b981" : "#94a3b8" }}>
                        {service.imageUrl ? "✓ Custom" : "Default"}
                      </td>
                      <td>{service.order}</td>
                      <td style={{ textAlign: "right" }}>
                        <button onClick={() => handleOpenModal(service)} style={{ background: "transparent", border: "none", color: "#2D9CDB", cursor: "pointer", marginRight: "1rem" }} title="Edit"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(service.id!)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }} title="Delete"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredServices.length === 0 && <p style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>No services found.</p>}
          </div>
        )}
      </Card>

      {/* ── Add/Edit Modal ── */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: "720px", maxHeight: "90vh", overflowY: "auto" }}>
            <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            <h2 style={{ fontFamily: "var(--font-poppins)", marginBottom: "0.5rem", fontSize: "1.4rem" }}>{editingId ? "Edit Service" : "Add Service"}</h2>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.5rem" }}>All fields here are reflected in real-time on the public Services page popup.</p>

            <form onSubmit={handleSave} style={{ display: "grid", gap: "1.5rem" }}>

              {/* ── Section 1: Basic Info ── */}
              <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1.25rem", margin: 0 }}>
                <legend style={{ padding: "0 0.5rem", fontWeight: 700, fontSize: "0.85rem", color: "#475569" }}>📋 Basic Information</legend>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Title *</label>
                    <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="admin-input" placeholder="e.g. Roller Blinds" />
                  </div>
                  <div>
                    <label style={labelStyle}>Display Order</label>
                    <input type="number" required value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="admin-input" />
                  </div>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>Short Description * (shown on card)</label>
                  <textarea required rows={2} value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="admin-input" style={{ resize: "vertical" }} placeholder="e.g. Sleek and modern roller blinds designed to provide optimal light control and privacy." />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>Tagline (italic subtitle in popup header)</label>
                  <input value={formData.tagline || ""} onChange={e => setFormData({ ...formData, tagline: e.target.value })} className="admin-input" placeholder="e.g. Sleek, versatile and built for modern Australian homes." />
                </div>
                <div>
                  <label style={labelStyle}>Extended Description (popup body text)</label>
                  <textarea rows={3} value={formData.longContent || ""} onChange={e => setFormData({ ...formData, longContent: e.target.value })} className="admin-input" style={{ resize: "vertical" }} placeholder="Additional details about this product..." />
                </div>
              </fieldset>

              {/* ── Section 2: Image & Style ── */}
              <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1.25rem", margin: 0 }}>
                <legend style={{ padding: "0 0.5rem", fontWeight: 700, fontSize: "0.85rem", color: "#475569" }}>🖼️ Image & Style</legend>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>Image URL (paste direct image link)</label>
                  <input value={formData.imageUrl || ""} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} className="admin-input" placeholder="https://example.com/image.jpg" />
                  {formData.imageUrl && (
                    <div style={{ marginTop: "0.75rem", borderRadius: "8px", overflow: "hidden", height: "120px", position: "relative", background: "#f1f5f9" }}>
                      <img src={formData.imageUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  )}
                  <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.25rem" }}>Leave blank to use the built-in default image for this service.</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Lucide Icon Name *</label>
                    <input required value={formData.iconName} onChange={e => setFormData({ ...formData, iconName: e.target.value })} placeholder="e.g. Sun, Shield, Layers" className="admin-input" />
                  </div>
                  <div>
                    <label style={labelStyle}>Brand Colour *</label>
                    <input required type="color" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} style={{ width: "100%", height: "42px", padding: "0.25rem", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer" }} />
                  </div>
                </div>
              </fieldset>

              {/* ── Section 3: Features (4 tiles) ── */}
              <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1.25rem", margin: 0 }}>
                <legend style={{ padding: "0 0.5rem", fontWeight: 700, fontSize: "0.85rem", color: "#475569" }}>⚡ Feature Tiles (popup grid)</legend>
                <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "1rem" }}>Icon suggestions: {FEATURE_ICON_OPTIONS.join(", ")}</p>
                {features.map((f, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr auto", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                    <input value={f.iconName} onChange={e => updateFeature(i, "iconName", e.target.value)} placeholder="Icon" className="admin-input" style={{ fontSize: "0.85rem" }} />
                    <input value={f.label} onChange={e => updateFeature(i, "label", e.target.value)} placeholder="Label (e.g. Privacy)" className="admin-input" style={{ fontSize: "0.85rem" }} />
                    <input value={f.value} onChange={e => updateFeature(i, "value", e.target.value)} placeholder="Value (e.g. High)" className="admin-input" style={{ fontSize: "0.85rem" }} />
                    <button type="button" onClick={() => removeFeature(i)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.25rem" }}><Minus size={16} /></button>
                  </div>
                ))}
                <button type="button" onClick={addFeature} style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "transparent", border: "1px dashed #cbd5e1", color: "#64748b", borderRadius: "6px", padding: "0.4rem 0.75rem", cursor: "pointer", fontSize: "0.82rem", marginTop: "0.5rem" }}>
                  <PlusCircle size={14} /> Add Feature Tile
                </button>
              </fieldset>

              {/* ── Section 4: Benefits ── */}
              <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1.25rem", margin: 0 }}>
                <legend style={{ padding: "0 0.5rem", fontWeight: 700, fontSize: "0.85rem", color: "#475569" }}>✅ Benefits (Why Choose — one per line)</legend>
                <textarea rows={6} value={benefitsInput} onChange={e => setBenefitsInput(e.target.value)} placeholder={"Precise light control with smooth rolling mechanism\nAvailable in blockout, sunscreen & sheer fabrics\nChild-safe chain options available"} className="admin-input" style={{ resize: "vertical" }} />
              </fieldset>

              {/* ── Section 5: Specs ── */}
              <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1.25rem", margin: 0 }}>
                <legend style={{ padding: "0 0.5rem", fontWeight: 700, fontSize: "0.85rem", color: "#475569" }}>📐 Product Specifications</legend>
                {specs.map((s, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                    <input value={s.label} onChange={e => updateSpec(i, "label", e.target.value)} placeholder="Label (e.g. Max Width)" className="admin-input" style={{ fontSize: "0.85rem" }} />
                    <input value={s.value} onChange={e => updateSpec(i, "value", e.target.value)} placeholder="Value (e.g. Up to 3.5m)" className="admin-input" style={{ fontSize: "0.85rem" }} />
                    <button type="button" onClick={() => removeSpec(i)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.25rem" }}><Minus size={16} /></button>
                  </div>
                ))}
                <button type="button" onClick={addSpec} style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "transparent", border: "1px dashed #cbd5e1", color: "#64748b", borderRadius: "6px", padding: "0.4rem 0.75rem", cursor: "pointer", fontSize: "0.82rem", marginTop: "0.5rem" }}>
                  <PlusCircle size={14} /> Add Spec Row
                </button>
              </fieldset>

              {/* ── Section 6: Fabrics & Highlights ── */}
              <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1.25rem", margin: 0 }}>
                <legend style={{ padding: "0 0.5rem", fontWeight: 700, fontSize: "0.85rem", color: "#475569" }}>🎨 Fabrics & Finishes (comma separated)</legend>
                <input value={fabricsInput} onChange={e => setFabricsInput(e.target.value)} placeholder="Sunscreen 5%, Sunscreen 10%, Sheer, Translucent, Blockout" className="admin-input" />
                <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.25rem" }}>Each item becomes a chip in the popup.</p>

                <div style={{ marginTop: "1rem" }}>
                  <label style={labelStyle}>Highlighted Words in Description (comma separated)</label>
                  <input value={importantWordsInput} onChange={e => setImportantWordsInput(e.target.value)} placeholder="e.g. privacy, light control, premium" className="admin-input" />
                  <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.25rem" }}>These words are bolded/highlighted on the card description.</p>
                </div>
              </fieldset>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "0.75rem 1.5rem", background: "transparent", color: "#64748b", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: "0.75rem 1.75rem", background: "var(--color-primary)", color: "white", border: "none", borderRadius: "8px", cursor: saving ? "not-allowed" : "pointer", fontWeight: 600, fontSize: "1rem" }}>
                  {saving ? "Saving..." : "💾 Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.4rem",
  color: "#1e293b",
  fontSize: "0.85rem",
  fontWeight: 500,
};
