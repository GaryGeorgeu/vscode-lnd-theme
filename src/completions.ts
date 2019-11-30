
import * as vscode from 'vscode'

const theme = require('@lessondesk/theme')
const { getAccessorDescriptors } = require('./utils')

export function addCompletions(context: vscode.ExtensionContext) {
  const completionItems = createCompletionItems(theme)

  const provider = vscode.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
      const linePrefix = document.lineAt(position).text.substr(0, position.character)
      const matchingPrefixes = completionItems.filter(item => item && linePrefix.endsWith(item.prefix))

      return matchingPrefixes.map(({ key, desc }) => {
        const completionItem = new vscode.CompletionItem(key, vscode.CompletionItemKind.Enum)
        completionItem.detail = desc
        completionItem.sortText = `00${key}`
        return completionItem
      })
    }
  }, '.')

  context.subscriptions.push(provider)
}

export function createCompletionItems(object, prefix = 'theme.') {

  return Object.entries(object).map(([key, value]) => Array.isArray(value)
    ? createArrayDescriptorCompletions(key, value)
    : createDefaultCompletion(prefix, key)
  )
    .reduce((acc, c) => acc.concat(c), [])

  function createArrayDescriptorCompletions(key, value) {
    const variants = getAccessorDescriptors(value)
    const mainCompletion = { prefix, key }
    const variantCompletions = variants.map(variant =>
      createDefaultCompletion(`${prefix}${key}.`, variant, `${variant} variant of ${key}`)
    )
    return [mainCompletion, ...variantCompletions]
  }

  function createDefaultCompletion(prefix, key, desc = '') {
    if (typeof object[key] === 'object') {
      return createCompletionItems(object[key], `${prefix}${key}.`)
    }

    return { prefix, key, desc }
  }
}