import * as ts from 'typescript/lib/tsserverlibrary'

class FileHelper {
  fileExists(path: string) {
    return ts.sys.fileExists(path)
  }

  readFile(path: string) {
    return ts.sys.readFile(path)
  }

  isInternalDirectoryModule(path: string) {
    const paths = path.split('/')
    return paths.length > 1 && paths.slice(-1).indexOf('.') === -1
  }

  getHost(): ts.ModuleResolutionHost {
    return {
      fileExists: this.fileExists,
      readFile: this.readFile,
    }
  }
}

export default FileHelper