// Offline examples are deliberately labeled as demo output, never presented as AI inference.
export function demoEmail(topic: string, recipient: string, points: string, tone: string, variation = false) {
  const greeting = tone === "Friendly" ? "Hi" : "Dear";
  const intro = variation ? `I'm following up regarding ${topic}.` : `I'm writing regarding ${topic}.`;
  return `Subject: ${topic}\n\n${greeting} ${recipient || "[Recipient]"},\n\n${intro}\n\n${points.trim() || "[Add the details you would like to share.]"}\n\n${tone === "Concise" ? "Thank you." : "Thank you for your time. I look forward to hearing from you."}\n\n${tone === "Friendly" ? "Best wishes" : "Kind regards"},\n[Your Name]`;
}
export function demoSummary(notes: string) {
  const lines = notes.split(/\n|(?<=[.!?])\s+/).map(l => l.trim()).filter(Boolean);
  const decisions = lines.filter(l => /agreed|approved|decided|decision/i.test(l));
  const actions = lines.filter(l => /will|need|to test|to replace|action|assigned/i.test(l));
  const deadlines = lines.filter(l => /by |before |deadline|monday|friday|nov|due/i.test(l));
  const list = (items: string[]) => items.length ? items.map(l => `- ${l}`).join("\n") : "None identified";
  return `## Summary\n${lines.slice(0, 2).join(" ")}\n\n## Key Points\n${list(lines)}\n\n## Decisions\n${list(decisions)}\n\n## Action Items\n${list(actions)}\n\n## Deadlines\n${list(deadlines)}`;
}
export function demoChat(question: string) {
  if (/robot|sensor|arduino/i.test(question)) return "**Demo answer — robotics**\n\nA robot usually combines sensors, a controller and actuators. Sensors measure the environment, the controller decides what to do, and motors perform the action.\n\nFor a first project, try an obstacle-avoiding robot with an ultrasonic sensor and a motor driver. Test the sensor readings before powering the motors.";
  if (/code|python|javascript|program/i.test(question)) return "**Demo answer — coding**\n\nBreak a programming problem into inputs, processing and outputs. Here is a small Python example:\n\n```python\ndef greet(name):\n    return f'Hello, {name}!'\n\nprint(greet('Amanda'))\n```\n\nTest normal inputs and edge cases. This is an offline example; choose Live AI for an answer tailored to your code.";
  if (/it|network|osi|computer/i.test(question)) return "**Demo answer — IT**\n\nThe OSI model describes networking in seven layers: Physical, Data Link, Network, Transport, Session, Presentation and Application.\n\nWhen troubleshooting, start with the physical connection, then check the IP address, routing and application settings.";
  return `**Demo answer**\n\nYour question: ${question}\n\nA useful approach is to define the goal, break it into small tasks and identify the next action. Prioritize important work and review your progress.\n\nThis is an offline example, not a generated AI answer.`;
}