import type { JSONSchema } from "json-schema-to-ts";

export default {
  $id: "credentials",
  additionalProperties: {
    properties: {
      accessKeyId: { default: null, nullable: true, type: "string" },
      Bucket: { default: null, nullable: true, type: "string" },
      endpoint: { default: null, nullable: true, type: "string" },
      region: { default: null, nullable: true, type: "string" },
      secretAccessKey: { default: null, nullable: true, type: "string" },
    },
    type: "object",
  },
  type: "object",
} as const satisfies JSONSchema;
