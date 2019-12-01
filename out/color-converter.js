"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const { colors } = require('@lessondesk/theme');
const { getAccessorDescriptors } = require('./utils');
const Color = require('color');
const rgbaAndHslRegex = /^(hsl|rgb)\((\d+%?,? ?){3}\)$/mi;
const hexRegex = /^((#[0-9a-f]{6})|(#[0-9a-f]{3}))$/mi;
const colorReferences = [];
function addColorConverter(context) {
    createColorReferences();
    console.log(colorReferences);
    let disposable = vscode.commands.registerCommand('extension.convertColorsToTheme', convertColor);
    context.subscriptions.push(disposable);
}
exports.addColorConverter = addColorConverter;
function createColorReferences() {
    Object.keys(colors).forEach(key => Array.isArray(colors[key])
        ? createColorVariantReferences(colors[key], key)
        : colorReferences.push({ key, value: Color(colors[key]) }));
    function createColorVariantReferences(variants, key) {
        const variantKeys = getAccessorDescriptors(variants);
        variantKeys.forEach(variantKey => colorReferences.push({
            key: `${key}.${variantKey}`,
            value: Color(variants[variantKey])
        }));
    }
}
exports.createColorReferences = createColorReferences;
function findClosestColor(value) {
    const color = Color(value);
    return colorReferences.reduce((lowest, current) => {
        const similarity = calculateSimilarity(current.value.red(), color.red()) +
            calculateSimilarity(current.value.blue(), color.blue()) +
            calculateSimilarity(current.value.green(), color.green());
        return similarity < lowest.similarity
            ? { similarity, value: current }
            : lowest;
    }, { similarity: 1021 });
    function calculateSimilarity(v1, v2) {
        return Math.abs(v1 - v2);
    }
}
exports.findClosestColor = findClosestColor;
function convertColor() {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return;
    const { selection } = editor;
    const text = editor.document.getText(selection);
    const isHex = hexRegex.test(text);
    const isRgb = rgbaAndHslRegex.test(text);
    if (!isHex && !isRgb)
        return;
    const closest = findClosestColor(text);
    editor.edit(editBuilder => {
        editBuilder.replace(selection, `\${({ theme }) => theme.colors.${closest.value.key}}`);
    });
}
exports.convertColor = convertColor;
//# sourceMappingURL=color-converter.js.map