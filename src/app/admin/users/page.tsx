"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { collections, db } from "@/lib/firebase";
import { getDocs, query, orderBy, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import type { UserDocument } from "@/lib/schema";
import { Search, Shield, User, Trash2, Plus, X, Calendar } from "lucide-react";

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  
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
    setUsers(data as UserDocument[]);
    setLoading(false);
  };

  const updateProcessStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "users", id), { processStatus: newStatus });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, processStatus: newStatus as any } : u));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesDate = true;
    if (searchDate && user.createdAt) {
      // Firebase timestamp format to YYYY-MM-DD
      const userDate = new Date((user.createdAt as any).seconds * 1000).toISOString().split('T')[0];
      matchesDate = userDate === searchDate;
    }

    return matchesSearch && matchesDate;
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email) return;
    setSaving(true);
    try {
      const docRef = await addDoc(collections.users, {
        ...newUser,
        createdAt: new Date(),
        processStatus: "Pending",
      } as any);
      
      setUsers([{ id: docRef.id, ...newUser, processStatus: "Pending", createdAt: new Date() } as any, ...users]);
      setIsModalOpen(false);
      setNewUser({ displayName: "", email: "", role: "user" });
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user.");
    } finally {
      setSaving(false);
    }
  };

  // Stats
  const pendingLeads = users.filter(u => u.role === "lead" && (u.processStatus === "Pending" || !u.processStatus)).length;
  const completedLeads = users.filter(u => u.role === "lead" && u.processStatus === "Completed").length;
  const rejectedLeads = users.filter(u => u.role === "lead" && u.processStatus === "Rejected").length;

  return (
    <div>
      {/* SUMMARY BLOCKS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <Card style={{ padding: "1.5rem", background: "#fff", borderLeft: "4px solid #eab308" }}>
          <h3 style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}>Pending Leads</h3>
          <p style={{ margin: "0.5rem 0 0", fontSize: "1.8rem", fontWeight: 700, color: "#1e293b" }}>{pendingLeads}</p>
        </Card>
        <Card style={{ padding: "1.5rem", background: "#fff", borderLeft: "4px solid #10b981" }}>
          <h3 style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}>Completed Requests</h3>
          <p style={{ margin: "0.5rem 0 0", fontSize: "1.8rem", fontWeight: 700, color: "#1e293b" }}>{completedLeads}</p>
        </Card>
        <Card style={{ padding: "1.5rem", background: "#fff", borderLeft: "4px solid #ef4444" }}>
          <h3 style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}>Rejected Requests</h3>
          <p style={{ margin: "0.5rem 0 0", fontSize: "1.8rem", fontWeight: 700, color: "#1e293b" }}>{rejectedLeads}</p>
        </Card>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          
          <div style={{ display: "flex", alignItems: "center", background: "#f8fafc", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <Search size={18} color="#64748b" style={{ marginRight: "0.5rem" }} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input"
              style={{ padding: "0.25rem 0.5rem", border: "none", background: "transparent", width: "150px" }}
            />
          </div>
          
          <div style={{ display: "flex", alignItems: "center", background: "#f8fafc", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <Calendar size={18} color="#64748b" style={{ marginRight: "0.5rem" }} />
            <input 
              type="date" 
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="admin-input"
              style={{ padding: "0.25rem 0.5rem", border: "none", background: "transparent", color: "#64748b" }}
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
          <div className="admin-table-container" style={{ overflowX: "auto" }}>
            <table className="admin-table" style={{ minWidth: "900px" }}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Company</th>
                  <th>Service</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Process</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 600 }}>
                          {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{user.displayName || "No Name"}</div>
                          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "#475569", fontSize: "0.9rem" }}>
                      {user.companyName || "N/A"}
                    </td>
                    <td style={{ color: "#475569", fontSize: "0.9rem", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={user.serviceRequested ? user.serviceRequested.join(", ") : ""}>
                      {user.serviceRequested && user.serviceRequested.length > 0 ? user.serviceRequested.join(", ") : "-"}
                    </td>
                    <td style={{ padding: "1rem 0" }}>
                      <span style={{ 
                        display: "inline-flex", alignItems: "center", gap: "0.3rem",
                        padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600,
                        background: user.role === "admin" ? "rgba(194, 24, 139, 0.15)" : user.role === "lead" ? "rgba(234, 179, 8, 0.15)" : "rgba(255, 255, 255, 0.1)",
                        color: user.role === "admin" ? "#C2188B" : user.role === "lead" ? "#eab308" : "#94a3b8"
                      }}>
                        {user.role === "admin" ? <Shield size={12} /> : <User size={12} />}
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                      {user.phone || "-"}
                    </td>
                    <td style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                      {user.createdAt ? new Date((user.createdAt as any).seconds * 1000).toLocaleString() : ""}
                    </td>
                    <td>
                      {user.role === "lead" ? (
                        <select 
                          value={user.processStatus || "Pending"}
                          onChange={(e) => updateProcessStatus(user.id!, e.target.value)}
                          style={{
                            padding: "0.4rem", borderRadius: "4px", border: "1px solid #cbd5e1", 
                            background: user.processStatus === "Completed" ? "#dcfce7" : user.processStatus === "Rejected" ? "#fee2e2" : "#fef9c3",
                            color: user.processStatus === "Completed" ? "#166534" : user.processStatus === "Rejected" ? "#991b1b" : "#854d0e",
                            fontWeight: 500, fontSize: "0.8rem", cursor: "pointer", outline: "none"
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      ) : "-"}
                    </td>
                    <td style={{ textAlign: "right" }}>
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
                  style={{ background: "#ffffff", color: "#111827" }}
                >
                  <option value="user">Standard User</option>
                  <option value="admin">Administrator</option>
                  <option value="lead">Lead/Client</option>
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
