import type { JSONSchema } from "json-schema-to-ts";

const $id = "credential",
  additionalProperties = false,
  nullable = true,
  type = "string";

export default {
  $id,
  additionalProperties,
  properties: {
    accessKeyId: { default: null, nullable, type },
    Bucket: { default: null, nullable, type },
    endpoint: { default: null, nullable, type },
    region: { default: null, nullable, type },
    secretAccessKey: { default: null, nullable, type },
  },
  type: "object",
} as const satisfies JSONSchema;
