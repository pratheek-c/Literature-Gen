# Literature-Gen

Literature-Gen is an AI-powered literature and character generation platform built using [Mastra](https://mastra.ai/) and [CopilotKit](https://copilotkit.ai/).  
It enables structured generation of fictional content such as characters, narrative elements, and literary assets using agent-driven workflows, AI-powered chat interfaces, and human-in-the-loop validation.

The application focuses on combining **creative generation** with **strict structured outputs**, making it suitable for scalable fiction pipelines, story development tools, and AI-assisted writing systems. It features an interactive chat interface powered by CopilotKit for seamless user interaction with AI agents.

---

## Architecture Overview

Literature-Gen uses a full-stack architecture combining Mastra backend agents with a CopilotKit-powered frontend:

```
Frontend (CopilotKit UI)
        ↓
   Chat Interface
        ↓
Mastra Server (/chat endpoint)
        ↓
Character Development Agent
        ↓
Structured Output (Zod validated)
```

**Data Flow:**
1. User inputs are sent through the CopilotKit chat interface
2. Requests are processed by Mastra agents on the backend
3. Agents execute workflows with structured schemas
4. Results are validated and returned to the frontend
5. Traces and observability data are persisted to LibSQL storage

This architecture ensures:

- Consistent and reusable character definitions
- Schema-safe outputs for downstream workflows
- Real-time AI chat interface with CopilotKit
- Full observability and tracing capabilities
- Reliable integration with applications and databases

---

## Features

- **AI-powered Character Development** - Generate detailed, structured characters using natural language
- **CopilotKit Chat Interface** - Interactive chat UI for seamless user interactions
- **Multiple Agents** - Character development, fiction generation, and weather agents
- **Structured Workflows** - Reusable workflows for consistent content generation
- **Zod Schema Validation** - Ensure all outputs match required schemas
- **Eval & Scoring** - Built-in scoring functions for quality assessment
- **Observability & Tracing** - Full request tracing and monitoring via LibSQL storage
- **Mastra Studio Integration** - Visual debugging and workflow testing
- **Full-Stack Type Safety** - TypeScript across frontend and backend
- **Serverless Ready** - Deploy to Mastra Cloud for production use

---

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm/yarn/bun package manager
- Environment variables configured

### Setup & Development

1. **Install dependencies for both packages:**
   ```bash
   npm install
   cd mastra-server && npm install && cd ../book-gen && npm install
   ```

2. **Start the Mastra backend server:**
   ```bash
   cd mastra-server
   bun run dev
   # Server runs on http://localhost:4111
   ```

3. **In a new terminal, start the Next.js frontend:**
   ```bash
   cd book-gen
   bun run dev
   # Frontend runs on http://localhost:3000
   ```

4. **Access the application:**
   - Frontend UI: `http://localhost:3000`
   - Mastra Studio: `http://localhost:4111`

### CopilotKit Integration

The `/chat` endpoint is configured in the Mastra server to handle CopilotKit requests:

```typescript
// mastra-server/src/mastra/index.ts
apiRoutes: [
  registerCopilotKit({
    path: '/chat',
    resourceId: 'characterDevelopmentAgent'
  })
]
```

This enables:
- Real-time AI chat interface
- Agent execution through CopilotKit
- Structured input/output handling
- Message streaming and live updates

---

## Project Structure

The project is organized into two main components:

### `mastra-server/` - Backend AI Engine

```
mastra-server/
 └── src/
      ├── mastra/
      │    ├── agents/           # AI agents (character development, fiction, weather, etc.)
      │    ├── workflows/        # Literature and weather generation workflows
      │    ├── scorers/          # Scoring functions for eval and validation
      │    ├── tools/            # External tools (weather API integration)
      │    ├── public/           # Static assets
      │    └── index.ts          # Mastra instance with CopilotKit integration
      └── schema/
           └── character-dev.ts   # Zod schemas for character development
```

**Key Features:**
- Mastra server instance configured with agents, workflows, and scorers
- CopilotKit integration for `/chat` endpoint
- LibSQL-based storage for observability and traces
- Pino logging for debugging and monitoring
- Built-in support for weather workflows and character development

### `book-gen/` - Next.js Frontend Application

```
book-gen/
 ├── app/
 │    ├── layout.tsx        # Root layout
 │    ├── page.tsx          # Main page with CopilotKit UI
 │    └── globals.css       # Global styles
 ├── public/                # Static assets
 ├── next.config.ts         # Next.js configuration
 ├── tsconfig.json          # TypeScript configuration
 └── package.json           # Dependencies
```

**Key Features:**
- Next.js 14+ with React Server Components
- CopilotKit provider for AI chat interface
- TailwindCSS for styling
- Responsive UI for literature generation

---

## Workflow Philosophy

Literature-Gen separates concerns into distinct layers:

1. **Input Layer (Frontend)**
   - CopilotKit chat interface captures user intent
   - Conversational interactions drive the generation process

2. **Agent Layer (Mastra)**
   - Agents interpret user input and execute workflows
   - Specialized agents handle different content types (characters, fiction, weather)

3. **Schema Layer**
   - Zod schemas define input/output contracts
   - Ensures type safety and data validation

4. **Workflow Layer**
   - Orchestrates complex generation pipelines
   - Handles multi-step processes with scoring and validation

5. **Storage & Observability**
   - LibSQL persists traces and execution history
   - Enables debugging and audit trails

This layered approach allows creative flexibility while maintaining system reliability and type safety.

## Tech Stack

**Backend:**
- [Mastra](https://mastra.ai/) - AI agent framework
- [CopilotKit](https://copilotkit.ai/) - AI chat integration
- TypeScript - Type-safe backend
- Zod - Schema validation
- Pino - Structured logging
- LibSQL - Observability storage

**Frontend:**
- [Next.js](https://nextjs.org/) 14+ - React framework
- React - UI library
- TailwindCSS - Styling
- TypeScript - Type safety

**DevOps & Deployment:**
- Bun - Fast JavaScript runtime (optional, can use Node.js)
- Mastra Cloud - Serverless deployment
- GitHub - Version control

---

## Learn More

### Mastra Documentation

* 📘 [Mastra Docs](https://mastra.ai/docs/)
* 🤖 [Agents Guide](https://mastra.ai/docs/agents/overview)
* 🔧 [Workflows Guide](https://mastra.ai/docs/workflows/overview)
* 📊 [Evals & Scoring](https://mastra.ai/docs/evals/overview)
* 🔍 [Observability](https://mastra.ai/docs/observability/overview)

### CopilotKit Documentation

* 📘 [CopilotKit Docs](https://docs.copilotkit.ai/)
* 💬 [CopilotKit Discord](https://discord.gg/copilotkit)

### Learning Resources

* 🎓 [Mastra Course](https://mastra.ai/course)
* ▶️ [Mastra YouTube](https://youtube.com/@mastra-ai)
* 💬 [Mastra Discord Community](https://discord.gg/BTYqqHKUrf)

---

## Project Goals

Literature-Gen aims to demonstrate how modern AI frameworks can be combined to create powerful, user-friendly applications:

* **Creative + Structured** - Balance AI creativity with type-safe, validated outputs
* **User-Friendly** - CopilotKit provides an intuitive chat interface
* **Production-Ready** - Full observability, tracing, and deployment support
* **Scalable** - Easily extend with new agents, workflows, and schemas
* **Developer Experience** - Full TypeScript support and clear architecture

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request with improvements, bug fixes, or new features.

---

## License

This project is open source and available under the MIT License.

---

## Support

- **Issues & Bugs**: Open a GitHub issue
- **Mastra Support**: Visit [Mastra Discord](https://discord.gg/BTYqqHKUrf)
- **CopilotKit Support**: Visit [CopilotKit Discord](https://discord.gg/copilotkit)


