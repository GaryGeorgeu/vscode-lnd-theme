import * as vscode from 'vscode'

const { colors } = require('@lessondesk/theme')
const { getAccessorDescriptors } = require('./utils')
const Color = require('color')

const rgbaAndHslRegex = /^(hsl|rgb)\((\d+%?,? ?){3}\)$/mi
const hexRegex = /^((#[0-9a-f]{6})|(#[0-9a-f]{3}))$/mi
const colorReferences = []

export function addColorConverter(context: vscode.ExtensionContext) {
  createColorReferences()
  console.log(colorReferences)
  let disposable = vscode.commands.registerCommand('extension.convertColorsToTheme', convertColor)
  context.subscriptions.push(disposable)
}

export function createColorReferences() {
  Object.keys(colors).forEach(key => Array.isArray(colors[key]) 
    ? createColorVariantReferences(colors[key], key)
    : colorReferences.push({ key, value: Color(colors[key]) })
  )

  function createColorVariantReferences(variants, key) {
    const variantKeys = getAccessorDescriptors(variants)
    variantKeys.forEach(variantKey => colorReferences.push({
      key: `${key}.${variantKey}`,
      value: Color(variants[variantKey])
    }))
  }
}

export function findClosestColor(value) {
  const color = Color(value)
  return colorReferences.reduce((lowest, current) => {
    const similarity = calculateSimilarity(current.value.red(), color.red()) + 
      calculateSimilarity(current.value.blue(), color.blue()) + 
      calculateSimilarity(current.value.green(), color.green()) +
      calculateSimilarity(current.value.alpha() * 255, color.alpha() * 255)

    return similarity < lowest.similarity 
      ? { similarity, value: current } 
      : lowest 
  }, { similarity: 1021 })

  function calculateSimilarity(v1, v2) {
    return Math.abs(v1 - v2)
  }
}

export function convertColor() {
  const editor = vscode.window.activeTextEditor
  if (!editor) return
  const { selection } = editor
  const text = editor.document.getText(selection)
  const isHex = hexRegex.test(text)
  const isRgb = rgbaAndHslRegex.test(text)
  if (!isHex && !isRgb) return
  const closest = findClosestColor(text)

  editor.edit(editBuilder => {
      editBuilder.replace(
        selection,
        `\${({ theme }) => theme.colors.${closest.value.key}}`
      )
  })
}