import * as vscode from 'vscode'

const { createColorDecorators, updateThemeColors } = require('./decorators')
const { addCompletions } = require('./completions')

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "lnd-theme" is now active!')
  addCompletions(context)
  createColorDecorators()
  attachEventHandlers()
  updateThemeColors()
}

function attachEventHandlers() {
  vscode.workspace.onDidChangeTextDocument(updateThemeColors)
}

// this method is called when your extension is deactivated
export function deactivate() {}
