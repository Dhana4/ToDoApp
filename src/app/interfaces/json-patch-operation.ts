export interface JsonPatchOperation {
    op: string;
    path: string;
    value: any;
  }