import * as vscode from 'vscode';
import sort from './code/sort.ext';
import imp from './code/autoImp.ext';


export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(sort);
  context.subscriptions.push(imp);
}

export function deactivate() {}
