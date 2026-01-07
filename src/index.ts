import type { AnyValidateFunction } from "ajv/dist/core";
import type { FromSchema } from "json-schema-to-ts";
import type { ComputedRef } from "vue";

import useFlatJsonTree from "@skaldapp/flat-json-tree";
import AJV from "ajv";
import dynamicDefaults from "ajv-keywords/dist/definitions/dynamicDefaults.js";
import { consola } from "consola/browser";
import { ofetch } from "ofetch";
import { generateSlug } from "random-word-slugs";
import { reactive, ref, toRef, toRefs, watch } from "vue";

import Credentials from "@/schemas/credentials";
import Log from "@/schemas/log";
import Nodes from "@/schemas/nodes";
import Page from "@/schemas/page";

export type TCredentials = FromSchema<typeof Credentials>;
export type TLog = FromSchema<typeof Log>;
export type TPage = FromSchema<typeof Page> & {
  $children: TPage[];
  $index: number;
  $next?: TPage;
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

const schemas = [Credentials, Nodes, Page, Log],
  ajv = new AJV({
    code: { esm: true },
    coerceTypes: true,
    keywords: [dynamicDefaults()],
    removeAdditional: true,
    schemas,
    useDefaults: true,
  }),
  data = toRefs(
    reactive({
      credentials: {} as TCredentials,
      log: {} as TLog,
    }),
  ),
  immediate = true,
  nodes = "nodes",
  properties = {
    $children: {
      get(this: TPage) {
        return this.children.filter(
          ({ frontmatter: { hidden } }: TPage) => !hidden,
        );
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
    $prev: {
      get(this: TPage) {
        return this.$siblings[this.$index - 1];
      },
    },
    $siblings: {
      get(this: TPage) {
        return this.siblings.filter(({ frontmatter: { hidden } }) => !hidden);
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
        return this.path?.replace(/^\/?/, "/").replace(/\/?$/, "/");
      },
    },
  },
  tree = ref([] as TPage[]),
  validate: Record<string, AnyValidateFunction | undefined> =
    Object.fromEntries(schemas.map(({ $id }) => [$id, ajv.getSchema($id)]));

export const fetching = async (input: string) => {
    try {
      return await ofetch(input);
    } catch (error) {
      consola.error(error);
    }
  },
  sharedStore = reactive({
    ...data,
    tree,
    ...(useFlatJsonTree(tree) as ReturnType<typeof useFlatJsonTree> & {
      kvNodes: ComputedRef<Record<string, TPage>>;
      nodes: ComputedRef<TPage[]>;
    }),
  });

Object.keys(data).forEach((key) => {
  if (validate[key])
    watch(data[key as keyof object], validate[key], { immediate });
});

watch(
  toRef(sharedStore, nodes),
  async (value) => {
    if (!(await validate[nodes]?.(value))) tree.value = [{}] as TPage[];
    else
      value.forEach((element) => {
        if (Object.keys(properties).some((key) => !(key in element)))
          Object.defineProperties(element, properties);
      });
  },
  { immediate },
);
