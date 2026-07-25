"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { MessageSquare, Users, Eye, TrendingUp, Image as ImageIcon, FileText, Plus, ImagePlus, FileEdit, ArrowRight } from "lucide-react";
import { collections } from "@/lib/firebase";
import { getDocs, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import type { QuoteDocument } from "@/lib/schema";
import Link from "next/link";

const mockChartData = [
  { day: "Mon", count: 0 },
  { day: "Tue", count: 0 },
  { day: "Wed", count: 0 },
  { day: "Thu", count: 0 },
  { day: "Fri", count: 0 },
  { day: "Sat", count: 0 },
  { day: "Sun", count: 0 }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ quotes: 0, users: 0 });
  const [recentQuotes, setRecentQuotes] = useState<QuoteDocument[]>([]);
  const [chartData, setChartData] = useState<{day: string, count: number}[]>(mockChartData);
  const [loading, setLoading] = useState(true);
  
  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  useEffect(() => {
    // Fetch users count once
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collections.users);
      setStats(prev => ({ ...prev, users: usersSnapshot.size }));
    };
    fetchUsers();

    // Set up real-time listener for ALL quotes
    const qQuotes = query(collections.quotes, orderBy("createdAt", "desc"));
    
    const unsubscribeQuotes = onSnapshot(qQuotes, (snapshot) => {
      const allQuotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Top 5 for recent table
      setRecentQuotes(allQuotes.slice(0, 5));
      
      // Total count
      setStats(prev => ({ ...prev, quotes: allQuotes.length }));

      // Chart data (last 7 days)
      const last7Days: { dateObj: Date; day: string; count: number }[] = [];
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        last7Days.push({
          dateObj: d,
          day: dayNames[d.getDay()],
          count: 0
        });
      }

      allQuotes.forEach(q => {
        if (!q.createdAt) return;
        const qDate = new Date((q.createdAt as any).seconds * 1000);
        qDate.setHours(0, 0, 0, 0);
        const bucket = last7Days.find(b => b.dateObj.getTime() === qDate.getTime());
        if (bucket) {
          bucket.count++;
        }
      });

      setChartData(last7Days.map(b => ({ day: b.day, count: b.count })));
      setLoading(false);
    });

    return () => unsubscribeQuotes();
  }, []);

  const statCards = [
    { title: "Total Quotes", value: stats.quotes > 4 ? "5+" : stats.quotes.toString(), icon: <MessageSquare size={24} color="#2D9CDB" />, trend: "+12%", bg: "rgba(45, 156, 219, 0.1)" },
    { title: "Active Users", value: stats.users.toString(), icon: <Users size={24} color="#10b981" />, trend: "+15%", bg: "rgba(16, 185, 129, 0.1)" },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        {statCards.map((stat, idx) => (
          <Card key={idx} className="glass-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", border: "1px solid rgba(201, 168, 76, 0.15)", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(12, 27, 58, 0.6)", fontWeight: 600 }}>{stat.title}</span>
              <div style={{ padding: "0.6rem", background: stat.bg, borderRadius: "10px" }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
              <span style={{ fontSize: "2.2rem", fontWeight: 700, fontFamily: "var(--font-poppins)", color: "var(--nb-navy)" }}>{stat.value}</span>
              <span style={{ color: "#10b981", fontWeight: 600, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.2rem", background: "rgba(16,185,129,0.1)", padding: "0.2rem 0.5rem", borderRadius: "20px" }}>
                <TrendingUp size={14} /> {stat.trend}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Custom CSS Bar Chart */}
        <Card className="glass-card" style={{ padding: "2rem", border: "1px solid rgba(201, 168, 76, 0.15)", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
            <h3 style={{ fontFamily: "var(--font-poppins)", fontSize: "1.2rem", color: "var(--nb-navy)", margin: 0 }}>Quote Activity (Last 7 Days)</h3>
            <span style={{ fontSize: "0.85rem", color: "#10b981", fontWeight: 600, background: "rgba(16, 185, 129, 0.1)", padding: "0.2rem 0.6rem", borderRadius: "10px" }}>Live Data</span>
          </div>
          
          <div style={{ display: "flex", alignItems: "flex-end", height: "200px", gap: "1rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(12, 27, 58, 0.1)" }}>
            {chartData.map((data, idx) => {
              const heightPercent = (data.count / maxCount) * 100;
              return (
                <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", height: "100%" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%", position: "relative", justifyContent: "center" }}>
                    <div style={{ 
                      width: "80%", 
                      maxWidth: "40px",
                      height: `${heightPercent}%`, 
                      background: "linear-gradient(to top, var(--gold), #e8cf84)", 
                      borderRadius: "6px 6px 0 0",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }} 
                    title={`${data.count} Quotes`}
                    onMouseOver={(e) => e.currentTarget.style.opacity = "0.8"}
                    onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                    />
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "rgba(12, 27, 58, 0.6)", fontWeight: 600 }}>{data.day}</span>
                </div>
              );
            })}
          </div>
        </Card>


      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
        <Card className="glass-card" style={{ padding: "2rem", border: "1px solid rgba(201, 168, 76, 0.15)", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
          <h3 style={{ fontFamily: "var(--font-poppins)", fontSize: "1.2rem", color: "var(--nb-navy)", marginBottom: "1.5rem" }}>Recent Quote Requests</h3>
          {loading ? (
            <p>Loading requests...</p>
          ) : recentQuotes.length === 0 ? (
            <p style={{ color: "rgba(12, 27, 58, 0.5)" }}>No quote requests found.</p>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ color: "rgba(12, 27, 58, 0.6)" }}>Client</th>
                    <th style={{ color: "rgba(12, 27, 58, 0.6)" }}>Service</th>
                    <th style={{ color: "rgba(12, 27, 58, 0.6)" }}>Date</th>
                    <th style={{ color: "rgba(12, 27, 58, 0.6)" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentQuotes.map((row) => (
                    <tr key={row.id}>
                      <td style={{ fontWeight: 600, color: "var(--nb-navy)" }}>{row.firstName} {row.lastName}</td>
                      <td style={{ color: "rgba(12, 27, 58, 0.8)" }}>{row.serviceRequested.join(", ")}</td>
                      <td style={{ color: "rgba(12, 27, 58, 0.8)" }}>{row.createdAt ? new Date((row.createdAt as any).seconds * 1000).toLocaleDateString() : "Just now"}</td>
                      <td>
                        <span style={{ 
                          padding: "0.25rem 0.75rem", 
                          borderRadius: "999px", 
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          background: row.status === "Pending" ? "rgba(230, 166, 35, 0.15)" : row.status === "Completed" ? "rgba(16, 185, 129, 0.15)" : "rgba(45, 156, 219, 0.15)",
                          color: row.status === "Pending" ? "#E6A623" : row.status === "Completed" ? "#10b981" : "#2D9CDB"
                        }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
