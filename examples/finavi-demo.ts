import { SemAn, Schema } from '../src';

// 1. Define the Schema (mimicking Finavi data structure)
const finaviSchema = Schema.object({
  // Personal Data
  age: Schema.number().transform('RangeBucket', {
    buckets: [30, 40, 50, 60],
    labels: ['unter30', '30bis39', '40bis49', '50bis59', '60plus']
  }),
  
  // Financial Health (0-100 score)
  financialHealthScore: Schema.number(), // Pass through as is, or could bucket

  // Indicators (categorized 0=Bad, 1=Medium, 2=Good)
  healthIndicators: Schema.object({
    ausgaben: Schema.number().transform('ValueMapper', {
      mapping: { 2: 'gut', 1: 'mittel', 0: 'schlecht' },
      defaultValue: 'unbekannt'
    }),
    notgroschen: Schema.number().transform('ValueMapper', {
      mapping: { 2: 'gut', 1: 'mittel', 0: 'schlecht' }
    }),
    schulden: Schema.number().transform('ValueMapper', {
      mapping: { 2: 'gut', 1: 'mittel', 0: 'schlecht' }
    })
  }),

  // Wealth
  netWorth: Schema.number().transform('RangeBucket', {
    buckets: [50000, 150000, 500000],
    labels: ['niedrig', 'mittel', 'hoch', 'sehrHoch']
  }),

  // Nested Array Example (e.g. list of debts)
  debts: Schema.array(
    Schema.object({
      type: Schema.string(),
      amount: Schema.number().transform('RangeBucket', {
        buckets: [1000, 5000, 10000],
        labels: ['Small', 'Medium', 'Large', 'Major']
      })
    })
  )
});

// 2. Sample Data (Sensitive!)
const sensitiveInput = {
  name: "Max Mustermann", // Should be stripped
  email: "max@example.com", // Should be stripped
  age: 34,
  financialHealthScore: 85,
  healthIndicators: {
    ausgaben: 2,
    notgroschen: 0,
    schulden: 1
  },
  netWorth: 125000,
  debts: [
    { type: "Credit Card", amount: 2500, creditor: "Visa" }, // creditor should be stripped
    { type: "Student Loan", amount: 12000, creditor: "KfW" }
  ],
  internalId: "user_123" // Should be stripped
};

// 3. Execute Anonymization
const engine = new SemAn(finaviSchema);
const safeContext = engine.anonymize(sensitiveInput);

console.log("--- Original Sensitive Data ---");
console.log(JSON.stringify(sensitiveInput, null, 2));

console.log("\n--- Anonymized Context for LLM ---");
console.log(JSON.stringify(safeContext, null, 2));

// 4. Validation (Simple Check)
if (safeContext.name || safeContext.email) {
  console.error("\n❌ FAILED: Personal data leaked!");
  process.exit(1);
}

if (safeContext.age === '30bis39' && safeContext.netWorth === 'mittel') {
  console.log("\n✅ SUCCESS: Data transformed and personal fields removed.");
} else {
  console.error("\n❌ FAILED: Incorrect transformations.");
  process.exit(1);
}

