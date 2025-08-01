To package the extension:

```shell
npx @vscode/vsce package --skip-license --allow-missing-repository
```

To install the packaged extension:

```shell
code --install-extension anki-notes-*.vsix
```

Or make a right click on the extension file in the file explorer pane, then select "Install Extension VSIX".
