# Semantic Anonymizer (SemAn)

**Context-preserving data anonymization for LLM applications.**

> ⚠️ **Status:** Pre-Alpha / Prototype Phase. This repository is currently under active development as part of a research prototype.

---

## The Problem

Integrating Large Language Models (LLMs) into sensitive domains (Finance, Health, HR) faces a critical dilemma:
- **Deleting data** destroys the context needed for high-quality AI responses.
- **Sending plain text** violates privacy regulations (GDPR) and trust.

Existing solutions often focus on redaction (blacking out text) or generalisation (k-anonymity) but lack a semantic understanding that preserves the *meaning* for the AI while hiding the *identity* of the user.

## The Solution: SemAn

**SemAn** is a TypeScript/Node.js library that transforms sensitive data into semantically equivalent abstract categories before they reach the LLM.

**Example:**
- **Input:** `{"balance": 234.50, "debt": 15000}`
- **Transformation:** `{"liquidity": "critical", "indebtedness": "high"}`

The LLM receives "User has critical liquidity and high indebtedness" instead of the raw numbers. It can generate helpful advice ("Prioritize debt repayment, cut non-essential spending") without ever knowing the user's specific financial details.

## Features (Planned)

- **Declarative Schema:** Define anonymization rules using a Zod-based schema.
- **Semantic Transformers:**
  - `RangeBucket`: Map numbers to categories (e.g., Age 30-35 -> "Early Career").
  - `FuzzyDate`: Shift dates or reduce precision (e.g., "2023-05-12" -> "2023-Q2").
  - `CategoryMapping`: Map specific values to broader groups.
- **Preservation Layer:** Ensures logical consistency between fields is maintained (e.g., start_date < end_date).
- **Re-Identification Risk Check:** Basic validation to warn about potential uniqueness.

## Architecture

SemAn is designed as a lightweight middleware library:

```mermaid
graph LR
    A[Client App] -->|Sensitive Data| B(SemAn Middleware)
    B -->|Anonymized Context| C[LLM API (e.g. Claude/GPT)]
    C -->|Response| B
    B -->|Response| A
```

## Installation

```bash
npm install seman
# or
yarn add seman
```

## Usage (Concept)

```typescript
import { SemAn, Schema } from 'seman';

// 1. Define the anonymization schema
const userSchema = Schema.object({
  age: Schema.number().transform('RangeBucket', { 
    buckets: [18, 25, 35, 50, 65], 
    labels: ['Student', 'Young Pro', 'Mid-Career', 'Senior', 'Retiree'] 
  }),
  savings: Schema.number().transform('FuzzyCategory', {
    rules: [
      { max: 1000, label: 'Low' },
      { max: 10000, label: 'Medium' },
      { min: 10000, label: 'High' }
    ]
  })
});

// 2. Initialize Engine
const anonymizer = new SemAn(userSchema);

// 3. Transform Data
const rawData = { age: 32, savings: 4500 };
const cleanContext = anonymizer.anonymize(rawData);

console.log(cleanContext);
// Output: { age: "Young Pro", savings: "Medium" }
```

## Roadmap

- **Phase 1 (Months 1-2):** Core Engine & Schema Definition
- **Phase 2 (Months 2-3):** Transformer Implementation (Numeric, Date, Categorical)
- **Phase 3 (Months 3-4):** Standard Presets (Finance, Health)
- **Phase 4 (Months 4-5):** Security Audits & Edge Runtime Optimization
- **Phase 5 (Months 5-6):** Public Release & Integration Showcase

## License

MIT

