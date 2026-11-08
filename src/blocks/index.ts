/**
 * Blocos próprios do projeto (RFC v2: "Personalização no projeto", item 2). Cada bloco
 * tem a definição (campos, com defineBlock) e um componente React puro. O site e o
 * backend (convex/rubrica.config.ts) leem as definições daqui; o painel os mostra no
 * editor de páginas como os do núcleo.
 *
 *   import { defineBlock, field } from "@rubrica/core";
 *   export const blocks = [defineBlock({ type: "meu-bloco", label: "Meu bloco", ... })];
 *   export const components = { "meu-bloco": "./src/blocks/MeuBloco.tsx" };
 */
import type { BlockDefinition } from "@rubrica/core";

export const blocks: BlockDefinition[] = [];

/** Componente de cada bloco próprio: tipo → arquivo (export default), a partir da raiz. */
export const components: Record<string, string> = {};
