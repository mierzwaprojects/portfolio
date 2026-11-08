/**
 * Instância do backend do Rubrica neste projeto. Os blocos próprios vêm de
 * src/blocks/index.ts, os mesmos que o site usa. (Dois pontos no nome: o Convex não
 * trata este arquivo como módulo de funções.)
 */
import { createRubrica } from "@rubrica/core/convex";
import { blocks } from "../src/blocks";

export const rubrica = createRubrica({ blocks });
