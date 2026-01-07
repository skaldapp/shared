import type { JSONSchema } from "json-schema-to-ts";

export default {
  $id: "nodes",
  items: { $ref: "page" },
  type: "array",
} as const satisfies JSONSchema;
