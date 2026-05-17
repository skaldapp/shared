import type { JSONSchema } from "json-schema-to-ts";

const $id = "openai",
  additionalProperties = false,
  nullable = true,
  type = "string";

export default {
  $id,
  additionalProperties,
  properties: {
    apiKey: { default: null, nullable, type },
    baseURL: { default: null, nullable, type },
    endpoint: { default: null, nullable, type },
    model: { default: null, nullable, type },
  },
  type: "object",
} as const satisfies JSONSchema;
