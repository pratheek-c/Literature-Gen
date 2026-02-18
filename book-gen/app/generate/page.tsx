"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CopilotChat } from "@copilotkit/react-ui";

// ── Types ────────────────────────────────────────────────────────────────────

interface CharacterData {
    basicInfo: {
        name: string;
        role: string;
        age: string;
        gender: string;
        occupation: string;
        background: string;
    };
    personality: {
        traits: string[];
        strengths: string[];
        flaws: string[];
        fears: string[];
        desires: string[];
        internalConflicts: string[];
    };
    motivations: {
        shortTermGoals: string[];
        longTermGoals: string[];
        drivingForce: string;
    };
    backstory: {
        origin: string;
        keyLifeEvents: string[];
        traumaOrTurningPoints: string[];
    };
    characterArc: {
        startingState: string;
        challenges: string[];
        transformation: string;
        endingState: string;
    };
    dialogueStyle: {
        tone: string;
        speechPatterns: string[];
        vocabularyLevel: string;
    };
    narrativeFunction: {
        storyPurpose: string;
        themesRepresented: string[];
        keyConflictsInvolved: string[];
    };
    metadata: {
        genre: string;
        worldSetting: string;
        notes: string;
    };
    relationships: Array<{
        characterName: string;
        relationshipType: string;
        emotionalDynamic: string;
    }>;
}

interface StoryParams {
    genre: string;
    setting: string;
    plotPremise: string;
    tone: string;
    targetAudience: string;
    chapterCount: number;
    additionalNotes: string;
}

// ── Tag Input Component ──────────────────────────────────────────────────────

function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
    const [input, setInput] = useState("");
    const add = () => {
        const trimmed = input.trim();
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
            setInput("");
        }
    };
    return (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: value.length ? 10 : 0 }}>
                {value.map((tag) => (
                    <span key={tag} className="tag">
                        {tag}
                        <button className="tag-remove" onClick={() => onChange(value.filter((t) => t !== tag))}>✕</button>
                    </span>
                ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
                <input
                    className="form-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
                    placeholder={placeholder ?? "Type and press Enter"}
                    style={{ flex: 1 }}
                />
                <button type="button" onClick={add} className="btn-ghost" style={{ padding: "10px 16px", fontSize: 13 }}>Add</button>
            </div>
        </div>
    );
}

// ── Field Group ──────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <label className="form-label">{label}</label>
            {children}
        </div>
    );
}

// ── Step Components ──────────────────────────────────────────────────────────

