import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Allow responses up to 5 minutes
export const maxDuration = 300

export async function POST(req: Request) {
  const { messages } = await req.json()

  const { text } = await generateText({
    model: openai("gpt-3.5-turbo"),
    messages,
  })

  return new Response(text)
}
