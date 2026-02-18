import { createWorkflow, createStep } from "@mastra/core/workflows";
import {
    CharacterDevelopmentSchema,
    CharacterDevelopmentResumeSchema,
    CharacterDevelopmentSuspendSchema,
    FictionStoryInputSchema,
    FictionStoryOutputSchema,
    FictionResumeSchema,
    FictionSuspendSchema,
} from "../../schema/character-dev";
import { mastra } from "..";
import z from "zod";

// ─── Step 1: Collect Character Data (Human-in-Loop) ─────────────────────────
// Suspends immediately so the user can review/approve the character input data.
// On resume, passes the character data forward to step 2.

const collectCharacterDataStep = createStep({
    id: "collect-character-data",
    inputSchema: CharacterDevelopmentSchema,
    outputSchema: CharacterDevelopmentSchema,
    resumeSchema: CharacterDevelopmentResumeSchema,
    suspendSchema: CharacterDevelopmentSuspendSchema,
    execute: async ({ inputData, resumeData, suspend }) => {
        const { name } = inputData.basicInfo;
        const isApproved = resumeData?.reviewStatus === "approved";

        if (!isApproved) {
            await suspend({
                context: {
                    entityType: "character",
                    entityId: name ?? "unknown",
                    workflowStage: "collect-character-data",
                },
                suspendReason: "awaiting_approval",
                description:
                    "Please review the character data below and approve to proceed with character development.",
                requiredHumanAction: {
                    actionType: "approve",
                    instructions:
                        "Review the character information and resume with reviewStatus: 'approved' to continue.",
                    requiredFields: ["reviewStatus"],
                },
                currentStateSnapshot: {
                    lastCompletedStep: "",
                    pendingSteps: [
                        "build-character-profile",
                        "collect-story-parameters",
                        "generate-fiction-story",
                    ],
                    partialOutput: inputData,
                },
                resumeConditions: {
                    requiredInputs: ["reviewStatus"],
                    approvalRequiredFrom: [],
                    autoResumeAllowed: false,
                },
                priority: "medium",
            });
        }

        // Pass character data through to the next step
        return inputData;
    },
});

// ─── Step 2: Build Character Profile (Character Development Agent) ───────────
// Runs the characterDevelopmentAgent to produce a rich character profile.

