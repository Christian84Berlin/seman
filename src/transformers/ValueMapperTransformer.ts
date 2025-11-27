import { Transformer } from './RangeBucketTransformer';

export interface ValueMapperOptions {
  mapping: Record<string | number, string>;
  defaultValue?: string;
}

export class ValueMapperTransformer implements Transformer {
  transform(value: any, options: ValueMapperOptions): string {
    if (value === undefined || value === null) {
      return options.defaultValue || 'Unknown';
    }

    if (options.mapping.hasOwnProperty(value)) {
      return options.mapping[value];
    }

    return options.defaultValue || 'Unknown';
  }
}
