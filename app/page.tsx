"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { GitBranch, Sparkles, ArrowRight } from "lucide-react"
import ReactMarkdown from "react-markdown"

const FALLBACK_MARKDOWN = `# Action Items for GitHub Issue

## Summary
This is a sample action plan generated as a fallback when the API request fails.

## Root Cause Analysis
The issue appears to be related to:
- **Code Quality**: Potential bugs in the implementation
- **Architecture**: Design patterns that need improvement
- **Dependencies**: Outdated or conflicting packages

## Detailed Action Items

### 1. Investigation Phase
\`\`\`bash
git clone <repository-url>
cd <repository-name>
npm install
\`\`\`

### 2. Code Review
- Review affected files mentioned in the issue
- Identify edge cases

### 3. Implementation Steps
1. **Create a new branch**
\`\`\`bash
git checkout -b fix/issue-name
\`\`\`

2. **Implement the fix**
3. **Add tests**
\`\`\`javascript
describe('Feature', () => {
  it('should handle edge cases', () => {
    expect(result).toBe(expected);
  });
});
\`\`\`

### 4. Testing Recommendations
- Run unit tests: \`npm test\`
- Perform integration testing
- Verify browser compatibility

## Potential Challenges
- Breaking changes
- Performance considerations
- Dependencies

## Estimated Complexity
**Medium**

## Next Steps
1. Assign issue to a developer
2. Set up development environment
3. Begin implementation
4. Submit PR
`

async function get_issue_fetch(content: string) {
  const res = await fetch("/api/analyze-issue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content })
  })

  if (!res.ok) throw new Error(`API request failed: ${res.status}`)
  return await res.json()
}

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("")
  const [issueUrl, setIssueUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResult("")

    try {
      const pattern = /https?:\/\/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/
      const match = issueUrl.trim().match(pattern)
      if (!match) {
        setError("Invalid GitHub issue URL. Use: https://github.com/<owner>/<repo>/issues/<number>")
        setLoading(false)
        return
      }
      const [_, owner, repo, issue_number] = match
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Accept": "application/vnd.github+json"
        }
      })

      if (!response.ok) throw new Error("GitHub API request failed")
      const data = await response.json()

      const markdown = `
# ${data.title}

**State:** ${data.state}  
**Author:** ${data.user?.login}  
**Created At:** ${data.created_at}  
**Updated At:** ${data.updated_at}  
**Labels:** ${data.labels.map((label: any) => label.name).join(", ") || "None"}  
**Comments:** ${data.comments}

---

${data.body || "_No description provided._"}

[View on GitHub](${data.html_url})
      `

      const output = await get_issue_fetch(markdown)
      setResult(output)
    } catch (err) {
      console.log("[v0] API call failed, using fallback markdown", err)
      setResult(FALLBACK_MARKDOWN)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">IssueAI</span>
          </div>
          <Button variant="outline" size="sm">Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-base font-mono mb-6 border border-accent/30">
              <Sparkles className="w-5 h-5" />
              AI-Powered Issue Analysis
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 text-foreground text-balance leading-tight">
              Transform GitHub Issues into <span className="text-accent">Action Items</span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              Leverage AI to analyze GitHub issues and generate comprehensive, actionable steps to resolve them efficiently.
            </p>
          </div>

          {/* Input Form */}
          <Card className="p-10 mb-8 bg-card border-border shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="repo" className="text-base font-semibold text-foreground block">
                  GitHub Repository URL
                </label>
                <Input
                  id="repo"
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground text-base h-12"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="issue" className="text-base font-semibold text-foreground block">
                  Issue URL
                </label>
                <Input
                  id="issue"
                  type="url"
                  placeholder="https://github.com/username/repository/issues/123"
                  value={issueUrl}
                  onChange={(e) => setIssueUrl(e.target.value)}
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground text-base h-12"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-base font-semibold"
                size="lg"
              >
                {loading ? (
                  <>
                    <Spinner className="mr-2" />
                    Analyzing Issue...
                  </>
                ) : (
                  <>
                    Generate Action Items
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            {error && (
              <div className="mt-6 p-5 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-destructive text-base font-medium">{error}</p>
              </div>
            )}
          </Card>

          {/* Results */}
          {result && !loading && (
            <Card className="p-10 bg-card border-border shadow-xl">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
                <Sparkles className="w-6 h-6 text-accent" />
                <h2 className="text-3xl font-bold text-foreground">Action Items</h2>
              </div>
              <div className="markdown-content prose prose-invert max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-base">
          <p>Powered by AI SDK • Built for developers</p>
        </div>
      </footer>
    </div>
  )
}