const buildCharacterProfileStep = createStep({
    id: "build-character-profile",
    inputSchema: CharacterDevelopmentSchema,
    outputSchema: z.object({
        characterProfile: z.string(),
        characterName: z.string(),
    }),
    execute: async ({ inputData }) => {
        const characterDevelopmentAgent = mastra.getAgent(
            "characterDevelopmentAgent"
        );
        if (!characterDevelopmentAgent) {
            throw new Error("Character Development Agent not found");
        }

        const characterData = inputData;

        const prompt = `
You are a fiction character development agent.

Generate a fully developed fictional character using the following structured requirements.
Return a comprehensive, narrative-style character profile that can be used directly by a fiction writer.

=== BASIC INFO ===
Name: ${characterData.basicInfo.name}
Role: ${characterData.basicInfo.role}
Age: ${characterData.basicInfo.age ?? "Not specified"}
Gender: ${characterData.basicInfo.gender ?? "Not specified"}
Occupation: ${characterData.basicInfo.occupation ?? "Not specified"}
Background: ${characterData.basicInfo.background ?? "Not specified"}

=== PERSONALITY ===
Traits: ${characterData.personality.traits.join(", ") || "None"}
Strengths: ${characterData.personality.strengths.join(", ") || "None"}
Flaws: ${characterData.personality.flaws.join(", ") || "None"}
Fears: ${characterData.personality.fears.join(", ") || "None"}
Desires: ${characterData.personality.desires.join(", ") || "None"}
Internal Conflicts: ${characterData.personality.internalConflicts.join(", ") || "None"}

=== MOTIVATIONS ===
Short Term Goals: ${characterData.motivations.shortTermGoals.join(", ") || "None"}
Long Term Goals: ${characterData.motivations.longTermGoals.join(", ") || "None"}
Driving Force: ${characterData.motivations.drivingForce ?? "Not specified"}

=== BACKSTORY ===
Origin: ${characterData.backstory.origin ?? "Not specified"}
Key Life Events: ${characterData.backstory.keyLifeEvents.join(", ") || "None"}
Trauma / Turning Points: ${characterData.backstory.traumaOrTurningPoints.join(", ") || "None"}

=== RELATIONSHIPS ===
${characterData.relationships.length
                ? characterData.relationships
                    .map(
                        (r) =>
                            `${r.characterName} (${r.relationshipType}) - ${r.emotionalDynamic ?? "No details"}`
                    )
                    .join("\n")
                : "None"
            }

=== CHARACTER ARC ===
Starting State: ${characterData.characterArc.startingState}
Challenges: ${characterData.characterArc.challenges.join(", ") || "None"}
Transformation: ${characterData.characterArc.transformation ?? "Not specified"}
Ending State: ${characterData.characterArc.endingState ?? "Not specified"}

=== DIALOGUE STYLE ===
Tone: ${characterData.dialogueStyle.tone ?? "Not specified"}
Speech Patterns: ${characterData.dialogueStyle.speechPatterns.join(", ") || "None"}
Vocabulary Level: ${characterData.dialogueStyle.vocabularyLevel ?? "Not specified"}

=== NARRATIVE FUNCTION ===
Purpose: ${characterData.narrativeFunction.storyPurpose}
Themes: ${characterData.narrativeFunction.themesRepresented.join(", ") || "None"}
Conflicts: ${characterData.narrativeFunction.keyConflictsInvolved.join(", ") || "None"}

=== METADATA ===
Genre: ${characterData.metadata?.genre ?? "Not specified"}
World Setting: ${characterData.metadata?.worldSetting ?? "Not specified"}
Notes: ${characterData.metadata?.notes ?? "None"}
`;

        const response = await characterDevelopmentAgent.generate([
            { role: "user", content: prompt },
        ]);

        return {
            characterProfile: response.text,
            characterName: characterData.basicInfo.name,
        };
    },
});

// ─── Step 3: Collect Story Parameters (Human-in-Loop) ───────────────────────
// Suspends so the user can provide story parameters (genre, setting, plot, etc.)
// before the fiction writing agent generates the story.

const collectStoryParametersStep = createStep({
    id: "collect-story-parameters",
    inputSchema: z.object({
        characterProfile: z.string(),
        characterName: z.string(),
    }),
    outputSchema: z.object({
        characterProfile: z.string(),
        characterName: z.string(),
        storyParameters: FictionStoryInputSchema,
    }),
    resumeSchema: FictionResumeSchema,
    suspendSchema: FictionSuspendSchema,
    execute: async ({ inputData, resumeData, suspend }) => {
        const { characterName, characterProfile } = inputData;
        const isApproved = resumeData?.reviewStatus === "approved";

        if (!isApproved || !resumeData?.storyParameters) {
            await suspend({
                context: {
                    entityType: "character",
                    entityId: characterName,
                    workflowStage: "collect-story-parameters",
                },
                suspendReason: "awaiting_human_input",
                description:
                    "Character profile has been built. Please provide story parameters to generate the fiction story.",
                requiredHumanAction: {
                    actionType: "supply_data",
                    instructions:
                        "Resume with reviewStatus: 'approved' and storyParameters containing: genre, setting, plotPremise, tone (optional), targetAudience (optional), chapterCount (optional), additionalNotes (optional).",
                    requiredFields: ["reviewStatus", "storyParameters"],
                },
                currentStateSnapshot: {
                    lastCompletedStep: "build-character-profile",
                    pendingSteps: ["generate-fiction-story"],
                    partialOutput: { characterProfile },
                },
                resumeConditions: {
                    requiredInputs: ["reviewStatus", "storyParameters"],
                    approvalRequiredFrom: [],
                    autoResumeAllowed: false,
                },
                priority: "medium",
            });
        }

        return {
            characterProfile,
            characterName,
            storyParameters: resumeData!.storyParameters!,
        };
    },
});

