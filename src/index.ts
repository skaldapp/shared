import type { AnyValidateFunction } from "ajv/dist/core";
import type { FromSchema } from "json-schema-to-ts";
import type { ComputedRef } from "vue";

import useFlatJsonTree from "@skaldapp/flat-json-tree";
import AJV from "ajv";
import dynamicDefaults from "ajv-keywords/dist/definitions/dynamicDefaults.js";
import { generateSlug } from "random-word-slugs";
import { computed, reactive, ref, toRef, watch } from "vue";

import Credential from "@/schemas/credential";
import Nodes from "@/schemas/nodes";
import Page from "@/schemas/page";

export type TCredential = FromSchema<typeof Credential>;
export type TPage = FromSchema<typeof Page> & {
  $branch: TPage[];
  $children: TPage[];
  $index: number;
  $next?: TPage;
  $parent?: TPage;
  $prev?: TPage;
  $siblings: TPage[];
  branch: TPage[];
  children: TPage[];
  id: string;
  index: number;
  next?: TPage;
  parent?: TPage;
  path?: string;
  prev?: TPage;
  siblings: TPage[];
  to?: string;
};

dynamicDefaults.DEFAULTS["uuid"] = () => generateSlug;

const isVisible = ({ frontmatter: { hidden }, path }: TPage) =>
  path !== undefined && !hidden;

const esm = true,
  code = { esm },
  coerceTypes = true,
  keywords = [dynamicDefaults()],
  removeAdditional = true,
  schemas = [Nodes, Page],
  useDefaults = true,
  ajv = new AJV({
    code,
    coerceTypes,
    keywords,
    removeAdditional,
    schemas,
    useDefaults,
  }),
  immediate = true,
  isRedirect = (branch: TPage[]) =>
    ((reversedBranch) =>
      ((i) =>
        reversedBranch[i]?.frontmatter["template"] &&
        !reversedBranch
          .slice(0, i)
          .some(({ index, siblings }) =>
            siblings.slice(0, index).some(isVisible),
          ))(
        reversedBranch.findIndex((value, index) => index && isVisible(value)),
      ))([...branch].reverse()),
  LEAD_TRAIL_SLASH_RE = /^\/?|\/?$/g,
  properties = {
    $branch: {
      get(this: TPage) {
        return this.branch.filter(isVisible);
      },
    },
    $children: {
      get(this: TPage) {
        return this.children.filter(isVisible);
      },
    },
    $index: {
      get(this: TPage) {
        return this.$siblings.findIndex(({ id }) => this.id === id);
      },
    },
    $next: {
      get(this: TPage) {
        return this.$siblings[this.$index + 1];
      },
    },
    $parent: {
      get(this: TPage) {
        return this.$branch[this.$branch.length - 2];
      },
    },
    $prev: {
      get(this: TPage) {
        return this.$siblings[this.$index - 1];
      },
    },
    $siblings: {
      get(this: TPage) {
        return this.siblings.filter(isVisible);
      },
    },
    path: {
      get(this: TPage) {
        const branch = this.branch.slice(1);
        return branch.some(({ name }) => !name)
          ? undefined
          : branch
              .map(({ name }) => name)
              .join("/")
              .replace(/ /g, "_");
      },
    },
    to: {
      get(this: TPage) {
        const { path } =
          [...this.$branch]
            .reverse()
            .find(({ branch }) => !isRedirect(branch)) ?? this;
        return path?.replace(LEAD_TRAIL_SLASH_RE, "/");
      },
    },
  },
  tree = ref([] as TPage[]),
  validate: Record<string, AnyValidateFunction | undefined> =
    Object.fromEntries(schemas.map(({ $id }) => [$id, ajv.getSchema($id)])),
  { kvNodes, nodes, ...flatJsonTree } = useFlatJsonTree(tree);

const $nodes = computed(() => (nodes.value as TPage[]).filter(isVisible));

export const sharedStore = reactive({
  tree,
  ...flatJsonTree,
  $nodes,
  isRedirect,
  kvNodes: kvNodes as ComputedRef<Record<string, TPage>>,
  LEAD_TRAIL_SLASH_RE,
  nodes: nodes as ComputedRef<TPage[]>,
});

watch(
  toRef(sharedStore, "nodes"),
  async (value) => {
    if (!(await validate["nodes"]?.(value))) tree.value = [{}] as TPage[];
    else
      value.forEach((element) => {
        if (Object.keys(properties).some((key) => !(key in element)))
          Object.defineProperties(element, properties);
      });
  },
  { immediate },
);
