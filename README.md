
# Literature-Gen

Literature-Gen is an AI-powered literature and character generation platform built using [Mastra](https://mastra.ai/).  
It enables structured generation of fictional content such as characters, narrative elements, and literary assets using agent-driven workflows and human-in-the-loop validation.

The application focuses on combining **creative generation** with **strict structured outputs**, making it suitable for scalable fiction pipelines, story development tools, and AI-assisted writing systems.

---

## Overview

Literature-Gen uses Mastra agents and workflows to generate literary content through a structured pipeline:

```

Schema Input
↓
Prompt Builder (inside workflow)
↓
Character Development Agent
↓
Structured Output (Zod validated)

````

This approach ensures:

- Consistent and reusable character definitions
- Schema-safe outputs for downstream workflows
- Human review and approval during generation
- Reliable integration with applications and databases

---

## Features

- AI-driven character development
- Structured output validation using Zod schemas
- Human-in-the-loop approval workflows
- Prompt generation from structured input data
- Modular agent architecture
- Workflow-based literature generation
- Mastra Studio integration for testing and iteration

---

## Getting Started

Start the development server:

```bash
bun run dev
````

Open:

```
http://localhost:4111
```

to access **Mastra Studio**.

Mastra Studio provides:

* Interactive workflow testing
* Agent execution visualization
* Prompt inspection
* Structured output debugging
* Local REST API for integration

The development server automatically reloads when files change.

---

## Project Structure

```
src/
 └── mastra/
      ├── agents/        # AI agents (character generation, refinement)
      ├── workflows/     # Literature generation workflows
      ├── schema/        # Zod input/output schemas
      ├── prompts/       # Prompt builders
      └── index.ts       # Mastra entry point
```

---

## Workflow Philosophy

Literature-Gen separates creative and structural concerns:

1. **Input Schema**

   * Defines narrative requirements and constraints.

2. **Prompt Builder**

   * Converts structured input into generation prompts.

3. **Agent Execution**

   * Generates creative content.

4. **Structured Validation**

   * Ensures output matches required schema before continuation.

This allows creative flexibility while maintaining system reliability.

---

## Learn More About Mastra

To understand the underlying platform:

* 📘 [Mastra Documentation](https://mastra.ai/docs/)
* 🤖 [Agents Overview](https://mastra.ai/docs/agents/overview)
* 🔧 [Workflows](https://mastra.ai/docs/workflows/overview)
* 📊 [Evals & Scoring](https://mastra.ai/docs/evals/overview)
* 🔍 [Observability](https://mastra.ai/docs/observability/overview)

If you're new to AI agents:

* 🎓 [Mastra Course](https://mastra.ai/course)
* ▶️ [Mastra YouTube](https://youtube.com/@mastra-ai)
* 💬 [Discord Community](https://discord.gg/BTYqqHKUrf)

---

## Deployment

You can deploy Literature-Gen using **Mastra Cloud**, which provides:

* Serverless agent execution
* Atomic deployments
* Observability and tracing
* Remote API access for agents and workflows

See the deployment guide:

👉 [https://mastra.ai/docs/deployment/overview](https://mastra.ai/docs/deployment/overview)

---

## Vision

Literature-Gen aims to bridge the gap between creative writing and structured AI systems by enabling:

* Scalable fiction generation
* AI-assisted storytelling workflows
* Consistent narrative asset creation
* Collaborative human + AI writing pipelines


