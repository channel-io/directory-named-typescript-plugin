# Summary
This plugin allows using directory name module import.

If you adapt [directory-named-webpack-plugin](https://github.com/shaketbaby/directory-named-webpack-plugin) with TypeScript, you head `TS2307: Cannot find module` error. This plugin fix those problem.

The plugin doesn't change transpiled bundle file. (We prefer install `directory-named-webpack-plugin` together if you use Webpack.)

# Install
```bash
npm install directory-named-typescript-plugin
```

Then, insert plugin name to tsconfig.json.
```json
{
  "compilerOptions": {
    "plugins": [{
      "name": "directory-named-typescript-plugin"
    }]
  }
}
```

Additionally, if you use VSCode, you should change VSCode setting like this:
```tsx
{
  ...
  "typescript.tsserver.pluginPaths": [
    "directory-named-typescript-plugin"
  ]
}
```
