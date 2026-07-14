"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { collections, db } from "@/lib/firebase";
import { getDocs, query, orderBy, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import type { UserDocument } from "@/lib/schema";
import { Search, Shield, User, Trash2, Plus, X } from "lucide-react";

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newUser, setNewUser] = useState({ displayName: "", email: "", role: "user" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const q = query(collections.users, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(data);
    setLoading(false);
  };

  const toggleRole = async (user: UserDocument) => {
    if (!user.id) return;
    const newRole = user.role === "admin" ? "user" : "admin";
    
    if (newRole === "admin") {
      if (!confirm(`Are you sure you want to promote ${user.email} to Admin?`)) return;
    } else {
      if (!confirm(`Are you sure you want to revoke Admin rights from ${user.email}?`)) return;
    }

    try {
      await updateDoc(doc(db, "users", user.id), { role: newRole });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role.");
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user record from the database? (Note: This does not delete their Firebase Auth account)")) return;
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email) return;
    setSaving(true);
    try {
      // Use email as a deterministic document ID for simplicity, or just let Firebase generate one
      // We will let Firebase generate an ID to avoid conflicts if they somehow create it twice
      const docRef = await addDoc(collections.users, {
        ...newUser,
        createdAt: new Date(),
      } as any);
      
      setUsers([{ id: docRef.id, ...newUser, createdAt: new Date() } as any, ...users]);
      setIsModalOpen(false);
      setNewUser({ displayName: "", email: "", role: "user" });
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontFamily: "var(--font-poppins)", margin: 0 }}>Users & Roles</h1>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#f8fafc", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <Search size={18} color="#64748b" style={{ marginRight: "0.5rem" }} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input"
              style={{ padding: "0.25rem 0.5rem", border: "none", background: "transparent", width: "200px" }}
            />
          </div>
          <button onClick={() => setIsModalOpen(true)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--color-primary)", color: "white", border: "none", padding: "0.75rem 1.2rem", borderRadius: "8px", cursor: "pointer", fontWeight: 500, height: "42px" }}>
            <Plus size={18} /> Add User
          </button>
        </div>
      </div>

      <Card className="glass-card">
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 600 }}>
                          {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{user.displayName || "No Name"}</div>
                          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 0" }}>
                      <span style={{ 
                        display: "inline-flex", alignItems: "center", gap: "0.3rem",
                        padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600,
                        background: user.role === "admin" ? "rgba(194, 24, 139, 0.15)" : "rgba(255, 255, 255, 0.1)",
                        color: user.role === "admin" ? "#C2188B" : "#94a3b8"
                      }}>
                        {user.role === "admin" ? <Shield size={12} /> : <User size={12} />}
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                      {user.createdAt ? new Date((user.createdAt as any).seconds * 1000).toLocaleString() : ""}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button 
                        onClick={() => toggleRole(user)} 
                        style={{ background: "transparent", border: "1px solid #cbd5e1", color: "white", padding: "0.4rem 0.8rem", borderRadius: "4px", cursor: "pointer", marginRight: "1rem", fontSize: "0.8rem" }}
                      >
                        Make {user.role === "admin" ? "User" : "Admin"}
                      </button>
                      <button onClick={() => deleteUser(user.id!)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }} title="Delete Record">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <p style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>No users found.</p>
            )}
          </div>
        )}
      </Card>

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
            <h2 style={{ fontFamily: "var(--font-poppins)", marginBottom: "1.5rem" }}>Add New User</h2>
            <form onSubmit={handleAddUser} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--muted-light)", fontSize: "0.9rem" }}>Name</label>
                <input 
                  type="text"
                  required
                  className="admin-input"
                  value={newUser.displayName}
                  onChange={e => setNewUser({...newUser, displayName: e.target.value})}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--muted-light)", fontSize: "0.9rem" }}>Email Address</label>
                <input 
                  type="email"
                  required
                  className="admin-input"
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  placeholder="e.g. admin@capitalprint.com"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--muted-light)", fontSize: "0.9rem" }}>Assign Role</label>
                <select 
                  className="admin-input"
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                  style={{ background: "#0f172a" }}
                >
                  <option value="user">Standard User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: "transparent", color: "#64748b", border: "1px solid #cbd5e1", padding: "0.75rem 1.5rem", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ background: "var(--color-primary)", color: "white", border: "none", padding: "0.75rem 1.5rem", borderRadius: "8px", cursor: saving ? "not-allowed" : "pointer", fontWeight: 600 }}>
                  {saving ? "Saving..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
