export interface Transformer {
  transform(value: any, options?: any): any;
}

export interface RangeBucketOptions {
  buckets: number[];
  labels: string[];
}

export class RangeBucketTransformer implements Transformer {
  transform(value: number, options: RangeBucketOptions): string {
    if (typeof value !== 'number') {
      return String(value);
    }
    
    // Ensure buckets are sorted
    const sortedBuckets = [...options.buckets].sort((a, b) => a - b);
    
    // Find appropriate bucket
    for (let i = 0; i < sortedBuckets.length; i++) {
      if (value < sortedBuckets[i]) {
        return options.labels[i] || 'Unknown';
      }
    }
    
    // If value is larger than largest bucket, use the last label
    return options.labels[options.labels.length - 1] || 'Unknown';
  }
}
