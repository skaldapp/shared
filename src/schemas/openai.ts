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
    fim: { default: null, nullable, type: "boolean" },
  },
  type: "object",
} as const satisfies JSONSchema;
