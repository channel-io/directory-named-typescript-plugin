# Summary
This plugin allows using directory name module import.

If you adapt [directory-named-webpack-plugin](https://github.com/shaketbaby/directory-named-webpack-plugin) with TypeScript, you head `TS2307: Cannot find module` error. This plugin fix those problem.

The plugin doesn't change transpiled bundle file. (We recommend install `directory-named-webpack-plugin` together if you use Webpack.)

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

# Example
- As-is
  ```tsx
  import FooComponent from 'src/components/Foo/Foo.tsx'
  ```

- To-be
  ```tsx
  import FooComponent from 'src/components/Foo'
  ```
