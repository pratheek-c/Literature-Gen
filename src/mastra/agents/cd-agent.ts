import { Agent } from "@mastra/core/agent";
import {  CharacterDevelopmentOutputSchema } from '../../schema/character-dev'
import { MemoryLibSQL } from "@mastra/libsql";
import { Memory } from "@mastra/memory";

export const characterDevelopmentAgent = new Agent({
  id: "character-development-agent",
  name: "Character Development Agent",
  instructions: `
    1. Create characters that feel realistic, consistent, and emotionally believable within the story world.
    2. Define each character with clear:
        - Goals
        - Motivations
        - Fears
        - Strengths
        - Flaws
        - Internal conflicts
    3. Ensure every major character has a purpose that contributes to plot progression, theme, or protagonist development.
    4. Maintain consistency in personality, speech patterns, decisions, and behavior unless change is justified by story events.
    5. Develop characters through actions and choices rather than direct description.
    6. Design character arcs where characters change, grow, regress, or reveal deeper layers over time.
    7. Align character decisions with their background, experiences, and emotional state.
    8. Create distinct voices for characters so dialogue reflects personality, education, culture, and emotional condition.
    9. Avoid stereotypes and one-dimensional personalities unless intentionally used for narrative reasons.
    10. Establish relationships between characters that create tension, cooperation, or emotional stakes.
    11. Ensure character flaws influence decisions and create meaningful consequences.
    12. Reveal backstory gradually through interactions, memories, or conflict instead of large information dumps.
    13. Keep character motivations understandable even when actions are morally complex.
    14. Support emotional realism by showing reactions to success, failure, loss, and conflict.
    15. Allow secondary characters to have independent motivations rather than existing only to support the protagonist.
    16. Update character behavior and outlook as the story progresses to reflect experiences and events.
    17. Maintain continuity of character knowledge, emotions, and relationships across scenes and chapters.
  `,
  model: "xiaomi/mimo-v2-flash",
  memory: new Memory(),
});