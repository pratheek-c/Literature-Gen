"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { CopilotChat } from "@copilotkit/react-ui";

interface ChapterBreakdown {
    chapterNumber: number;
    chapterTitle: string;
    summary: string;
}

interface Story {
    title: string;
    story: string;
    chapterBreakdown?: ChapterBreakdown[];
}

// ── Parse chapters from raw story text ──────────────────────────────────────

function parseChapters(story: string): Array<{ title: string; content: string }> {
    const chapterRegex = /Chapter\s+\d+[:\s]+([^\n]+)/gi;
    const splits = story.split(/(?=Chapter\s+\d+[:\s])/i).filter(Boolean);

    if (splits.length <= 1) {
        return [{ title: "Story", content: story }];
    }

    return splits.map((chunk) => {
        const match = chunk.match(/Chapter\s+\d+[:\s]+([^\n]+)/i);
        const title = match ? match[0].trim() : "Chapter";
        const content = chunk.replace(/Chapter\s+\d+[:\s]+[^\n]+\n?/i, "").trim();
        return { title, content };
    });
}

// ── Format story text into paragraphs ───────────────────────────────────────

function StoryContent({ text }: { text: string }) {
    const paragraphs = text.split(/\n\n+/).filter(Boolean);
    return (
        <div className="reader-body">
            {paragraphs.map((p, i) => (
                <p key={i}>{p.trim()}</p>
            ))}
        </div>
    );
}

// ── Main Reader Page ─────────────────────────────────────────────────────────

