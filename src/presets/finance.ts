import { Schema } from '../schema';

/**
 * Standard Anonymization Rules for German Financial Context
 * Extracted from Finavi production logic (dataPreparation.js)
 */
export const GermanFinancePreset = {
  /**
   * Age classification in 5-year steps
   * Useful for demographic context without revealing exact age
   */
  ageClass: Schema.number().transform('RangeBucket', {
    buckets: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
    labels: [
      'unter 20', '20-24', '25-29', '30-34', '35-39', 
      '40-44', '45-49', '50-54', '55-59', '60-64', 
      '65-69', '70-74', '75-79', '80+'
    ]
  }),

  /**
   * Broader life stage classification
   */
  lifeStage: Schema.number().transform('RangeBucket', {
    buckets: [30, 40, 50, 60],
    labels: [
      'frühe Karriere',    // < 30
      'Karriereaufbau',    // 30-39
      'Karrierehöhepunkt', // 40-49
      'Spätkarriere',      // 50-59
      'Vorruhestand'       // 60+
    ]
  }),

  /**
   * Birth Date Anonymization
   * Reduces precision to just the year (YYYY)
   */
  birthDate: Schema.string().transform('FuzzyDate', {
    precision: 'year'
  }),

  /**
   * Contract Date Anonymization
   * Reduces precision to quarter (YYYY-QX)
   */
  contractDate: Schema.string().transform('FuzzyDate', {
    precision: 'quarter'
  }),

  /**
   * Financial Wealth Categorization (Liquid Assets)
   * Thresholds: 25k, 75k, 200k, 500k
   */
  wealthCategory: Schema.number().transform('RangeBucket', {
    buckets: [25000, 75000, 200000, 500000],
    labels: [
      'sehr niedrig', // < 25k
      'niedrig',      // 25k - 75k
      'mittel',       // 75k - 200k
      'hoch',         // 200k - 500k
      'sehr hoch'     // > 500k
    ]
  }),

  /**
   * Net Worth Categorization (Total Assets including Real Estate)
   * Thresholds: 50k, 200k, 500k, 1M
   */
  netWorthStatus: Schema.number().transform('RangeBucket', {
    buckets: [50000, 200000, 500000, 1000000],
    labels: [
      'niedrig',   // < 50k
      'mittel',    // 50k - 200k
      'gut',       // 200k - 500k
      'hoch',      // 500k - 1M
      'sehr hoch'  // > 1M
    ]
  }),

  /**
   * Pension Entitlements Categorization
   * Thresholds: 1500, 2000, 3000, 4000, 5000
   */
  pensionCategory: Schema.number().transform('RangeBucket', {
    buckets: [1500, 2000, 3000, 4000, 5000],
    labels: [
      'sehr niedrig', // < 1500
      'niedrig',      // 1500 - 2000
      'mittel',       // 2000 - 3000
      'hoch',         // 3000 - 4000
      'sehr hoch',    // 4000 - 5000
      'exorbitant'    // > 5000
    ]
  }),

  /**
   * Monthly Income Categorization
   * Thresholds: 1000, 1500, 2250, 2750, 3500, 4500
   */
  incomeCategory: Schema.number().transform('RangeBucket', {
    buckets: [1000, 1500, 2250, 2750, 3500, 4500],
    labels: [
      'extrem niedrig', // < 1000
      'sehr niedrig',   // 1000 - 1500
      'niedrig',        // 1500 - 2250
      'mittel',         // 2250 - 2750
      'hoch',           // 2750 - 3500
      'sehr hoch',      // 3500 - 4500
      'extrem hoch'     // > 4500
    ]
  }),

  /**
   * Pension Gap / Surplus Categorization (Absolute Value)
   * Thresholds: 500, 1000, 2000, 3000
   */
  gapCategory: Schema.number().transform('RangeBucket', {
    buckets: [500, 1000, 2000, 3000],
    labels: [
      'sehr klein', // < 500
      'klein',      // 500 - 1000
      'mittel',     // 1000 - 2000
      'groß',       // 2000 - 3000
      'sehr groß'   // > 3000
    ]
  }),

  /**
   * Standard Health Indicator Mapping (0, 1, 2)
   */
  healthIndicator: Schema.number().transform('ValueMapper', {
    mapping: {
      2: 'sehr gut',
      1: 'gut',
      0: 'mittel'
    },
    defaultValue: 'verbesserungsbedürftig'
  })
};
