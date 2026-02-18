import { z } from "zod";

/**
 * Character Development Input Schema
 * Used for defining structured input for a character development agent
 */

export const CharacterDevelopmentSchema = z.object({
  characterId: z.string().optional(),

  basicInfo: z.object({
    name: z.string(),
    age: z.number().int().nonnegative().optional(),
    gender: z.string().optional(),
    role: z.enum([
      "protagonist",
      "antagonist",
      "supporting",
      "minor",
      "mentor",
      "foil",
      "sidekick",
      "other"
    ]),
    occupation: z.string().optional(),
    background: z.string().optional(),
  }),

  personality: z.object({
    traits: z.array(z.string()).default([]),
    strengths: z.array(z.string()).default([]),
    flaws: z.array(z.string()).default([]),
    fears: z.array(z.string()).default([]),
    desires: z.array(z.string()).default([]),
    internalConflicts: z.array(z.string()).default([]),
  }),

  motivations: z.object({
    shortTermGoals: z.array(z.string()).default([]),
    longTermGoals: z.array(z.string()).default([]),
    drivingForce: z.string().optional(),
  }),

  backstory: z.object({
    origin: z.string().optional(),
    keyLifeEvents: z.array(z.string()).default([]),
    traumaOrTurningPoints: z.array(z.string()).default([]),
    relationshipsInfluence: z.array(z.string()).default([]),
  }),

  relationships: z.array(
    z.object({
      characterName: z.string(),
      relationshipType: z.string(),
      emotionalDynamic: z.string().optional(),
      conflictLevel: z.enum(["low", "medium", "high"]).optional(),
    })
  ).default([]),

  characterArc: z.object({
    startingState: z.string(),
    challenges: z.array(z.string()).default([]),
    transformation: z.string().optional(),
    endingState: z.string().optional(),
  }),

  dialogueStyle: z.object({
    tone: z.string().optional(),
    speechPatterns: z.array(z.string()).default([]),
    vocabularyLevel: z.enum([
      "simple",
      "casual",
      "formal",
      "technical",
      "poetic"
    ]).optional(),
  }),

  narrativeFunction: z.object({
    storyPurpose: z.string(),
    themesRepresented: z.array(z.string()).default([]),
    keyConflictsInvolved: z.array(z.string()).default([]),
  }),

  metadata: z.object({
    genre: z.string().optional(),
    worldSetting: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
});

export type CharacterDevelopmentInput = z.infer<
  typeof CharacterDevelopmentSchema
>;

// Output 

export const CharacterDevelopmentOutputSchema = z.object({
  characterId: z.string().optional(),

  summary: z.object({
    name: z.string(),
    role: z.string(),
    archetype: z.string().optional(),
    oneLineDescription: z.string(),
    narrativeImportance: z.enum([
      "primary",
      "secondary",
      "supporting",
      "minor"
    ]),
  }),

  profile: z.object({
    personalityOverview: z.string(),
    coreTraits: z.array(z.string()),
    strengths: z.array(z.string()),
    flaws: z.array(z.string()),
    fears: z.array(z.string()),
    desires: z.array(z.string()),
    internalConflict: z.string().optional(),
  }),

  motivations: z.object({
    externalGoals: z.array(z.string()),
    internalNeeds: z.array(z.string()),
    stakes: z.string(),
    obstacles: z.array(z.string()),
  }),

  backstorySummary: z.object({
    originSummary: z.string().optional(),
    definingEvents: z.array(z.string()),
    psychologicalImpact: z.string().optional(),
  }),

  relationships: z.array(
    z.object({
      characterName: z.string(),
      relationshipType: z.string(),
      emotionalDynamic: z.string(),
      tensionSource: z.string().optional(),
      evolution: z.string().optional(),
    })
  ),

  characterArc: z.object({
    arcType: z.enum([
      "positive",
      "negative",
      "flat",
      "tragic",
      "redemption",
      "corruption",
      "growth"
    ]),
    startingState: z.string(),
    keyTurningPoints: z.array(z.string()),
    internalChange: z.string(),
    endingState: z.string(),
    lessonOrRealization: z.string().optional(),
  }),

  behavioralGuidelines: z.object({
    decisionMakingStyle: z.string(),
    stressResponse: z.string(),
    conflictBehavior: z.string(),
    moralAlignment: z.string().optional(),
  }),

  dialogueProfile: z.object({
    voiceDescription: z.string(),
    speechPatterns: z.array(z.string()),
    emotionalExpression: z.string(),
    typicalTone: z.string(),
  }),

  narrativeUsage: z.object({
    primaryConflicts: z.array(z.string()),
    thematicContribution: z.array(z.string()),
    roleInKeyScenes: z.array(z.string()),
  }),

  consistencyRules: z.array(z.string()),

  generationNotes: z.string().optional(),
});

export type CharacterDevelopmentOutput = z.infer<
  typeof CharacterDevelopmentOutputSchema
>;

// Resume Schema

export const CharacterDevelopmentResumeSchema = z.object({
  reviewId: z.string().optional(),

  reviewer: z.object({
    name: z.string(),
    role: z.enum([
      "author",
      "editor",
      "story_designer",
      "character_designer",
      "producer",
      "reviewer",
      "other",
    ]),
    notes: z.string().optional(),
  }),

  reviewContext: z.object({
    entityType: z.enum([
      "character",
      "plot",
      "chapter",
      "dialogue",
      "worldbuilding",
      "other",
    ]),
    entityId: z.string(),
    version: z.string().optional(),
  }),

  reviewStatus: z.enum([
    "pending",
    "approved",
    "approved_with_changes",
    "needs_revision",
    "rejected",
  ]),

  feedback: z.object({
    summary: z.string(),
    strengths: z.array(z.string()).default([]),
    issues: z.array(z.string()).default([]),
    suggestedChanges: z.array(
      z.object({
        field: z.string(),
        currentValue: z.any().optional(),
        suggestedValue: z.any().optional(),
        reason: z.string(),
        priority: z.enum(["low", "medium", "high"]),
      })
    ).default([]),
  }),

  decisions: z.object({
    allowAgentContinuation: z.boolean(),
    requireHumanApprovalNextStep: z.boolean().default(false),
    lockedFields: z.array(z.string()).default([]),
  }),

  revisionInstructions: z.object({
    regenerateSections: z.array(z.string()).default([]),
    preserveSections: z.array(z.string()).default([]),
    additionalConstraints: z.array(z.string()).default([]),
  }),

  metadata: z.object({
    reviewedAt: z.string().datetime().optional(),
    nextReviewRequired: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }).optional(),
});

export type CharacterDevelopmentResume = z.infer<
  typeof CharacterDevelopmentResumeSchema
>;


// Suspend Schema

/**
 * Human-in-the-Loop Suspend Schema
 * Used when an agent workflow must pause execution due to
 * missing information, human review requirement, or external dependency.
 */

export const CharacterDevelopmentSuspendSchema = z.object({
  suspendId: z.string().optional(),

  context: z.object({
    entityType: z.enum([
      "character",
      "plot",
      "chapter",
      "dialogue",
      "worldbuilding",
      "workflow",
      "other",
    ]),
    entityId: z.string(),
    workflowStage: z.string(),
    version: z.string().optional(),
  }),

  suspendReason: z.enum([
    "awaiting_human_input",
    "awaiting_approval",
    "missing_information",
    "conflicting_instructions",
    "quality_check_required",
    "external_dependency",
    "manual_intervention_required",
    "other",
  ]),

  description: z.string(),

  requiredHumanAction: z.object({
    actionType: z.enum([
      "provide_input",
      "approve",
      "edit",
      "clarify",
      "resolve_conflict",
      "supply_data",
      "review",
      "other",
    ]),
    instructions: z.string(),
    requiredFields: z.array(z.string()).default([]),
  }),

  currentStateSnapshot: z.object({
    lastCompletedStep: z.string(),
    pendingSteps: z.array(z.string()).default([]),
    partialOutput: z.any().optional(),
  }),

  resumeConditions: z.object({
    requiredInputs: z.array(z.string()).default([]),
    approvalRequiredFrom: z.array(z.string()).default([]),
    autoResumeAllowed: z.boolean().default(false),
  }),

  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),

  metadata: z.object({
    suspendedAt: z.string().datetime().optional(),
    expectedResumeBy: z.string().datetime().optional(),
    tags: z.array(z.string()).default([]),
    notes: z.string().optional(),
  }).optional(),
});

export type CharacterDevelopmentSuspend = z.infer<
  typeof CharacterDevelopmentSuspendSchema
>;