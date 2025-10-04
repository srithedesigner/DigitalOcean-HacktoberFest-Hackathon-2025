import gradio as gr
import fastapi
import requests
import re

app = fastapi.FastAPI()

GITHUB_API_BASE = "https://api.github.com"

def get_api_URL(owner, repo, issue_number):
    return f"{GITHUB_API_BASE}/repos/{owner}/{repo}/issues/{issue_number}"

def handle_issue(url, details):
    if not url:
        return "Please enter a valid URL."

    # Regex to match GitHub issue URL
    pattern = r"https?://github\.com/([^/]+)/([^/]+)/issues/(\d+)"
    match = re.match(pattern, url.strip())

    if not match:
        return "Invalid GitHub issue URL. Please use format: https://github.com/<owner>/<repo>/issues/<123>"

    owner, repo, issue_number = match.groups()
    api_request = get_api_URL(owner, repo, issue_number)

    headers = {
        "Accept": "application/vnd.github+json"
        # Optional: Add GitHub token for private repos or higher rate limits
        # "Authorization": "Bearer YOUR_GITHUB_TOKEN"
    }
    response = requests.get(api_request, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="GitHub API error or issue not found.")

    data = response.json()
     # Extract key fields
    return {
        "title": data.get("title"),
        "state": data.get("state"),
        "created_at": data.get("created_at"),
        "updated_at": data.get("updated_at"),
        "author": data.get("user", {}).get("login"),
        "labels": [label["name"] for label in data.get("labels", [])],
        "comments_count": data.get("comments"),
        "body": data.get("body"),
        "html_url": data.get("html_url")
    }

with gr.Blocks() as demo:
    gr.Markdown("# 🛠️ Issue Buster\nSubmit a URL and optional issue details below.")
    
    with gr.Row():
        url_input = gr.Textbox(label="URL", placeholder="Enter the URL here")
        issue_details = gr.Textbox(label="Issue Details (Optional)", placeholder="Describe the issue if needed")

    submit_btn = gr.Button("Submit")
    output = gr.Textbox(label="Response", lines = 10)

    submit_btn.click(fn=handle_issue, inputs=[url_input, issue_details], outputs=output)

demo.launch()
