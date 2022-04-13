import type * as ts from 'typescript'
import type {} from 'ts-expose-internals'

import FileHelper from './FileHelper'

function transformer(program: ts.Program, host: ts.CompilerHost | undefined, options: any, { ts: typescript }: { ts: typeof ts }): ts.Program {
  const fileHelper = new FileHelper()

  const compilerOptions = program.getCompilerOptions()

  const fileCache = new Map()
  const rootFileNameSet = new Set(program.getRootFileNames())

  function transformAst(ctx: ts.TransformationContext) {
    return (sourceFile: ts.SourceFile) => {
      function visitor(node: ts.Node): ts.Node {
        if (typescript.isImportDeclaration(node)) {
          const moduleName = node.moduleSpecifier.getText(sourceFile).slice(1, -1)
          const isValidModule = !!typescript.resolveModuleName(moduleName, sourceFile.fileName, compilerOptions, fileHelper.getHost()).resolvedModule
          if (!isValidModule && fileHelper.isInternalDirectoryModule(moduleName)) {
            const fileName = moduleName.split('/').slice(-1)
            const newModuleSpecifier = typescript.factory.createStringLiteral(`${moduleName}/${fileName}`)
            return typescript.factory.updateImportDeclaration(node, node.decorators, node.modifiers, node.importClause, newModuleSpecifier, undefined)
          }
        }
        return typescript.visitEachChild(node, visitor, ctx)
      }
      return typescript.visitEachChild(sourceFile, visitor, ctx)
    }
  }

  const compilerHost = host ?? typescript.createCompilerHost(compilerOptions, true)
  const superGetSourceFile = compilerHost.getSourceFile.bind(compilerHost) as typeof compilerHost.getSourceFile

  compilerHost.getSourceFile = (fileName: string, ...rest) => {
    const key = typescript.normalizePath(fileName)
    if (fileCache.has(key)) { return fileCache.get(key) }
    const result = superGetSourceFile(fileName, ...rest)
    fileCache.set(key, result)
    return result
  }

  const transformedSource = typescript.transform(
    program.getSourceFiles().filter(sourceFile => rootFileNameSet.has(sourceFile.fileName)),
    [transformAst],
    compilerOptions,
  ).transformed

  const { printFile } = typescript.createPrinter()
  transformedSource.forEach(sourceFile => {
    const { fileName, languageVersion } = sourceFile
    const updatedSourceFile = typescript.createSourceFile(fileName, printFile(sourceFile), languageVersion)
    fileCache.set(typescript.normalizePath(fileName), updatedSourceFile)
  })

  return typescript.createProgram(program.getRootFileNames(), compilerOptions, compilerHost, program)
}

export default transformer
