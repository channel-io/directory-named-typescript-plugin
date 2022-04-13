import type * as ts from 'typescript/lib/tsserverlibrary'

import FileHelper from './FileHelper'

const LOG_NAME = 'DirectoryNamedTypescriptPlugin'

function DirectoryNamedTypescriptPlugin({ typescript }: { typescript: typeof ts }) {
  const fileHelper = new FileHelper()

  function create(info: ts.server.PluginCreateInfo): ts.LanguageService {
    const superResolveModuleNames: typeof info.languageServiceHost.resolveModuleNames = info.languageServiceHost.resolveModuleNames.bind(info.languageServiceHost)

    info.languageServiceHost.resolveModuleNames = (moduleNames, containingFile, reusedNames, redirectedReference, options, containingSourceFile) => {
      info.project.projectService.logger.info(`${LOG_NAME}: ${JSON.stringify(moduleNames)}`)

      const newModuleNames = moduleNames.map(moduleName => {
        const resolvedModule = typescript.resolveModuleName(moduleName, containingFile, options, fileHelper.getHost())
        if (resolvedModule.resolvedModule || !fileHelper.isInternalDirectoryModule(moduleName)) { return moduleName }
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