// ─── Step 4: Generate Fiction Story (Fiction Writing Agent) ──────────────────
// Uses the fictionWritingAgent to produce the full story based on the
// developed character profile and user-supplied story parameters.

const generateFictionStoryStep = createStep({
    id: "generate-fiction-story",
    inputSchema: z.object({
        characterProfile: z.string(),
        characterName: z.string(),
        storyParameters: FictionStoryInputSchema,
    }),
    outputSchema: FictionStoryOutputSchema,
    execute: async ({ inputData }) => {
        const fictionWritingAgent = mastra.getAgent("fictionWritingAgent");
        if (!fictionWritingAgent) {
            throw new Error("Fiction Writing Agent not found");
        }

        const { characterProfile, characterName, storyParameters } = inputData;
        const {
            genre,
            setting,
            plotPremise,
            tone,
            targetAudience,
            chapterCount,
            additionalNotes,
        } = storyParameters;

        const prompt = `
You are a professional fiction writer. Write a complete, engaging fiction story based on the character and story parameters provided below.

=== MAIN CHARACTER PROFILE ===
${characterProfile}

=== STORY PARAMETERS ===
Genre: ${genre.replace("_", " ")}
Setting: ${setting}
Plot Premise: ${plotPremise}
Tone: ${tone ?? "Not specified"}
Target Audience: ${targetAudience?.replace("_", " ") ?? "General"}
Number of Chapters: ${chapterCount ?? 3}
Additional Notes: ${additionalNotes ?? "None"}

=== INSTRUCTIONS ===
1. Write a complete story with ${chapterCount ?? 3} chapters.
2. The main character is "${characterName}" — use the character profile above to ensure consistency.
3. Begin with a compelling opening that establishes the setting and introduces the character.
4. Build rising tension through the middle chapters.
5. Deliver a satisfying climax and resolution in the final chapter.
6. Use vivid, immersive language appropriate for the ${genre.replace("_", " ")} genre.
7. Show character emotions and growth through actions and dialogue, not exposition.

Format your response as:
TITLE: [Story Title]

[Full story text with clearly labeled chapters: "Chapter 1: [Title]", "Chapter 2: [Title]", etc.]
`;

        const response = await fictionWritingAgent.generate([
            { role: "user", content: prompt },
        ]);

        const rawText = response.text;

        // Parse title from the response
        const titleMatch = rawText.match(/^TITLE:\s*(.+)/m);
        const title =
            titleMatch && titleMatch[1]
                ? titleMatch[1].trim()
                : `${characterName}'s Story`;

        // Parse chapter breakdown
        const chapterMatches = [
            ...rawText.matchAll(/Chapter\s+(\d+):\s*([^\n]+)/gi),
        ];
        const chapterBreakdown =
            chapterMatches.length > 0
                ? chapterMatches
                    .filter((match) => match[1] != null && match[2] != null)
                    .map((match) => ({
                        chapterNumber: parseInt(match[1] as string, 10),
                        chapterTitle: (match[2] as string).trim(),
                        summary: `Chapter ${match[1]} of the story.`,
                    }))
                : undefined;

        return {
            title,
            story: rawText,
            chapterBreakdown,
        };
    },
});

// ─── Workflow Definition ─────────────────────────────────────────────────────

const workflow = createWorkflow({
    id: "fiction-generation-workflow",
    inputSchema: CharacterDevelopmentSchema,
    outputSchema: FictionStoryOutputSchema,
})
    .then(collectCharacterDataStep)
    .then(buildCharacterProfileStep)
    .then(collectStoryParametersStep)
    .then(generateFictionStoryStep)
    .commit();

export const fictionWorkflow: ReturnType<typeof createWorkflow> = workflow;