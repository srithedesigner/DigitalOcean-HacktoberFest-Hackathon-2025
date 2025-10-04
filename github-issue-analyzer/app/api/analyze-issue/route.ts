import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { repoUrl, issueUrl } = await req.json()

    if (!repoUrl || !issueUrl) {
      return Response.json({ error: "Repository URL and Issue URL are required" }, { status: 400 })
    }

    const prompt = `You are an expert software engineer and project manager. Analyze the following GitHub issue and generate a comprehensive list of action items to solve it.

Repository: ${repoUrl}
Issue: ${issueUrl}

Please provide:
1. A brief summary of the issue
2. Root cause analysis
3. Detailed action items with step-by-step instructions
4. Potential challenges and how to address them
5. Testing recommendations
6. Estimated complexity (Low/Medium/High)

Format your response in clear, well-structured Markdown with proper headings, lists, and code blocks where appropriate.`

    const result = streamText({
      model: "openai/gpt-5",
      prompt,
      maxOutputTokens: 2000,
      temperature: 0.7,
    })

    // Create a streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            controller.enqueue(encoder.encode(chunk))
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Error analyzing issue:", error)
    return Response.json({ error: "Failed to analyze issue" }, { status: 500 })
  }
}
