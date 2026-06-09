import type { JSONSchema } from "json-schema-to-ts";

const $id = "settings",
  additionalProperties = false,
  nullable = true;

export default {
  $id,
  additionalProperties,
  properties: {
    coop: { default: null, nullable, type: "boolean" },
    workgroup: { default: null, nullable, type: "string" },
  },
  type: "object",
} as const satisfies JSONSchema;
