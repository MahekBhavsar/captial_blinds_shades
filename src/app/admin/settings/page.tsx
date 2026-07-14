"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import type { SettingsDocument } from "@/lib/schema";
import { Save, Store, Link as LinkIcon, Bell, Loader2 } from "lucide-react";

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<SettingsDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, "settings", "general");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setSettings({ id: docSnap.id, ...docSnap.data() } as SettingsDocument);
      } else {
        // Default settings if document doesn't exist yet
        setSettings({
          companyName: "Capital Print & Sign",
          phone: "0481 369 018",
          email: "sales@capitalprintandsign.com.au",
          address: "21 Huddart Court, Mitchell ACT 2911",
          whatsapp: "61481369018",
          facebookUrl: "",
          instagramUrl: "",
          linkedinUrl: "",
          notificationEmail: "sales@capitalprintandsign.com.au",
          maintenanceMode: false
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      const docRef = doc(db, "settings", "general");
      const payload = { ...settings, updatedAt: new Date() };
      delete payload.id; // Don't write the local ID field to the document
      
      await setDoc(docRef, payload, { merge: true });
      setMessage({ text: "Settings saved successfully!", type: 'success' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({ text: "Failed to save settings. Please try again.", type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (settings) {
      setSettings({
        ...settings,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  if (loading) {
    return <div style={{ padding: "2rem", color: "#94a3b8" }}>Loading settings...</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontFamily: "var(--font-poppins)" }}>System Settings</h1>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: "grid", gap: "2rem" }}>
          
          {/* General Business Info */}
          <Card className="glass-card" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "rgba(45, 156, 219, 0.1)", color: "#2D9CDB", padding: "0.5rem", borderRadius: "8px" }}><Store size={20} /></div>
              <h2 style={{ fontSize: "1.2rem", fontFamily: "var(--font-poppins)" }}>Business Information</h2>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Company Name</label>
                <input required name="companyName" value={settings?.companyName || ""} onChange={handleChange} className="admin-input" />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Primary Email</label>
                <input required type="email" name="email" value={settings?.email || ""} onChange={handleChange} className="admin-input" />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Phone Number</label>
                <input required name="phone" value={settings?.phone || ""} onChange={handleChange} className="admin-input" />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>WhatsApp Number (for wa.me links)</label>
                <input required name="whatsapp" value={settings?.whatsapp || ""} onChange={handleChange} className="admin-input" />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Physical Address</label>
                <input required name="address" value={settings?.address || ""} onChange={handleChange} className="admin-input" />
              </div>
            </div>
          </Card>

          {/* Social Links */}
          <Card className="glass-card" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "rgba(194, 24, 139, 0.1)", color: "#C2188B", padding: "0.5rem", borderRadius: "8px" }}><LinkIcon size={20} /></div>
              <h2 style={{ fontSize: "1.2rem", fontFamily: "var(--font-poppins)" }}>Social Media Links</h2>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Facebook URL</label>
                <input name="facebookUrl" value={settings?.facebookUrl || ""} onChange={handleChange} placeholder="https://facebook.com/..." className="admin-input" />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Instagram URL</label>
                <input name="instagramUrl" value={settings?.instagramUrl || ""} onChange={handleChange} placeholder="https://instagram.com/..." className="admin-input" />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>LinkedIn URL</label>
                <input name="linkedinUrl" value={settings?.linkedinUrl || ""} onChange={handleChange} placeholder="https://linkedin.com/..." className="admin-input" />
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="glass-card" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "0.5rem", borderRadius: "8px" }}><Bell size={20} /></div>
              <h2 style={{ fontSize: "1.2rem", fontFamily: "var(--font-poppins)" }}>Preferences & Notifications</h2>
            </div>
            
            <div style={{ display: "grid", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.9rem" }}>Admin Notification Email (For new quotes)</label>
                <input type="email" name="notificationEmail" value={settings?.notificationEmail || ""} onChange={handleChange} className="admin-input" />
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", maxWidth: "400px" }}>
                <input type="checkbox" name="maintenanceMode" id="maintenanceMode" checked={settings?.maintenanceMode || false} onChange={handleChange} style={{ width: "18px", height: "18px" }} />
                <label htmlFor="maintenanceMode" style={{ color: "#1e293b", cursor: "pointer", fontWeight: 500 }}>Enable Maintenance Mode</label>
              </div>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "-1rem" }}>When enabled, the frontend will display a "Coming Soon" screen to regular visitors.</p>
            </div>
          </Card>

        </div>

        {/* Floating Save Bar */}
        <div style={{ position: "sticky", bottom: "2rem", marginTop: "2rem", padding: "1.5rem", background: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(10px)", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", zIndex: 100 }}>
          <div>
            {message && (
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: message.type === 'success' ? "#10b981" : "#ef4444", fontWeight: 500 }}>
                {message.text}
              </span>
            )}
          </div>
          <button type="submit" disabled={saving} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--color-primary)", color: "white", border: "none", padding: "0.75rem 2rem", borderRadius: "8px", cursor: saving ? "not-allowed" : "pointer", fontWeight: 600, fontSize: "1rem", opacity: saving ? 0.7 : 1 }}>
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
