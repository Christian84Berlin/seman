export interface Transformer {
  transform(value: any, options?: any): any;
}

export class RangeBucketTransformer implements Transformer {
  transform(value: number, options: { buckets: number[], labels: string[] }): string {
    // Implementation placeholder
    return "";
  }
}

export class FuzzyCategoryTransformer implements Transformer {
  transform(value: any, options: any): any {
    return "";
  }
}

