import ts from "typescript";
import { Entry } from "../entries";
import { error } from "../util/out";
import tsParserProgram from "../util/tsParserProgram";

export enum DeclarationKind {
  Type,
  Module,
  Var,
  Function,
}

export namespace Declaration {
  export interface Property {
    start: number;
    end: number;
    name: string;
    code: () => string;
  }
}

export interface Declaration {
  kind: DeclarationKind;
  name: string;
  start: number;
  end: number;
  code: () => string;
  properties: () => Declaration.Property[];
}

const declarationStatementChecks = [
  [ts.isTypeAliasDeclaration, DeclarationKind.Type],
  [ts.isInterfaceDeclaration, DeclarationKind.Type],
  [ts.isEnumDeclaration, DeclarationKind.Type],
  [ts.isClassDeclaration, DeclarationKind.Type],
  [ts.isModuleDeclaration, DeclarationKind.Module],
  [ts.isFunctionDeclaration, DeclarationKind.Function],
  [ts.isVariableStatement, DeclarationKind.Var],
] as const;

export interface ExportClause {
  name: string;
  as: string;
}

export interface Exports {
  start: number;
  end: number;
  code: () => string;
  clauses: ExportClause[];
}

export interface DeclEntry extends Entry {
  declarations: Declaration[];
  exports: Exports | null;
}

const parseDeclarations = (file: string) => {
  const prog = tsParserProgram({
    files: [file],
  });

  const source = prog.getSourceFile(file);
  if (!source) {
    const logs = prog.getSyntacticDiagnostics();
    console.log(logs);
    return error.fatal("Missing source file for '%s' in tsc", file);
  }

  // if (source.)

  const declarations: Declaration[] = [];

  source.statements.forEach((statement, i) => {
    const start = statement.getStart(),
      end = statement.getEnd();

    for (const [test, kind] of declarationStatementChecks) {
      if (test(statement)) {
        const names = (
          ts.isVariableStatement(statement)
            ? statement.declarationList.declarations.map((d) =>
                d.name.getText()
              )
            : statement.name !== undefined
            ? [statement.name.getText()]
            : []
        ).filter((n, i, a) => a.indexOf(n) === i);

        const code = () => statement.getText(source);
        const properties = () => {
          if (
            !new RegExp("(" + names.map((n) => n).join("|") + "):\\s+{").test(
              code()
            )
          )
            return [];

          const nestedIterations = [
            ts.SyntaxKind.VariableDeclarationList,
            ts.SyntaxKind.SyntaxList,
            ts.SyntaxKind.VariableDeclaration,
            ts.SyntaxKind.TypeLiteral,
            ts.SyntaxKind.SyntaxList,
          ];

          let target: ts.Node | undefined = undefined,
            current: ts.Node | undefined = statement;

          for (let i = 0; i < nestedIterations.length; i++) {
            const kind = nestedIterations[i];
            current = current!.getChildren().find((c) => c.kind === kind);
            if (!current) {
              break;
            }
            if (i === nestedIterations.length - 1) target = current;
          }

          if (!target) return [];

          const signatures = target
            .getChildren()
            .filter(
              (c) =>
                c.kind === ts.SyntaxKind.MethodSignature ||
                c.kind === ts.SyntaxKind.PropertySignature
            );

          const properties = signatures.map((s): Declaration.Property => {
            const name = (s as any).name.getText(source),
              start = s.getStart(),
              end = s.getEnd(),
              code = () => s.getText(source);
            return {
              name,
              start,
              end,
              code,
            };
          });

          return properties;
        };

        for (const name of names) {
          const existing = declarations.find((d) => d.name === name);
          if (existing) {
            existing.end = end;
            existing.code = code;
            existing.properties = properties;
          } else {
            declarations.push({
              name,
              kind,
              start,
              end,
              code,
              properties,
            });
          }
        }

        return;
      }
    }

    if (ts.isExportDeclaration(statement)) {
      // rollup-plugin-dts will exclusively output .d.ts files with
      // a singular export declaration (export { util as default, ...rest }),
      // so there's no need to check for anything else
      const children = statement.getChildren(),
        clauses = children[1]
          .getText(source)
          .replace(/^\{\s+?/, "")
          .replace(/\s+?\}$/, "")
          .split(/\s*,\s*/);

      const exportClauses: ExportClause[] = [];

      for (const clause of clauses) {
        const [name, _as] = clause.split(/\s+as\s+/),
          as = _as?.trim() || name;

        exportClauses.push({
          name,
          as,
        });
      }

      exports = {
        start,
        end,
        code: () => statement.getText(source),
        clauses: exportClauses,
      };
    }
  });

  return {
    declarations,
    code: source.getText(),
  };
};

export default parseDeclarations;
