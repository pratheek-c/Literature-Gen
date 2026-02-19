import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const updateCharacterData = createTool({
    id: "updateCharacterData",
    description: "Update the character's core attributes based on user input. Call this whenever the user provides details about the character.",
    inputSchema: z.object({
        name: z.string().optional(),
        role: z.enum(["protagonist", "antagonist", "supporting", "minor", "mentor", "foil", "sidekick", "other"]).optional(),
        age: z.number().optional(),
        gender: z.string().optional(),
        occupation: z.string().optional(),
        background: z.string().optional(),
        traits: z.array(z.string()).optional(),
        strengths: z.array(z.string()).optional(),
        flaws: z.array(z.string()).optional(),
        fears: z.array(z.string()).optional(),
        desires: z.array(z.string()).optional(),
    }),
    execute: async (input) => {
        // This is a client-side tool in CopilotKit context, but we define it here for Mastra agent typing.
        // The actual state update happens in the frontend via useCopilotAction.
        return { success: true, updatedFields: Object.keys(input) };
    },
});

export const updateStoryParams = createTool({
    id: "updateStoryParams",
    description: "Update the story's genre, setting, or plot premise.",
    inputSchema: z.object({
        genre: z.enum([
            "fantasy",
            "science_fiction",
            "mystery",
            "thriller",
            "romance",
            "horror",
            "historical_fiction",
            "adventure",
            "literary_fiction",
            "other",
        ]).optional(),
        setting: z.string().optional(),
        plotPremise: z.string().optional(),
        tone: z.enum(["dark", "lighthearted", "dramatic", "humorous", "suspenseful", "romantic", "neutral"]).optional(),
        chapterCount: z.number().min(1).max(10).optional(),
    }),
    execute: async (input) => {
        return { success: true, updatedFields: Object.keys(input) };
    },
});

export const triggerFictionGeneration = createTool({
    id: "triggerFictionGeneration",
    description: "Trigger the final fiction story generation once all character and story details are collected.",
    inputSchema: z.object({
        confirm: z.boolean().describe("Confirm that you have collected all necessary information and are ready to generate the story."),
    }),
    execute: async (input) => {
        return { success: true, message: "Generation triggered" };
    },
});
