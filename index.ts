import type * as ts from 'typescript/lib/tsserverlibrary'

const LOG_NAME = 'DirectoryNamedTypescriptPlugin'

function DirectoryNamedTypescriptPlugin({ typescript }: { typescript: typeof ts }) {
  function fileExists(path: string) {
    return typescript.sys.fileExists(path)
  }

  function readFile(path: string) {
    return typescript.sys.readFile(path)
  }

  function isInternalDirectoryModule(path: string) {
    const paths = path.split('/')
    return paths.length > 1 && paths.slice(-1).indexOf('.') === -1
  }

  function create(info: ts.server.PluginCreateInfo): ts.LanguageService {
    const superResolveModuleNames: typeof info.languageServiceHost.resolveModuleNames = info.languageServiceHost.resolveModuleNames.bind(info.languageServiceHost)

    info.languageServiceHost.resolveModuleNames = (moduleNames, containingFile, reusedNames, redirectedReference, options, containingSourceFile) => {
      info.project.projectService.logger.info(`${LOG_NAME}: ${JSON.stringify(moduleNames)}`)

      const newModuleNames = moduleNames.map(moduleName => {
        const resolvedModule = typescript.resolveModuleName(moduleName, containingFile, options, { fileExists, readFile })
        if (resolvedModule.resolvedModule || !isInternalDirectoryModule(moduleName)) { return moduleName }
        const fileName = moduleName.split('/').slice(-1)
        return `${moduleName}/${fileName}`
      })

      info.project.projectService.logger.info(`${LOG_NAME}: => ${JSON.stringify(newModuleNames)}`)
      return superResolveModuleNames(newModuleNames, containingFile, reusedNames, redirectedReference, options, containingSourceFile)
    }

    return info.languageService
  }

  return {
    create,
  }
}

export = DirectoryNamedTypescriptPlugin
