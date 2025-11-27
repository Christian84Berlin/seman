import { SemAn, Schema } from '../src';
import { GermanFinancePreset } from '../src/presets/finance';

// 1. Define the Schema using the Official Presets
const finaviSchema = Schema.object({
  // Personal Data - using the preset for 5-year age buckets
  age: GermanFinancePreset.ageClass,
  
  // Fuzzy Date Examples
  birthDate: GermanFinancePreset.birthDate,
  lastUpdated: GermanFinancePreset.contractDate,

  // Financial Health (0-100 score) - pass through or could categorize
  financialHealthScore: Schema.number(),

  // Indicators - using standard mappings (0=Bad, 1=Medium, 2=Good)
  healthIndicators: Schema.object({
    ausgaben: GermanFinancePreset.healthIndicator,
    notgroschen: GermanFinancePreset.healthIndicator,
    schulden: GermanFinancePreset.healthIndicator,
    nachhaltigkeit: GermanFinancePreset.healthIndicator,
    altersvorsorge: GermanFinancePreset.healthIndicator,
    renteneinkommen: GermanFinancePreset.healthIndicator
  }),

  // Wealth - using specific financial thresholds (25k, 75k, etc.)
  netWorth: GermanFinancePreset.netWorthStatus,
  financialWealth: GermanFinancePreset.wealthCategory,

  // Pensions
  pensionEntitlements: GermanFinancePreset.pensionCategory,
  retirementIncome: GermanFinancePreset.incomeCategory,

  // Gap Analysis
  pensionGap: GermanFinancePreset.gapCategory,

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

// 2. Sample Data (Sensitive!) - Real-world example values
const sensitiveInput = {
  name: "Max Mustermann",
  email: "max@example.com",
  age: 34, // Should map to "30-34"
  birthDate: "1990-05-15", // Should map to "1990"
  lastUpdated: "2024-11-27", // Should map to "2024-Q4"
  financialHealthScore: 85,
  healthIndicators: {
    ausgaben: 2, // sehr gut
    notgroschen: 0, // mittel
    schulden: 1, // gut
    nachhaltigkeit: 0, // mittel
    altersvorsorge: 1, // gut
    renteneinkommen: 0 // mittel
  },
  netWorth: 125000, // Should map to "mittel" (50k-200k)
  financialWealth: 45000, // Should map to "niedrig" (25k-75k)
  pensionEntitlements: 1850, // Should map to "niedrig" (1500-2000)
  retirementIncome: 2400, // Should map to "niedrig" (1500-2250)
  pensionGap: 1200, // Should map to "mittel" (1000-2000)
  
  debts: [
    { type: "Credit Card", amount: 2500, creditor: "Visa" },
    { type: "Student Loan", amount: 12000, creditor: "KfW" }
  ],
  internalId: "user_123"
};

// 3. Execute Anonymization
const engine = new SemAn(finaviSchema);
const safeContext = engine.anonymize(sensitiveInput);

console.log("--- Original Sensitive Data ---");
console.log(JSON.stringify(sensitiveInput, null, 2));

console.log("\n--- Anonymized Context for LLM ---");
console.log(JSON.stringify(safeContext, null, 2));

// 4. Validation
const expectedAge = '30-34';
const expectedNetWorth = 'mittel';
const expectedHealth = 'sehr gut'; // for 'ausgaben' = 2
const expectedBirthYear = '1990';
const expectedQuarter = '2024-Q4';

if (safeContext.age === expectedAge && 
    safeContext.netWorth === expectedNetWorth && 
    safeContext.healthIndicators.ausgaben === expectedHealth &&
    safeContext.birthDate === expectedBirthYear &&
    safeContext.lastUpdated === expectedQuarter) {
  console.log("\n✅ SUCCESS: Preset rules applied correctly.");
} else {
  console.error("\n❌ FAILED: Incorrect transformations.");
  console.error(`Expected Age: ${expectedAge}, Got: ${safeContext.age}`);
  console.error(`Expected NetWorth: ${expectedNetWorth}, Got: ${safeContext.netWorth}`);
  console.error(`Expected BirthDate: ${expectedBirthYear}, Got: ${safeContext.birthDate}`);
  console.error(`Expected Quarter: ${expectedQuarter}, Got: ${safeContext.lastUpdated}`);
  process.exit(1);
}
