import { Transformer } from './RangeBucketTransformer';

export interface FuzzyDateOptions {
  precision: 'year' | 'quarter' | 'decade';
}

export class FuzzyDateTransformer implements Transformer {
  transform(value: string | Date, options: FuzzyDateOptions): string {
    if (!value) return 'Unknown';

    const date = typeof value === 'string' ? new Date(value) : value;
    
    if (isNaN(date.getTime())) {
      return String(value); // Pass through invalid dates as string, or could return 'Invalid'
    }

    const year = date.getFullYear();

    switch (options.precision) {
      case 'year':
        return String(year);
      case 'quarter':
        const month = date.getMonth();
        const quarter = Math.floor(month / 3) + 1;
        return `${year}-Q${quarter}`;
      case 'decade':
        const decade = Math.floor(year / 10) * 10;
        return `${decade}er`;
      default:
        return String(year);
    }
  }
}

