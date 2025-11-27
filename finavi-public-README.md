# Finavi - Privacy-First Financial Planning

> **Public Documentation & Reference Implementation**
> 
> *Note: This is a public placeholder repository for the Finavi platform. The core application code is proprietary, but our privacy infrastructure is open source.*

---

## Overview

**Finavi** is a comprehensive digital financial planning platform designed to democratize access to professional financial advice. Unlike traditional tools that either require full data exposure or offer generic advice, Finavi combines:

*   **Personalized Financial Analysis:** Detailed retirement planning and wealth projections.
*   **Privacy-First Architecture:** Your raw financial data never leaves our secure environment in plain text.
*   **AI-Assisted Coaching:** We use Large Language Models (LLMs) to generate personalized financial "stories" and advice, but **only after anonymizing the context**.

🔗 **Live App:** [https://signup.finavi.app](https://signup.finavi.app)

## Privacy & AI Architecture

We believe you shouldn't have to trade your privacy for intelligent advice. To solve this, we built and open-sourced our core anonymization engine.

### Powered by [SemAn](https://github.com/Christian84Berlin/seman)

We use **SemAn (Semantic Anonymizer)**, a context-preserving anonymization library, to act as a secure gateway between our user data and external AI services (like Anthropic's Claude).

1.  **Data Collection:** User enters financial data (e.g., "Salary: €3,450", "Debt: €12,000").
2.  **Local Processing:** Our backend calculates projections and KPIs locally.
3.  **Semantic Anonymization:** Before asking the AI for advice, **SemAn** transforms the specific numbers into abstract semantic categories (e.g., "Income: Medium-High", "Debt: Critical").
4.  **Safe Transmission:** Only these abstract categories are sent to the AI API. The AI understands the *context* ("User has critical debt") but never sees the *content* (the exact €12,000 amount).

This ensures that **no personally identifiable financial data ever leaves our controlled infrastructure.**

## Tech Stack

*   **Frontend:** Vue.js 3 (Composition API)
*   **Backend:** Node.js / Express
*   **Database:** MongoDB
*   **Infrastructure:** Docker / VPS
*   **AI Integration:** SemAn + Anthropic Claude API

## Screenshots

*(Add screenshots of the app dashboard here)*

---

### Contact & Imprint

Developed by **Dr. Christian Westermeier**  
Berlin, Germany  
[GitHub Profile](https://github.com/Christian84Berlin)