function Step1BasicInfo({ data, onChange }: { data: CharacterData; onChange: (d: CharacterData) => void }) {
    const set = (k: keyof CharacterData["basicInfo"], v: string) =>
        onChange({ ...data, basicInfo: { ...data.basicInfo, [k]: v } });

    return (
        <div>
            <h2 className="font-serif" style={{ fontSize: 28, marginBottom: 8 }}>Basic Character Info</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>Define who your character is at their core.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <Field label="Character Name *">
                    <input className="form-input" value={data.basicInfo.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Elara Voss" />
                </Field>
                <Field label="Role *">
                    <select className="form-select" value={data.basicInfo.role} onChange={e => set("role", e.target.value)}>
                        <option value="">Select role…</option>
                        {["protagonist", "antagonist", "supporting", "minor", "mentor", "foil", "sidekick", "other"].map(r => (
                            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                        ))}
                    </select>
                </Field>
                <Field label="Age">
                    <input className="form-input" type="number" value={data.basicInfo.age} onChange={e => set("age", e.target.value)} placeholder="e.g. 28" />
                </Field>
                <Field label="Gender">
                    <input className="form-input" value={data.basicInfo.gender} onChange={e => set("gender", e.target.value)} placeholder="e.g. Female" />
                </Field>
                <Field label="Occupation">
                    <input className="form-input" value={data.basicInfo.occupation} onChange={e => set("occupation", e.target.value)} placeholder="e.g. Archaeologist" />
                </Field>
                <Field label="Genre / World Setting">
                    <input className="form-input" value={data.metadata.genre} onChange={e => onChange({ ...data, metadata: { ...data.metadata, genre: e.target.value } })} placeholder="e.g. Fantasy, Sci-Fi" />
                </Field>
            </div>
            <Field label="Background">
                <textarea className="form-textarea" value={data.basicInfo.background} onChange={e => set("background", e.target.value)} placeholder="Brief background of the character…" />
            </Field>
            <Field label="Story Purpose *">
                <textarea className="form-textarea" value={data.narrativeFunction.storyPurpose} onChange={e => onChange({ ...data, narrativeFunction: { ...data.narrativeFunction, storyPurpose: e.target.value } })} placeholder="What role does this character play in the story?" style={{ minHeight: 70 }} />
            </Field>
        </div>
    );
}

function Step2Personality({ data, onChange }: { data: CharacterData; onChange: (d: CharacterData) => void }) {
    const setP = (k: keyof CharacterData["personality"], v: string[]) =>
        onChange({ ...data, personality: { ...data.personality, [k]: v } });

    return (
        <div>
            <h2 className="font-serif" style={{ fontSize: 28, marginBottom: 8 }}>Personality & Psychology</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>Shape the inner world of your character.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <Field label="Personality Traits">
                    <TagInput value={data.personality.traits} onChange={v => setP("traits", v)} placeholder="e.g. Stubborn, Curious…" />
                </Field>
                <Field label="Strengths">
                    <TagInput value={data.personality.strengths} onChange={v => setP("strengths", v)} placeholder="e.g. Brave, Empathetic…" />
                </Field>
                <Field label="Flaws">
                    <TagInput value={data.personality.flaws} onChange={v => setP("flaws", v)} placeholder="e.g. Impulsive, Jealous…" />
                </Field>
                <Field label="Fears">
                    <TagInput value={data.personality.fears} onChange={v => setP("fears", v)} placeholder="e.g. Abandonment, Failure…" />
                </Field>
                <Field label="Desires">
                    <TagInput value={data.personality.desires} onChange={v => setP("desires", v)} placeholder="e.g. Recognition, Freedom…" />
                </Field>
                <Field label="Internal Conflicts">
                    <TagInput value={data.personality.internalConflicts} onChange={v => setP("internalConflicts", v)} placeholder="e.g. Duty vs. Love…" />
                </Field>
            </div>

            <div className="divider" />

            <Field label="Dialogue Tone">
                <input className="form-input" value={data.dialogueStyle.tone} onChange={e => onChange({ ...data, dialogueStyle: { ...data.dialogueStyle, tone: e.target.value } })} placeholder="e.g. Sarcastic, Formal, Warm" />
            </Field>
            <Field label="Vocabulary Level">
                <select className="form-select" value={data.dialogueStyle.vocabularyLevel} onChange={e => onChange({ ...data, dialogueStyle: { ...data.dialogueStyle, vocabularyLevel: e.target.value } })}>
                    <option value="">Select level…</option>
                    {["simple", "casual", "formal", "technical", "poetic"].map(v => (
                        <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
                    ))}
                </select>
            </Field>
        </div>
    );
}

function Step3Arc({ data, onChange }: { data: CharacterData; onChange: (d: CharacterData) => void }) {
    return (
        <div>
            <h2 className="font-serif" style={{ fontSize: 28, marginBottom: 8 }}>Story Arc & Backstory</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>Define where your character starts and where they end up.</p>

            <Field label="Origin / Backstory">
                <textarea className="form-textarea" value={data.backstory.origin} onChange={e => onChange({ ...data, backstory: { ...data.backstory, origin: e.target.value } })} placeholder="Where did this character come from?" />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <Field label="Key Life Events">
                    <TagInput value={data.backstory.keyLifeEvents} onChange={v => onChange({ ...data, backstory: { ...data.backstory, keyLifeEvents: v } })} placeholder="e.g. Lost a parent…" />
                </Field>
                <Field label="Trauma / Turning Points">
                    <TagInput value={data.backstory.traumaOrTurningPoints} onChange={v => onChange({ ...data, backstory: { ...data.backstory, traumaOrTurningPoints: v } })} placeholder="e.g. Betrayed by mentor…" />
                </Field>
                <Field label="Short-Term Goals">
                    <TagInput value={data.motivations.shortTermGoals} onChange={v => onChange({ ...data, motivations: { ...data.motivations, shortTermGoals: v } })} placeholder="e.g. Escape the city…" />
                </Field>
                <Field label="Long-Term Goals">
                    <TagInput value={data.motivations.longTermGoals} onChange={v => onChange({ ...data, motivations: { ...data.motivations, longTermGoals: v } })} placeholder="e.g. Restore family honor…" />
                </Field>
            </div>

            <Field label="Driving Force">
                <input className="form-input" value={data.motivations.drivingForce} onChange={e => onChange({ ...data, motivations: { ...data.motivations, drivingForce: e.target.value } })} placeholder="What fundamentally drives this character?" />
            </Field>

            <div className="divider" />

            <Field label="Starting State *">
                <input className="form-input" value={data.characterArc.startingState} onChange={e => onChange({ ...data, characterArc: { ...data.characterArc, startingState: e.target.value } })} placeholder="Who is this character at the beginning?" />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <Field label="Challenges">
                    <TagInput value={data.characterArc.challenges} onChange={v => onChange({ ...data, characterArc: { ...data.characterArc, challenges: v } })} placeholder="e.g. Faces betrayal…" />
                </Field>
                <Field label="Themes Represented">
                    <TagInput value={data.narrativeFunction.themesRepresented} onChange={v => onChange({ ...data, narrativeFunction: { ...data.narrativeFunction, themesRepresented: v } })} placeholder="e.g. Redemption, Power…" />
                </Field>
            </div>
            <Field label="Transformation">
                <input className="form-input" value={data.characterArc.transformation} onChange={e => onChange({ ...data, characterArc: { ...data.characterArc, transformation: e.target.value } })} placeholder="How does the character change?" />
            </Field>
            <Field label="Ending State">
                <input className="form-input" value={data.characterArc.endingState} onChange={e => onChange({ ...data, characterArc: { ...data.characterArc, endingState: e.target.value } })} placeholder="Who is this character at the end?" />
            </Field>
        </div>
    );
}

function Step4Story({ params, onChange }: { params: StoryParams; onChange: (p: StoryParams) => void }) {
    return (
        <div>
            <h2 className="font-serif" style={{ fontSize: 28, marginBottom: 8 }}>Story Parameters</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>Set the stage for your fiction story.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <Field label="Genre *">
                    <select className="form-select" value={params.genre} onChange={e => onChange({ ...params, genre: e.target.value })}>
                        <option value="">Select genre…</option>
                        {["fantasy", "science_fiction", "mystery", "thriller", "romance", "horror", "historical_fiction", "adventure", "literary_fiction", "other"].map(g => (
                            <option key={g} value={g}>{g.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}</option>
                        ))}
                    </select>
                </Field>
                <Field label="Tone">
                    <select className="form-select" value={params.tone} onChange={e => onChange({ ...params, tone: e.target.value })}>
                        <option value="">Select tone…</option>
                        {["dark", "lighthearted", "dramatic", "humorous", "suspenseful", "romantic", "neutral"].map(t => (
                            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                        ))}
                    </select>
                </Field>
                <Field label="Target Audience">
                    <select className="form-select" value={params.targetAudience} onChange={e => onChange({ ...params, targetAudience: e.target.value })}>
                        <option value="">Select audience…</option>
                        {["children", "young_adult", "adult", "all_ages"].map(a => (
                            <option key={a} value={a}>{a.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}</option>
                        ))}
                    </select>
                </Field>
                <Field label="Number of Chapters">
                    <input className="form-input" type="number" min={1} max={10} value={params.chapterCount} onChange={e => onChange({ ...params, chapterCount: parseInt(e.target.value) || 3 })} />
                </Field>
            </div>

            <Field label="Setting *">
                <textarea className="form-textarea" value={params.setting} onChange={e => onChange({ ...params, setting: e.target.value })} placeholder="Describe the world or environment where the story takes place…" />
            </Field>
            <Field label="Plot Premise *">
                <textarea className="form-textarea" value={params.plotPremise} onChange={e => onChange({ ...params, plotPremise: e.target.value })} placeholder="What is the core conflict or central idea of the story?" />
            </Field>
            <Field label="Additional Notes">
                <textarea className="form-textarea" value={params.additionalNotes} onChange={e => onChange({ ...params, additionalNotes: e.target.value })} placeholder="Any special instructions for the AI writer…" style={{ minHeight: 70 }} />
            </Field>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────

const STEPS = ["Character", "Personality", "Arc & Story", "Story Params", "Generating"];

const defaultCharacter: CharacterData = {
    basicInfo: { name: "", role: "", age: "", gender: "", occupation: "", background: "" },
    personality: { traits: [], strengths: [], flaws: [], fears: [], desires: [], internalConflicts: [] },
    motivations: { shortTermGoals: [], longTermGoals: [], drivingForce: "" },
    backstory: { origin: "", keyLifeEvents: [], traumaOrTurningPoints: [] },
    characterArc: { startingState: "", challenges: [], transformation: "", endingState: "" },
    dialogueStyle: { tone: "", speechPatterns: [], vocabularyLevel: "" },
    narrativeFunction: { storyPurpose: "", themesRepresented: [], keyConflictsInvolved: [] },
    metadata: { genre: "", worldSetting: "", notes: "" },
    relationships: [],
};

const defaultStory: StoryParams = {
    genre: "", setting: "", plotPremise: "", tone: "", targetAudience: "", chapterCount: 3, additionalNotes: "",
};

const MASTRA_URL = "http://localhost:4111";

export default function GeneratePage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [character, setCharacter] = useState<CharacterData>(defaultCharacter);
    const [storyParams, setStoryParams] = useState<StoryParams>(defaultStory);
    const [chatOpen, setChatOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatingStatus, setGeneratingStatus] = useState("Initializing workflow…");

    const buildPayload = useCallback(() => ({
        basicInfo: {
            name: character.basicInfo.name,
            role: character.basicInfo.role || "other",
            age: character.basicInfo.age ? parseInt(character.basicInfo.age) : undefined,
            gender: character.basicInfo.gender || undefined,
            occupation: character.basicInfo.occupation || undefined,
            background: character.basicInfo.background || undefined,
        },
        personality: character.personality,
        motivations: character.motivations,
        backstory: {
            origin: character.backstory.origin || undefined,
            keyLifeEvents: character.backstory.keyLifeEvents,
            traumaOrTurningPoints: character.backstory.traumaOrTurningPoints,
            relationshipsInfluence: [],
        },
        relationships: character.relationships,
        characterArc: {
            startingState: character.characterArc.startingState || "Unknown",
            challenges: character.characterArc.challenges,
            transformation: character.characterArc.transformation || undefined,
            endingState: character.characterArc.endingState || undefined,
        },
        dialogueStyle: {
            tone: character.dialogueStyle.tone || undefined,
            speechPatterns: character.dialogueStyle.speechPatterns,
            vocabularyLevel: (character.dialogueStyle.vocabularyLevel as "simple" | "casual" | "formal" | "technical" | "poetic") || undefined,
        },
        narrativeFunction: {
            storyPurpose: character.narrativeFunction.storyPurpose || "To drive the story forward",
            themesRepresented: character.narrativeFunction.themesRepresented,
            keyConflictsInvolved: character.narrativeFunction.keyConflictsInvolved,
        },
        metadata: {
            genre: character.metadata.genre || undefined,
            worldSetting: character.metadata.worldSetting || undefined,
            notes: character.metadata.notes || undefined,
        },
    }), [character]);

    const runWorkflow = useCallback(async () => {
        setStep(4);
        setError(null);

        try {
            // 1. Start the workflow
            setGeneratingStatus("Starting workflow…");
            const startRes = await fetch(`${MASTRA_URL}/api/workflows/fiction-generation-workflow/start-async`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inputData: buildPayload() }),
            });

            if (!startRes.ok) {
                const text = await startRes.text();
                throw new Error(`Failed to start workflow: ${startRes.status} — ${text}`);
            }

            const { runId } = await startRes.json() as { runId: string };

            // 2. Resume step 1 (character data approval)
            setGeneratingStatus("Approving character data…");
            await new Promise(r => setTimeout(r, 1200));

            const resume1Res = await fetch(`${MASTRA_URL}/api/workflows/fiction-generation-workflow/${runId}/resume`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    stepId: "collect-character-data",
                    resumeData: {
                        reviewer: { name: "User", role: "author" },
                        reviewContext: { entityType: "character", entityId: character.basicInfo.name || "character" },
                        reviewStatus: "approved",
                        feedback: { summary: "Approved", strengths: [], issues: [], suggestedChanges: [] },
                        decisions: { allowAgentContinuation: true, requireHumanApprovalNextStep: false, lockedFields: [] },
                        revisionInstructions: { regenerateSections: [], preserveSections: [], additionalConstraints: [] },
                    },
                }),
            });

            if (!resume1Res.ok) {
                const text = await resume1Res.text();
                throw new Error(`Failed to resume step 1: ${resume1Res.status} — ${text}`);
            }

            // 3. Wait for character development agent to run
            setGeneratingStatus("Building character profile with AI…");
            await new Promise(r => setTimeout(r, 3000));

            // 4. Resume step 3 (story parameters)
            setGeneratingStatus("Providing story parameters…");
            await new Promise(r => setTimeout(r, 800));

            const resume2Res = await fetch(`${MASTRA_URL}/api/workflows/fiction-generation-workflow/${runId}/resume`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    stepId: "collect-story-parameters",
                    resumeData: {
                        reviewStatus: "approved",
                        storyParameters: {
                            genre: storyParams.genre || "fantasy",
                            setting: storyParams.setting,
                            plotPremise: storyParams.plotPremise,
                            tone: storyParams.tone || undefined,
                            targetAudience: storyParams.targetAudience || undefined,
                            chapterCount: storyParams.chapterCount,
                            additionalNotes: storyParams.additionalNotes || undefined,
                        },
                    },
                }),
            });

            if (!resume2Res.ok) {
                const text = await resume2Res.text();
                throw new Error(`Failed to resume step 3: ${resume2Res.status} — ${text}`);
            }

            // 5. Poll for completion
            setGeneratingStatus("Writing your story… (this may take a minute)");

            let result: { title: string; story: string; chapterBreakdown?: Array<{ chapterNumber: number; chapterTitle: string; summary: string }> } | null = null;
            let attempts = 0;
            const maxAttempts = 60;

            while (!result && attempts < maxAttempts) {
                await new Promise(r => setTimeout(r, 3000));
                attempts++;

                const statusRes = await fetch(`${MASTRA_URL}/api/workflows/fiction-generation-workflow/runs/${runId}`);
                if (statusRes.ok) {
                    const data = await statusRes.json() as {
                        status?: string;
                        result?: { title: string; story: string; chapterBreakdown?: Array<{ chapterNumber: number; chapterTitle: string; summary: string }> };
                        output?: { title: string; story: string; chapterBreakdown?: Array<{ chapterNumber: number; chapterTitle: string; summary: string }> };
                    };
                    if (data.status === "completed" || data.status === "success") {
                        result = data.result ?? data.output ?? null;
                    } else if (data.status === "failed" || data.status === "error") {
                        throw new Error("Workflow failed during story generation.");
                    }
                }

                setGeneratingStatus(`Writing your story… (${attempts * 3}s elapsed)`);
            }

            if (!result) {
                throw new Error("Story generation timed out. Please try again.");
            }

            // 6. Save and navigate
            localStorage.setItem("storyforge_story", JSON.stringify(result));
            router.push("/read");

        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
            setStep(3);
        }
    }, [buildPayload, character.basicInfo.name, storyParams, router]);

    const canProceed = () => {
        if (step === 0) return character.basicInfo.name.trim() && character.basicInfo.role;
        if (step === 3) return storyParams.genre && storyParams.setting.trim() && storyParams.plotPremise.trim();
        return true;
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Navbar */}
            <nav style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 40px",
                borderBottom: "1px solid var(--border)",
                background: "rgba(10,11,15,0.9)",
                backdropFilter: "blur(12px)",
                position: "sticky", top: 0, zIndex: 50,
            }}>
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                    <span style={{ fontSize: 20 }}>📖</span>
                    <span className="font-serif" style={{ fontSize: 20, fontWeight: 700, color: "var(--gold)" }}>StoryForge</span>
                </Link>
                <button className="btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => setChatOpen(!chatOpen)}>
                    💬 AI Help
                </button>
            </nav>

            <div style={{ flex: 1, display: "flex" }}>
                {/* Main content */}
                <div style={{ flex: 1, padding: "48px 40px", maxWidth: chatOpen ? "calc(100% - 380px)" : "100%", transition: "max-width 0.3s" }}>
                    {/* Step Indicator */}
                    {step < 4 && (
                        <div style={{ maxWidth: 700, margin: "0 auto 48px" }}>
                            <div className="step-indicator">
                                {STEPS.slice(0, 4).map((label, i) => (
                                    <div key={label} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : "none" }}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                                            <div className={`step-dot ${i < step ? "completed" : i === step ? "active" : "pending"}`}>
                                                {i < step ? "✓" : i + 1}
                                            </div>
                                            <span style={{ fontSize: 11, color: i === step ? "var(--gold)" : "var(--text-muted)", whiteSpace: "nowrap" }}>{label}</span>
                                        </div>
                                        {i < 3 && <div className={`step-line ${i < step ? "completed" : ""}`} style={{ margin: "0 8px", marginBottom: 20 }} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step Content */}
                    <div style={{ maxWidth: 700, margin: "0 auto" }}>
                        {error && (
                            <div style={{ padding: 16, background: "rgba(220,50,50,0.1)", border: "1px solid rgba(220,50,50,0.3)", borderRadius: "var(--radius-md)", marginBottom: 24, color: "#ff7070" }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="card" style={{ padding: 40 }}>
                            {step === 0 && <Step1BasicInfo data={character} onChange={setCharacter} />}
                            {step === 1 && <Step2Personality data={character} onChange={setCharacter} />}
                            {step === 2 && <Step3Arc data={character} onChange={setCharacter} />}
                            {step === 3 && <Step4Story params={storyParams} onChange={setStoryParams} />}
                            {step === 4 && (
                                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                                    <div style={{ fontSize: 64, marginBottom: 24, animation: "float 3s ease-in-out infinite" }}>✍️</div>
                                    <h2 className="font-serif" style={{ fontSize: 32, marginBottom: 16 }}>
                                        <span className="gold-shimmer">Crafting Your Story…</span>
                                    </h2>
                                    <p style={{ color: "var(--text-secondary)", marginBottom: 32, fontSize: 16 }}>{generatingStatus}</p>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
                                    </div>
                                    <p style={{ color: "var(--text-muted)", marginTop: 32, fontSize: 13 }}>
                                        The AI is building your character and writing your story. This typically takes 30–90 seconds.
                                    </p>
                                </div>
                            )}

                            {/* Navigation */}
                            {step < 4 && (
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
                                    <button
                                        className="btn-ghost"
                                        onClick={() => step > 0 ? setStep(step - 1) : router.push("/")}
                                        style={{ padding: "12px 24px" }}
                                    >
                                        ← {step === 0 ? "Home" : "Back"}
                                    </button>
                                    <button
                                        className="btn-primary"
                                        disabled={!canProceed()}
                                        onClick={() => step < 3 ? setStep(step + 1) : runWorkflow()}
                                        style={{ opacity: canProceed() ? 1 : 0.4, cursor: canProceed() ? "pointer" : "not-allowed" }}
                                    >
                                        {step === 3 ? "✨ Generate Story" : "Next →"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* CopilotChat Sidebar */}
                {chatOpen && (
                    <div style={{
                        width: 380, flexShrink: 0,
                        borderLeft: "1px solid var(--border-accent)",
                        background: "var(--bg-surface)",
                        display: "flex", flexDirection: "column",
                        position: "sticky", top: 57, height: "calc(100vh - 57px)",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
                            <span className="font-serif" style={{ fontSize: 16, color: "var(--gold)" }}>AI Writing Assistant</span>
                            <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 18 }}>✕</button>
                        </div>
                        <div style={{ flex: 1, overflow: "hidden" }}>
                            <CopilotChat
                                labels={{ title: "Writing Assistant", initial: "Need help with your character or story? Ask me anything — I can suggest traits, plot ideas, or backstory details!" }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
