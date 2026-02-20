"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CopilotChat } from "@copilotkit/react-ui";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";

// ── Types ────────────────────────────────────────────────────────────────────

interface CharacterData {
    name: string;
    role: string;
    age?: number;
    gender?: string;
    occupation?: string;
    background?: string;
    traits: string[];
    strengths: string[];
    flaws: string[];
    fears: string[];
    desires: string[];
}

interface StoryParams {
    genre: string;
    setting: string;
    plotPremise: string;
    tone: string;
    chapterCount: number;
}

const defaultCharacter: CharacterData = {
    name: "",
    role: "protagonist",
    traits: [],
    strengths: [],
    flaws: [],
    fears: [],
    desires: [],
};

const defaultStory: StoryParams = {
    genre: "fantasy",
    setting: "",
    plotPremise: "",
    tone: "dramatic",
    chapterCount: 3,
};

const MASTRA_URL = "http://localhost:4111";

export default function GeneratePage() {
    const router = useRouter();
    const [character, setCharacter] = useState<CharacterData>(defaultCharacter);
    const [storyParams, setStoryParams] = useState<StoryParams>(defaultStory);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatingStatus, setGeneratingStatus] = useState("");
    const [error, setError] = useState<string | null>(null);

    // ── CopilotKit Readables ───────────────────────────────────────────────
    useCopilotReadable({
        description: "The current state of the character being developed.",
        value: character,
    });

    useCopilotReadable({
        description: "The current story parameters (genre, setting, etc.).",
        value: storyParams,
    });

    // ── CopilotKit Actions ─────────────────────────────────────────────────
    useCopilotAction({
        name: "updateCharacterData",
        description: "Update character attributes.",
        parameters: [
            { name: "name", type: "string" },
            {
                name: "role",
                type: "string",
                enum: ["protagonist", "antagonist", "supporting", "minor", "mentor", "foil", "sidekick", "other"],
                description: "Character role (lowercase)"
            },
            { name: "age", type: "number" },
            { name: "gender", type: "string" },
            { name: "occupation", type: "string" },
            { name: "background", type: "string" },
            { name: "traits", type: "string[]" },
            { name: "strengths", type: "string[]" },
            { name: "flaws", type: "string[]" },
            { name: "fears", type: "string[]" },
            { name: "desires", type: "string[]" },
        ],
        handler: async (args: any) => {
            setCharacter(prev => ({ ...prev, ...args }));
        },
    });

    useCopilotAction({
        name: "updateStoryParams",
        description: "Update story parameters like genre, setting, and plot.",
        parameters: [
            { name: "genre", type: "string" },
            { name: "setting", type: "string" },
            { name: "plotPremise", type: "string" },
            { name: "tone", type: "string" },
            { name: "chapterCount", type: "number" },
        ],
        handler: async (args: any) => {
            setStoryParams(prev => ({ ...prev, ...args }));
        },
    });

    const runWorkflow = useCallback(async () => {
        setIsGenerating(true);
        setError(null);

        try {
            setGeneratingStatus("Starting story generation workflow...");
            const runId = crypto.randomUUID();
            console.log("Starting workflow with runId:", runId);

            const startRes = await fetch(`${MASTRA_URL}/api/workflows/fiction-generation-workflow/start-async?runId=${runId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    inputData: {
                        basicInfo: {
                            name: character.name || "Hero",
                            role: character.role,
                            age: character.age,
                            gender: character.gender,
                            occupation: character.occupation,
                            background: character.background,
                        },
                        personality: {
                            traits: character.traits,
                            strengths: character.strengths,
                            flaws: character.flaws,
                            fears: character.fears,
                            desires: character.desires,
                            internalConflicts: [],
                        },
                        motivations: {
                            shortTermGoals: [],
                            longTermGoals: [],
                            drivingForce: "",
                        },
                        backstory: {
                            origin: "",
                            keyLifeEvents: [],
                            traumaOrTurningPoints: [],
                            relationshipsInfluence: [],
                        },
                        relationships: [],
                        characterArc: {
                            startingState: "At the beginning of the journey",
                            challenges: [],
                        },
                        dialogueStyle: {
                            tone: "neutral",
                            speechPatterns: [],
                        },
                        narrativeFunction: {
                            storyPurpose: "Protagonist",
                            themesRepresented: [],
                            keyConflictsInvolved: [],
                        },
                    }
                }),
            });

            if (!startRes.ok) throw new Error("Failed to start workflow");

            // Wait for first suspension
            let isSuspended = false;
            while (!isSuspended) {
                await new Promise(r => setTimeout(r, 1000));
                const res = await fetch(`${MASTRA_URL}/api/workflows/fiction-generation-workflow/runs/${runId}`);
                const data = await res.json();
                if (data.status === "suspended") isSuspended = true;
                if (data.status === "failed") throw new Error("Workflow failed before starting Character Profile");
            }

            setGeneratingStatus("Developing character profile...");
            const resume1Res = await fetch(`${MASTRA_URL}/api/workflows/fiction-generation-workflow/resume?runId=${runId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    stepId: "collect-character-data",
                    resumeData: {
                        reviewStatus: "approved",
                        reviewer: { name: "System", role: "reviewer" },
                        reviewContext: { entityType: "character", entityId: character.name || "Hero" },
                        feedback: { summary: "Auto-approved" },
                        decisions: { allowAgentContinuation: true },
                        revisionInstructions: { regenerateSections: [] }
                    },
                }),
            });

            if (!resume1Res.ok) {
                const errData = await resume1Res.json();
                throw new Error(errData.error || "Failed to resume Character Data step");
            }

            // Wait for second suspension
            setGeneratingStatus("Waiting for character profile generation...");
            isSuspended = false;
            while (!isSuspended) {
                await new Promise(r => setTimeout(r, 2000));
                const res = await fetch(`${MASTRA_URL}/api/workflows/fiction-generation-workflow/runs/${runId}`);
                const data = await res.json();
                if (data.status === "suspended" && data.suspended?.[0]?.includes("collect-story-parameters")) {
                    isSuspended = true;
                }
                if (data.status === "failed") throw new Error("Workflow failed during Character Profile generation");
            }

            setGeneratingStatus("Setting story parameters...");
            const resume2Res = await fetch(`${MASTRA_URL}/api/workflows/fiction-generation-workflow/resume?runId=${runId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    stepId: "collect-story-parameters",
                    resumeData: {
                        reviewStatus: "approved",
                        storyParameters: {
                            ...storyParams,
                            chapterCount: storyParams.chapterCount || 3,
                        },
                    },
                }),
            });

            if (!resume2Res.ok) {
                const errData = await resume2Res.json();
                throw new Error(errData.error || "Failed to resume Story Parameters step");
            }

            setGeneratingStatus("Writing your book... (this may take a minute)");
            let result = null;
            let attempts = 0;
            while (!result && attempts < 60) {
                await new Promise(r => setTimeout(r, 2000));
                attempts++;
                const statusRes = await fetch(`${MASTRA_URL}/api/workflows/fiction-generation-workflow/runs/${runId}`);
                const data = await statusRes.json();
                if (data.status === "completed" || data.status === "success") {
                    result = data.result || data.output;
                } else if (data.status === "failed") {
                    throw new Error("Story generation failed");
                }
            }

            if (result) {
                localStorage.setItem("storyforge_story", JSON.stringify(result));
                router.push("/read");
            } else {
                throw new Error("Generation timed out");
            }

        } catch (err: any) {
            setError(err.message);
            setIsGenerating(false);
        }
    }, [character, storyParams, router]);

    useCopilotAction({
        name: "triggerFictionGeneration",
        description: "Generate the story when requirements are ready.",
        handler: async () => {
            runWorkflow();
        },
    });

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-deep)" }}>
            {/* Nav */}
            <nav style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 24px",
                borderBottom: "1px solid var(--border)",
                background: "rgba(10,11,15,0.8)",
                backdropFilter: "blur(12px)",
                zIndex: 10
            }}>
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                    <span style={{ fontSize: 18 }}>📖</span>
                    <span className="font-serif" style={{ fontSize: 18, fontWeight: 700, color: "var(--gold)" }}>StoryForge</span>
                </Link>
                <div style={{ display: "flex", gap: 12 }}>
                    {isGenerating && <div className="spinner" style={{ width: 16, height: 16 }} />}
                    <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>{generatingStatus || "Chat with AI to start"}</span>
                </div>
            </nav>

            {/* Main Layout */}
            <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                {/* Left: Chat */}
                <section style={{ flex: 1.2, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
                    <CopilotChat
                        className="custom-copilot-chat"
                        labels={{
                            title: "Character Architect",
                            initial: "Welcome to StoryForge! Let's build your story. What's the name of your main character?"
                        }}
                    />
                </section>

                {/* Right: Live Preview */}
                <section style={{ flex: 1, padding: 32, overflowY: "auto", background: "rgba(255,255,255,0.02)" }}>
                    {error && (
                        <div style={{ padding: 12, background: "rgba(220,50,50,0.1)", border: "1px solid #dc3232", borderRadius: 8, marginBottom: 24, color: "#ff7070", fontSize: 13 }}>
                            {error}
                        </div>
                    )}

                    <div style={{ maxWidth: 500, margin: "0 auto" }}>
                        <h2 className="font-serif" style={{ fontSize: 24, color: "var(--gold)", marginBottom: 24, borderBottom: "1px solid var(--border-accent)", paddingBottom: 12 }}>
                            Live Character Preview
                        </h2>

                        <div className="card" style={{ padding: 24, position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", top: 0, right: 0, padding: "8px 16px", background: "var(--gold)", color: "black", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
                                {character.role}
                            </div>

                            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, letterSpacing: "0.1em" }}>IDENTIFICATION</p>
                            <h3 style={{ fontSize: 32, marginBottom: 16 }}>{character.name || "Unnamed"}</h3>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                                <div>
                                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>AGE</p>
                                    <p style={{ color: "white" }}>{character.age || "???"}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>GENDER</p>
                                    <p style={{ color: "white" }}>{character.gender || "???"}</p>
                                </div>
                                <div style={{ gridColumn: "span 2" }}>
                                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>OCCUPATION</p>
                                    <p style={{ color: "white" }}>{character.occupation || "???"}</p>
                                </div>
                            </div>

                            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, letterSpacing: "0.1em" }}>PSYCHOLOGY</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                                {character.traits.length > 0 ? character.traits.map(t => <span key={t} className="tag" style={{ border: "1px solid var(--gold-dim)", color: "var(--gold-light)" }}>{t}</span>) : <span style={{ color: "var(--text-muted)", fontSize: 12, fontStyle: "italic" }}>No traits yet</span>}
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>FLAWS & FEARS</p>
                                <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                                    {[...character.flaws, ...character.fears].join(", ") || "Awaiting complexity..."}
                                </p>
                            </div>

                            <div className="divider" />

                            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, letterSpacing: "0.1em" }}>STORY CONFIG</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>GENRE</p>
                                    <p style={{ fontSize: 13, color: "var(--gold-light)", textTransform: "capitalize" }}>{storyParams.genre.replace("_", " ")}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>CHAPTERS</p>
                                    <p style={{ fontSize: 13, color: "white" }}>{storyParams.chapterCount}</p>
                                </div>
                            </div>

                            {storyParams.setting && (
                                <div style={{ marginTop: 12 }}>
                                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>SETTING</p>
                                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{storyParams.setting}</p>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: 24, textAlign: "center" }}>
                            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                Talk to the AI to update this profile.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <style jsx global>{`
                .custom-copilot-chat {
                    height: 100% !important;
                    background: transparent !important;
                }
                .CopilotKitChatWindow {
                    background: transparent !important;
                    border: none !important;
                }
                .CopilotKitChatHeader {
                    display: none !important;
                }
                .CopilotKitMessages {
                    background: transparent !important;
                }
                .CopilotKitMessage {
                    max-width: 90% !important;
                }
            `}</style>
        </div>
    );
}
