import { SchemaField } from './schema';
import { RangeBucketTransformer, ValueMapperTransformer } from './transformers/index';

export class SemAn {
  private schema: SchemaField;
  private transformers: Record<string, any>;

  constructor(schema: any) { // Accepts SchemaBuilder or SchemaField
    // If it's a SchemaBuilder, build it
    this.schema = schema.build ? schema.build() : schema;
    
    this.transformers = {
      'RangeBucket': new RangeBucketTransformer(),
      'ValueMapper': new ValueMapperTransformer()
    };
  }

  public anonymize(data: any): any {
    return this.processNode(data, this.schema);
  }

  private processNode(data: any, schemaNode: SchemaField): any {
    if (data === undefined || data === null) {
      return null;
    }

    // 1. Process Children (Recursion)
    let processedData = data;

    if (schemaNode.type === 'object' && schemaNode.shape) {
      const result: any = {};
      // Only process fields defined in schema (Allowlist approach)
      for (const key in schemaNode.shape) {
        if (data.hasOwnProperty(key)) {
          result[key] = this.processNode(data[key], schemaNode.shape[key]);
        }
      }
      processedData = result;
    } 
    else if (schemaNode.type === 'array' && schemaNode.items && Array.isArray(data)) {
      processedData = data.map(item => this.processNode(item, schemaNode.items!));
    }

    // 2. Apply Transformation (if configured)
    // Note: Transformations apply AFTER recursion (bottom-up), but for objects/arrays
    // usually transformations happen on primitive leaves. 
    // If a transformer is on an object, it transforms the entire object result.
    if (schemaNode.transformer) {
      const transformer = this.transformers[schemaNode.transformer.type];
      if (transformer) {
        processedData = transformer.transform(processedData, schemaNode.transformer.options);
      } else {
        console.warn(`Transformer ${schemaNode.transformer.type} not found`);
      }
    }

    return processedData;
  }
}
