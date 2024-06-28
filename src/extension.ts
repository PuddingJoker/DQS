import * as vscode from "vscode";
import { disposables, dqs } from "./code/sort.ext";


export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(dqs);
}

export function deactivate() { 
  disposables.forEach(d => d.dispose());
}

