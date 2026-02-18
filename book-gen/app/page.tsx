import { CopilotChat } from "@copilotkit/react-ui";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

export default function Home() {
  return (
    <CopilotKit
      runtimeUrl="http://localhost:4111/chat"
      agent="characterDevelopmentAgent"
    >
      <CopilotChat
        labels={{
          title: "Character Development Agent",
          initial: "Hi! 👋 I will help you to develop character for you book.",
        }}
      />
    </CopilotKit>
  );
}