"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Image as ImageIcon, MessageSquare, Settings, LogOut, Users, FileText, Briefcase, Receipt, Lock, User as UserIcon } from "lucide-react";
import styles from "./AdminLayout.module.css";
import { usePathname, useRouter } from "next/navigation";
import { app } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User, getAuth } from "firebase/auth";

const auth = getAuth(app);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Login Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError("Invalid email or password.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const links = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/admin/quotes", label: "Quote Requests", icon: <MessageSquare size={20} /> },
    { href: "/admin/services", label: "Services", icon: <Briefcase size={20} /> },
    { href: "/admin/invoice-generator", label: "Invoice Generator", icon: <Receipt size={20} /> },

    { href: "/admin/users", label: "Users & Roles", icon: <Users size={20} /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  if (loading) {
    return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Admin Panel...</div>;
  }

  if (!user) {
    return (
      <div style={{ 
        height: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        background: `radial-gradient(circle at top left, rgba(162, 204, 252, 0.8) 0%, transparent 40%),
                     radial-gradient(circle at top right, rgba(251, 242, 170, 0.8) 0%, transparent 40%),
                     radial-gradient(circle at bottom right, rgba(242, 111, 85, 0.8) 0%, transparent 40%),
                     radial-gradient(circle at bottom left, rgba(41, 72, 255, 0.8) 0%, transparent 50%),
                     #e4f0fa`
      }}>
        <div style={{ 
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "3rem 2.5rem", 
          borderRadius: "16px", 
          width: "100%", 
          maxWidth: "380px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)"
        }}>
          <div style={{
            width: "90px", height: "90px", 
            borderRadius: "50%", 
            background: "#efa386", 
            margin: "0 auto 2.5rem",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <UserIcon size={44} color="white" strokeWidth={1.5} />
          </div>
          
          <form onSubmit={handleLogin} autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {error && <div style={{ color: "#ef4444", fontSize: "0.85rem", textAlign: "center" }}>{error}</div>}
            
            <div style={{ display: "flex", width: "100%", background: "#dcdcdc", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ padding: "0.9rem", background: "#d0d0d0", display: "flex", alignItems: "center", justifyContent: "center", width: "50px" }}>
                <UserIcon size={20} color="#555" />
              </div>
              <input type="email" required autoComplete="off" value={email} onChange={e => setEmail(e.target.value)} style={{ flex: 1, padding: "0.9rem 1rem", border: "none", background: "transparent", outline: "none", color: "#333", fontSize: "0.95rem" }} placeholder="Username" />
            </div>
            
            <div style={{ display: "flex", width: "100%", background: "#dcdcdc", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ padding: "0.9rem", background: "#d0d0d0", display: "flex", alignItems: "center", justifyContent: "center", width: "50px" }}>
                <Lock size={20} color="#555" />
              </div>
              <input type="password" required autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} style={{ flex: 1, padding: "0.9rem 1rem", border: "none", background: "transparent", outline: "none", color: "#333", fontSize: "0.95rem" }} placeholder="••••••••" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: "#888", marginTop: "0.5rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
                <input type="checkbox" style={{ accentColor: "#888", width: "14px", height: "14px", margin: 0 }} />
                Remember me
              </label>
              <a href="#" style={{ color: "#888", textDecoration: "none", fontStyle: "italic" }}>Forgot Password?</a>
            </div>
            
            <button type="submit" style={{ marginTop: "1.5rem", padding: "1rem", background: "#929292", color: "white", border: "none", borderRadius: "24px", cursor: "pointer", fontWeight: 600, fontSize: "0.95rem", letterSpacing: "0.05em" }}>
              LOGIN
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.layout} admin-theme`}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <LayoutDashboard size={24} />
          <span>Admin Panel</span>
        </div>
        <nav className={styles.nav}>
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ""}`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className={`${styles.navLink} ${styles.logout}`} style={{ border: "none", background: "none", cursor: "pointer", width: "100%", textAlign: "left", marginTop: "auto" }}>
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {links.find(l => l.href === pathname)?.label || "Dashboard Overview"}
          </h1>
          <div className={styles.user}>
            <span>Welcome, {user.email?.split('@')[0]}</span>
            <div className={styles.avatar}>{user.email?.charAt(0).toUpperCase()}</div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
