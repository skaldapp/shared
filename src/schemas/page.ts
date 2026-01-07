export default {
  $id: "page",
  additionalProperties: false,
  dynamicDefaults: { id: "uuid" },
  properties: {
    children: {
      default: [],
      items: { type: "object" },
      type: "array",
    },
    frontmatter: { default: {}, type: "object" },
    id: { type: "string" },
    name: { default: null, nullable: true, type: "string" },
  },
  type: "object",
} as const;
