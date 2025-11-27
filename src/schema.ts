import { RangeBucketOptions, ValueMapperOptions, FuzzyDateOptions } from './transformers/index';

export type TransformType = 'RangeBucket' | 'ValueMapper' | 'FuzzyDate';

export interface TransformerConfig {
  type: TransformType;
  options?: RangeBucketOptions | ValueMapperOptions | FuzzyDateOptions;
}

export interface SchemaField {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  transformer?: TransformerConfig;
  shape?: Record<string, SchemaField>; // For objects
  items?: SchemaField; // For arrays
}

export class SchemaBuilder {
  private field: SchemaField;

  constructor(type: SchemaField['type']) {
    this.field = { type };
  }

  transform(type: TransformType, options?: any): SchemaBuilder {
    this.field.transformer = { type, options };
    return this;
  }

  build(): SchemaField {
    return this.field;
  }
}

export class Schema {
  static object(shape: Record<string, SchemaBuilder>): SchemaBuilder {
    const builtShape: Record<string, SchemaField> = {};
    for (const key in shape) {
      builtShape[key] = shape[key].build();
    }
    
    const builder = new SchemaBuilder('object');
    builder['field'].shape = builtShape;
    return builder;
  }

  static array(items: SchemaBuilder): SchemaBuilder {
    const builder = new SchemaBuilder('array');
    builder['field'].items = items.build();
    return builder;
  }

  static number(): SchemaBuilder {
    return new SchemaBuilder('number');
  }

  static string(): SchemaBuilder {
    return new SchemaBuilder('string');
  }

  static boolean(): SchemaBuilder {
    return new SchemaBuilder('boolean');
  }
}
