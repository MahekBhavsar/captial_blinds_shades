"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { collections } from "@/lib/firebase";
import { getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import type { TestimonialDocument } from "@/lib/schema";
import { Search, Trash2, Star } from "lucide-react";
import { db } from "@/lib/firebase";

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<TestimonialDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const q = query(collections.testimonials, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeedbacks(data as any);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (id: string) => {
    if (!id || !confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await deleteDoc(doc(db, "testimonials", id));
      setFeedbacks(prev => prev.filter(f => f.id !== id));
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  const filteredFeedbacks = feedbacks.filter(f =>
    f.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", background: "#f8fafc", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <Search size={18} color="#64748b" style={{ marginRight: "0.5rem" }} />
          <input
            type="text"
            placeholder="Search feedbacks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input"
            style={{ padding: "0.25rem 0.5rem", border: "none", background: "transparent", width: "200px" }}
          />
        </div>
      </div>

      <Card className="glass-card" style={{ padding: "1.5rem" }}>
        {loading ? (
          <p>Loading feedbacks...</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Rating</th>
                  <th>Feedback</th>
                  <th>Date & Time</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.map((f) => (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 500 }}>
                      {f.clientName}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            fill={i < f.rating ? "#E6A623" : "transparent"} 
                            color={i < f.rating ? "#E6A623" : "#cbd5e1"} 
                          />
                        ))}
                      </div>
                    </td>
                    <td style={{ fontSize: "0.9rem", maxWidth: "400px", whiteSpace: "normal" }}>
                      "{f.content}"
                    </td>
                    <td style={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}>
                      {f.createdAt ? new Date((f.createdAt as any).seconds * 1000).toLocaleString('en-AU', { 
                        timeZone: 'Australia/Sydney',
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : ""}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button 
                        onClick={() => deleteFeedback(f.id!)} 
                        style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.5rem" }} 
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredFeedbacks.length === 0 && (
              <p style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>No feedbacks found.</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
