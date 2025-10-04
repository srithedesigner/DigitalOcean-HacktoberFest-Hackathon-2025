# 🚀 Issue Navigator for Open Source Repos

## 📌 Business Problem

Open-source projects are massive, with thousands of files and issues.
For new contributors, **the biggest challenge is not solving the issue itself but figuring out where to start.**

This project solves that by building an **Agentic System** that:

* Takes a **GitHub repo link** and an **issue link**.
* Fetches issue content via the **GitHub API**.
* Uses the repo knowledge base from **DigitalOcean** to provide **step-by-step actionable tasks** for resolving the issue.

In short:
👉 *“Don’t just show me the issue, show me where to start.”*

---

## 🏗️ Proposed Architecture

We envision a **two-agent system**:

1. **Issue Scraper Agent**

   * Input: GitHub issue URL
   * Function: Fetch issue details (title, description, comments, labels, linked PRs, etc.) using the **GitHub API**
   * Output: Structured issue context

2. **Issue Triage Agent**

   * Input: Issue context + Repo knowledge base (from **DigitalOcean**)
   * Function: Generate **step-by-step developer tasks** to start resolving the issue
   * Output: Beginner-friendly starting points

### Data Flow

```mermaid
graph LR
    A[GitHub Issue URL] --> B[Issue Scraper Agent]
    B --> C[Issue Context]
    C --> D[Repo Knowledge Base (DigitalOcean)]
    D --> E[Issue Triage Agent]
    E --> F[Step-by-Step Tasks]
```

---

## ⚡ Current Architecture

The system is functional but still evolving:

1. **Knowledge Base**

   * Limited subset of repo data fetched from **DigitalOcean**.

2. **Scraping**

   * Currently, issues are fetched directly via the **GitHub API** rather than through a dedicated agent.

3. **Triage**

   * The Issue Triage Agent runs on partial repo knowledge + scraped issue text.
   * Produces step-by-step dev tasks, but full automation is still in progress.

---

## ✅ Roadmap

* [ ] Build a dedicated **Issue Scraper Agent**
* [ ] Expand **Repo Knowledge Base** to cover the entire repo
* [ ] Enhance **Issue Triage Agent** with more detailed steps
* [ ] Add **GitHub Actions integration** to auto-comment triage steps on issues
* [ ] Support **multi-issue triaging** and prioritization

---

## 💻 Tech Stack

* **Language**: Python
* **APIs**: GitHub API, DigitalOcean API
* **Agents**: Custom agent framework
* **Knowledge Base**: DigitalOcean-hosted repo knowledge
* **Deployment/Future**: GitHub Actions integration

---

## 💻 Getting Started

1. Clone this repo:

   ```bash
   git clone https://github.com/your-username/issue-navigator.git
   cd issue-navigator
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the prototype:

   ```bash
   python main.py --repo <repo_url> --issue <issue_url>
   ```

---

## 📂 Repo Structure (Proposed)

```
issue-navigator/
│── agents/
│   ├── issue_scraper.py
│   ├── issue_triage.py
│── utils/
│   ├── github_api.py
│   ├── digitalocean_kb.py
│── knowledge_base/
│   ├── ingest.py
│   ├── vector_store/
│── main.py
│── README.md
│── requirements.txt
```

---

## 🙋 Contribution

This project is aimed at **open-source contributors**. You can help by:

* Adding support for more repo formats
* Improving step-by-step task generation
* Expanding knowledge base coverage
* Implementing GitHub Actions integration

---

## 📊 Architecture Diagram

```mermaid
graph TD
    A[GitHub Issue URL] -->|Fetch Issue| B[Issue Scraper Agent]
    B -->|Generate Context| C[Issue Context]
    C -->|Query| D[Repo Knowledge Base (DigitalOcean)]
    D -->|Step-by-Step Tasks| E[Issue Triage Agent]
    E -->|Output| F[Step-by-Step Dev Tasks]
```