export default function ReadPage() {
    const [story, setStory] = useState<Story | null>(null);
    const [chapters, setChapters] = useState<Array<{ title: string; content: string }>>([]);
    const [activeChapter, setActiveChapter] = useState(0);
    const [chatOpen, setChatOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [fontSize, setFontSize] = useState(18);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const raw = localStorage.getItem("storyforge_story");
        if (raw) {
            try {
                const parsed = JSON.parse(raw) as Story;
                setStory(parsed);
                setChapters(parseChapters(parsed.story));
            } catch {
                // ignore parse errors
            }
        }
    }, []);

    const scrollToTop = () => {
        contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goToChapter = (idx: number) => {
        setActiveChapter(idx);
        scrollToTop();
    };

    if (!story) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
                <div style={{ fontSize: 64 }}>📚</div>
                <h1 className="font-serif" style={{ fontSize: 36, color: "var(--gold)" }}>No Story Yet</h1>
                <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>Generate a story first to read it here.</p>
                <Link href="/generate" className="btn-primary" style={{ marginTop: 8 }}>
                    ✍️ Generate a Story
                </Link>
            </div>
        );
    }

    const currentChapter = chapters[activeChapter];

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-deep)" }}>
            {/* ── Top Bar ── */}
            <nav style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 24px",
                borderBottom: "1px solid var(--border)",
                background: "rgba(10,11,15,0.95)",
                backdropFilter: "blur(12px)",
                position: "sticky", top: 0, zIndex: 50,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 18, padding: "4px 8px" }}
                        title="Toggle chapters"
                    >
                        ☰
                    </button>
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                        <span style={{ fontSize: 18 }}>📖</span>
                        <span className="font-serif" style={{ fontSize: 18, fontWeight: 700, color: "var(--gold)" }}>StoryForge</span>
                    </Link>
                </div>

                <div className="font-serif" style={{ fontSize: 15, color: "var(--text-secondary)", textAlign: "center", flex: 1, padding: "0 24px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {story.title}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Font size controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "4px 8px" }}>
                        <button onClick={() => setFontSize(Math.max(14, fontSize - 1))} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>A−</button>
                        <span style={{ color: "var(--text-muted)", fontSize: 12, width: 28, textAlign: "center" }}>{fontSize}</span>
                        <button onClick={() => setFontSize(Math.min(26, fontSize + 1))} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>A+</button>
                    </div>
                    <button className="btn-ghost" style={{ padding: "6px 14px", fontSize: 13 }} onClick={() => setChatOpen(!chatOpen)}>
                        💬 Ask AI
                    </button>
                    <Link href="/generate" className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>
                        + New Story
                    </Link>
                </div>
            </nav>

            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                {/* ── Chapter Sidebar ── */}
                {sidebarOpen && (
                    <aside style={{
                        width: 260, flexShrink: 0,
                        borderRight: "1px solid var(--border)",
                        background: "var(--bg-surface)",
                        overflowY: "auto",
                        padding: "24px 0",
                    }}>
                        <div style={{ padding: "0 20px 16px", borderBottom: "1px solid var(--border)", marginBottom: 8 }}>
                            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Contents</p>
                            <p className="font-serif" style={{ fontSize: 14, color: "var(--gold)", lineHeight: 1.4 }}>{story.title}</p>
                        </div>

                        {chapters.map((ch, i) => (
                            <button
                                key={i}
                                onClick={() => goToChapter(i)}
                                style={{
                                    display: "block", width: "100%", textAlign: "left",
                                    padding: "12px 20px",
                                    background: activeChapter === i ? "var(--gold-dim)" : "none",
                                    border: "none",
                                    borderLeft: activeChapter === i ? "3px solid var(--gold)" : "3px solid transparent",
                                    color: activeChapter === i ? "var(--gold)" : "var(--text-secondary)",
                                    cursor: "pointer",
                                    fontSize: 13,
                                    lineHeight: 1.4,
                                    transition: "all 0.15s",
                                }}
                                onMouseEnter={e => { if (activeChapter !== i) (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)"; }}
                                onMouseLeave={e => { if (activeChapter !== i) (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                            >
                                {ch.title}
                            </button>
                        ))}

                        {/* Chapter summaries if available */}
                        {story.chapterBreakdown && story.chapterBreakdown.length > 0 && (
                            <div style={{ marginTop: 24, padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
                                <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Summaries</p>
                                {story.chapterBreakdown.map((cb) => (
                                    <div key={cb.chapterNumber} style={{ marginBottom: 12 }}>
                                        <p style={{ fontSize: 12, color: "var(--gold)", fontWeight: 500, marginBottom: 4 }}>Ch. {cb.chapterNumber}: {cb.chapterTitle}</p>
                                        <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{cb.summary}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </aside>
                )}

                {/* ── Reading Area ── */}
                <main
                    ref={contentRef}
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "60px 40px",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <div style={{ maxWidth: 720, width: "100%" }} className="animate-fade-in">
                        {/* Story title (first chapter only) */}
                        {activeChapter === 0 && (
                            <div style={{ textAlign: "center", marginBottom: 64 }}>
                                <p style={{ fontSize: 12, color: "var(--gold)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>A StoryForge Original</p>
                                <h1 className="font-serif" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 24 }}>
                                    {story.title}
                                </h1>
                                <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, transparent, var(--gold), transparent)", margin: "0 auto" }} />
                            </div>
                        )}

                        {/* Chapter heading */}
                        {chapters.length > 1 && (
                            <div style={{ marginBottom: 40 }}>
                                <p style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                                    {activeChapter + 1} of {chapters.length}
                                </p>
                                <h2 className="font-serif" style={{ fontSize: 32, color: "var(--gold-light)" }}>
                                    {currentChapter?.title}
                                </h2>
                                <div style={{ width: 40, height: 1, background: "var(--border-accent)", marginTop: 16 }} />
                            </div>
                        )}

                        {/* Story text */}
                        <div style={{ fontSize }}>
                            {currentChapter && <StoryContent text={currentChapter.content} />}
                        </div>

                        {/* Chapter navigation */}
                        {chapters.length > 1 && (
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
                                <button
                                    className="btn-ghost"
                                    onClick={() => goToChapter(activeChapter - 1)}
                                    disabled={activeChapter === 0}
                                    style={{ opacity: activeChapter === 0 ? 0.3 : 1, cursor: activeChapter === 0 ? "not-allowed" : "pointer" }}
                                >
                                    ← Previous
                                </button>
                                <span style={{ color: "var(--text-muted)", fontSize: 13, alignSelf: "center" }}>
                                    Chapter {activeChapter + 1} / {chapters.length}
                                </span>
                                <button
                                    className="btn-primary"
                                    onClick={() => goToChapter(activeChapter + 1)}
                                    disabled={activeChapter === chapters.length - 1}
                                    style={{ opacity: activeChapter === chapters.length - 1 ? 0.3 : 1, cursor: activeChapter === chapters.length - 1 ? "not-allowed" : "pointer" }}
                                >
                                    Next →
                                </button>
                            </div>
                        )}

                        {/* End of story */}
                        {activeChapter === chapters.length - 1 && (
                            <div style={{ textAlign: "center", marginTop: 64, padding: "40px 0" }}>
                                <div style={{ fontSize: 40, marginBottom: 16 }}>🎭</div>
                                <p className="font-serif" style={{ fontSize: 22, color: "var(--gold)", marginBottom: 8 }}>The End</p>
                                <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 32 }}>Generated by StoryForge AI</p>
                                <Link href="/generate" className="btn-primary">✍️ Write Another Story</Link>
                            </div>
                        )}
                    </div>
                </main>

                {/* ── CopilotChat Panel ── */}
                {chatOpen && (
                    <aside style={{
                        width: 360, flexShrink: 0,
                        borderLeft: "1px solid var(--border-accent)",
                        background: "var(--bg-surface)",
                        display: "flex", flexDirection: "column",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
                            <span className="font-serif" style={{ fontSize: 15, color: "var(--gold)" }}>Story Assistant</span>
                            <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 18 }}>✕</button>
                        </div>
                        <div style={{ flex: 1, overflow: "hidden" }}>
                            <CopilotChat
                                labels={{
                                    title: "Story Assistant",
                                    initial: `You're reading "${story.title}". Ask me anything about the story, characters, or themes!`,
                                }}
                            />
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}
