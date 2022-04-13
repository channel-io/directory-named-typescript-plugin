# directory-named-typescript-plugin
This plugin allows using directory name module import.

If you adapt [directory-named-webpack-plugin](https://github.com/shaketbaby/directory-named-webpack-plugin) with TypeScript, you head `TS2307: Cannot find module` error. This plugin fix those problem.

# Install
```bash
npm install directory-named-typescript-plugin
```

Then, configure plugin at tsconfig.json.
```json
{
  "compilerOptions": {
    "plugins": [{
      "name": "directory-named-typescript-plugin"
    }]
  }
}
```

Additionally, if you use VSCode, you should use the workspace typescript version ([see more](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript)) or change VSCode setting like this:
```tsx
{
  ...
  "typescript.tsserver.pluginPaths": [
    "directory-named-typescript-plugin"
  ]
}
```

# Apply for transpile
The plugin doesn't change transpiled bundle file. (because TypeScript could support only Language Service plugin what related to editor intellisense.)
When you wanna influence bundled file, you can choice a solution below.
1. Install [directory-named-webpack-plugin](https://github.com/shaketbaby/directory-named-webpack-plugin) together if you use Webpack.
2. Install [ts-patch](https://www.npmjs.com/package/ts-patch), and Apply `{ "transform": "directory-named-typescript-plugin/dist/transformer.js", "transformProgram": true }` transformer predefined.

# Example
- As-is
  ```tsx
  import FooComponent from 'src/components/Foo/Foo.tsx'
  ```

- To-be
  ```tsx
  import FooComponent from 'src/components/Foo'
  ```

# Inspired by
- [directory-named-webpack-plugin](https://github.com/shaketbaby/directory-named-webpack-plugin)
- [ts-patch](https://www.npmjs.com/package/ts-patch)
