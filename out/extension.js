"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const { createColorDecorators, updateThemeColors } = require('./decorators');
const { addCompletions } = require('./completions');
function activate(context) {
    console.log('Congratulations, your extension "lnd-theme" is now active!');
    addCompletions(context);
    createColorDecorators();
    attachEventHandlers();
    updateThemeColors();
}
exports.activate = activate;
function attachEventHandlers() {
    vscode.workspace.onDidChangeTextDocument(updateThemeColors);
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map