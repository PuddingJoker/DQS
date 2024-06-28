import * as vscode from "vscode";
import { disposables, dqs } from "./code/sort.ext";


export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(dqs, disposables);
}

export function deactivate() {
}

