import { createWorkflow, createStep } from "@mastra/core/workflows";
import { CharacterDevelopmentSchema, CharacterDevelopmentOutputSchema, CharacterDevelopmentResumeSchema, CharacterDevelopmentSuspendSchema } from '../../schema/character-dev'
import { mastra } from "..";
import z from "zod";

const step1 = createStep({
    id: "character-development-rquirement",
    inputSchema: CharacterDevelopmentSchema,
    outputSchema: z.object({
        activities: z.string(),
      }),
    resumeSchema: CharacterDevelopmentResumeSchema,
    suspendSchema: CharacterDevelopmentSuspendSchema,
    execute: async ({ inputData, resumeData, suspend }) => {
        const { name } = inputData.basicInfo;
        const characterData = inputData;
        // Assuming the approval status is stored in resumeData.reviewStatus.approved (adjust as per your actual schema)
        const isApproved = resumeData?.reviewStatus === "approved";

        if (!isApproved) {
            return await suspend({
                context: {
                    entityType: "character",
                    entityId: name ?? "unknown",
                    workflowStage: "requirement",
                },
                suspendReason: "other",
                description: "",
                requiredHumanAction: {
                    actionType: "approve",
                    instructions: "Please review and approve the character requirements.",
                    requiredFields: []
                },
                currentStateSnapshot: {
                    lastCompletedStep: "",
                    pendingSteps: [],
                },
                resumeConditions: {
                    requiredInputs: [],
                    approvalRequiredFrom: [],
                    autoResumeAllowed: false
                },
                priority: "low"
            });
        }

        const characterDevelopmentAgent = mastra.getAgent("characterDevelopmentAgent");
        if (!characterDevelopmentAgent) {
            throw new Error('character Development agent not found');
        }

        const prompt = `
You are a fiction character development agent.

Generate a fully developed fictional character using the following structured requirements.
Return output strictly matching the output schema.

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
                        r =>
                            `${r.characterName} (${r.relationshipType}) - ${r.emotionalDynamic ?? "No details"
                            }`
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
      {
        role: 'user',
        content: prompt,
      },
    ]);

    return {
      activities: response.text,
    };
    }
});

const workflow = createWorkflow({
    id: "character-development-workflow",
    inputSchema: CharacterDevelopmentSchema,
    outputSchema: z.object({
        activities: z.string(),
      }),
})
    .then(step1)
    .commit();

export const fictionWorkflow: ReturnType<typeof createWorkflow> = workflow;