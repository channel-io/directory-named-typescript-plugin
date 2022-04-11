"use strict";
var LOG_NAME = 'DirectoryNamedTypescriptPlugin';
function DirectoryNamedTypescriptPlugin(_a) {
    var typescript = _a.typescript;
    function fileExists(path) {
        return typescript.sys.fileExists(path);
    }
    function readFile(path) {
        return typescript.sys.readFile(path);
    }
    function isInternalDirectoryModule(path) {
        var paths = path.split('/');
        return paths.length > 1 && paths.slice(-1).indexOf('.') === -1;
    }
    function create(info) {
        var superResolveModuleNames = info.languageServiceHost.resolveModuleNames.bind(info.languageServiceHost);
        info.languageServiceHost.resolveModuleNames = function (moduleNames, containingFile, reusedNames, redirectedReference, options, containingSourceFile) {
            info.project.projectService.logger.info("".concat(LOG_NAME, ": ").concat(JSON.stringify(moduleNames)));
            var newModuleNames = moduleNames.map(function (moduleName) {
                var resolvedModule = typescript.resolveModuleName(moduleName, containingFile, options, { fileExists: fileExists, readFile: readFile });
                if (resolvedModule.resolvedModule || !isInternalDirectoryModule(moduleName)) {
                    return moduleName;
                }
                var fileName = moduleName.split('/').slice(-1);
                return "".concat(moduleName, "/").concat(fileName);
            });
            info.project.projectService.logger.info("".concat(LOG_NAME, ": => ").concat(JSON.stringify(newModuleNames)));
            return superResolveModuleNames(newModuleNames, containingFile, reusedNames, redirectedReference, options, containingSourceFile);
        };
        return info.languageService;
    }
    return {
        create: create
    };
}
module.exports = DirectoryNamedTypescriptPlugin;
