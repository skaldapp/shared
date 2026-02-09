import type { JSONSchema } from "json-schema-to-ts";

const $id = "nodes",
  $ref = "page",
  items = { $ref },
  type = "array";

export default { $id, items, type } as const satisfies JSONSchema;
