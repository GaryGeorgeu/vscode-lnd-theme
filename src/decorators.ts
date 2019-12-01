import * as vscode from 'vscode';

const theme = require('@lessondesk/theme')
const Color = require('color')
const { getAccessorDescriptors, escapeRegExp } = require('./utils')

const decorators = {}

export function createColorDecorators() {
  Object.entries(theme.colors).forEach(([key, color]) => Array.isArray(color)
    ? createVariantsDecorators(key, color)
    : createDecorator(key, color)
  )

  function createVariantsDecorators(key, color) {
    const colorVariants = getAccessorDescriptors(color)

    colorVariants.forEach(variantKey => {
      createDecorator(`${key}.${variantKey}`, color[variantKey])
    })
  }

  function createDecorator(key, color) {
    const luminosity = Color(color).luminosity()
    const complementary = luminosity > 0.5 ? '#111' : '#FFF'

    const decorator = vscode.window.createTextEditorDecorationType({
      borderRadius: '3px',
      backgroundColor: color,
      color: complementary
    })
    decorators[key] = decorator
  }
}

export function updateThemeColors() {
  const editor = vscode.window.activeTextEditor
  if (!editor) return
  const text = editor.document.getText()

  Object.entries(decorators).forEach(([key, decorator]: [string, vscode.TextEditorDecorationType]) => {
    const regex = new RegExp(`(theme\\.)?colors\\.${escapeRegExp(key)}`, 'gim')
    const ranges = []
    let match

    while (match = regex.exec(text)) {
      const start = editor.document.positionAt(match.index);
      const end = editor.document.positionAt(match.index + match[0].length);
      const range = { range: new vscode.Range(start, end) };
      ranges.push(range)
    }

    editor.setDecorations(decorator, ranges)
  })
}