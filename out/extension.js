"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const { colors } = require('@lessondesk/theme');
const Color = require('color');
const decorators = {};
function activate(context) {
    console.log('Congratulations, your extension "lnd-theme" is now active!');
    vscode.window.showInformationMessage('Loaded');
    createColorDecorators();
    attachEventHandlers();
    let disposable = vscode.commands.registerCommand('extension.helloWorld', () => { });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function createColorDecorators() {
    Object.entries(colors).forEach(([key, color]) => Array.isArray(color)
        ? createVariantsDecorators(key, color)
        : createDecorator(key, color));
    function createVariantsDecorators(key, color) {
        const descriptors = Object.getOwnPropertyDescriptors(color);
        const colorVariants = Object.entries(descriptors)
            .filter(([key, descriptor]) => typeof descriptor.get === 'function')
            .map(([key]) => key);
        colorVariants.forEach(variantKey => {
            createDecorator(`${key}.${variantKey}`, color);
        });
    }
    function createDecorator(key, color) {
        const luminosity = Color(color).luminosity();
        const complementary = luminosity > 0.5 ? '#111' : '#FFF';
        const decorator = vscode.window.createTextEditorDecorationType({
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: complementary,
            borderRadius: '3px',
            backgroundColor: color,
            color: complementary
        });
        decorators[key] = decorator;
    }
}
function attachEventHandlers() {
    vscode.window.onDidChangeActiveTextEditor(updateThemeColors);
    vscode.workspace.onDidChangeTextDocument(updateThemeColors);
}
function updateThemeColors() {
    const editor = vscode.window.activeTextEditor;
    const text = editor.document.getText();
    Object.entries(decorators).forEach(([key, decorator]) => {
        const regex = new RegExp(`(theme\\.)?colors\\.${escapeRegExp(key)}`, 'gim');
        const ranges = [];
        let match;
        while (match = regex.exec(text)) {
            const start = editor.document.positionAt(match.index);
            const end = editor.document.positionAt(match.index + match[0].length);
            const range = { range: new vscode.Range(start, end) };
            ranges.push(range);
        }
        editor.setDecorations(decorator, ranges);
    });
}
// https://stackoverflow.com/a/6969486
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map