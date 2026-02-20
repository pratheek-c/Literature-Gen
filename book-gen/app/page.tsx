"use client";

import Link from "next/link";
import { CopilotChat } from "@copilotkit/react-ui";
import { useState } from "react";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ── Navbar ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 48px",
        borderBottom: "1px solid var(--border)",
        background: "rgba(10,11,15,0.8)",
        backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>📖</span>
          <span className="font-serif" style={{ fontSize: 22, fontWeight: 700, color: "var(--gold)" }}>
            StoryForge
          </span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/generate" className="btn-ghost" style={{ padding: "8px 20px", fontSize: 14 }}>
            Generate
          </Link>
          <Link href="/read" className="btn-ghost" style={{ padding: "8px 20px", fontSize: 14 }}>
            Read
          </Link>
          <button
            className="btn-primary"
            style={{ padding: "8px 20px", fontSize: 14 }}
            onClick={() => setChatOpen(!chatOpen)}
          >
            💬 AI Assistant
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        {/* Background orbs */}
        <div style={{
          position: "absolute", top: "20%", left: "10%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "15%", right: "8%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="animate-fade-in-up" style={{ textAlign: "center", maxWidth: 720, position: "relative" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px",
            background: "var(--gold-dim)",
            border: "1px solid var(--border-accent)",
            borderRadius: 20,
            marginBottom: 32,
          }}>
            <span style={{ fontSize: 12 }}>✨</span>
            <span style={{ fontSize: 13, color: "var(--gold)", fontWeight: 500 }}>
              AI-Powered Fiction Generation
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif" style={{ fontSize: "clamp(48px, 8vw, 80px)", fontWeight: 900, marginBottom: 24, lineHeight: 1.1 }}>
            Craft Stories That{" "}
            <span className="gold-shimmer">Come Alive</span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 20, color: "var(--text-secondary)", marginBottom: 48, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 48px" }}>
            Build rich characters with AI, define your world, and watch a complete fiction story unfold — chapter by chapter.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/generate" className="btn-primary" style={{ fontSize: 16, padding: "16px 40px" }}>
              ✍️ Start Writing
            </Link>
            <Link href="/read" className="btn-ghost" style={{ fontSize: 16, padding: "16px 40px" }}>
              📚 Read a Story
            </Link>
          </div>
        </div>

        {/* ── Feature Cards ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 24, maxWidth: 900, width: "100%", marginTop: 96,
        }}>
          {[
            { icon: "🧬", title: "Deep Characters", desc: "AI builds multi-dimensional characters with arcs, flaws, motivations, and backstories." },
            { icon: "🌍", title: "Rich Worlds", desc: "Set your genre, tone, and setting. The AI weaves them into a cohesive narrative." },
            { icon: "📖", title: "Full Stories", desc: "Get complete, chapter-structured fiction stories ready to read and share." },
          ].map((f) => (
            <div key={f.title} className="card" style={{ padding: 28, transition: "transform 0.2s, border-color 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-accent)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <h3 className="font-serif" style={{ fontSize: 20, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ padding: "24px 48px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
          StoryForge · Powered by Mastra AI & CopilotKit
        </p>
      </footer>

      {/* ── CopilotChat Sidebar ── */}
      {chatOpen && (
        <div style={{
          position: "fixed", right: 0, top: 0, bottom: 0,
          width: 380, zIndex: 100,
          background: "var(--bg-surface)",
          borderLeft: "1px solid var(--border-accent)",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.5)",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <span className="font-serif" style={{ fontSize: 18, color: "var(--gold)" }}>AI Assistant</span>
            <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 20 }}>✕</button>
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <CopilotChat
              labels={{ title: "Story Assistant", initial: "Hi! I can help you brainstorm characters, plot ideas, or story settings. What are you working on?" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}