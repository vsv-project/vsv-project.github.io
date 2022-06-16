import { useContext } from "react";
import UserContext from "./UserContext";

// Test user context
export default function ContextTester() {
  const msg = useContext(UserContext);

  return (
    <>
      <h1>ContextTester</h1>
      User: {msg || "Loading | Broken"} <em>(Should show smiley face)</em>
    </>
  );
}
