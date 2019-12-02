import * as vscode from 'vscode'
import { theme } from '@lessondesk/theme'

const { createColorDecorators, updateThemeColors } = require('./decorators')
const { addCompletions } = require('./completions')
const { addColorConverter } = require('./color-converter')

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "lnd-theme" is now active!')
  addCompletions(context)
  addColorConverter(context)
  createColorDecorators()
  attachEventHandlers()
  updateThemeColors()
}

function attachEventHandlers() {
  vscode.workspace.onDidChangeTextDocument(updateThemeColors)
}

// this method is called when your extension is deactivated
export function deactivate() {}
