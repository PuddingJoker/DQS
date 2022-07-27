import * as vscode from "vscode";

const autoImp = vscode.commands.registerCommand("dqs.imp", () => {
  const currentEditor = vscode.window.activeTextEditor;
  if (!currentEditor) {
    return;
  }
  const reg = /(\S+)(\.imp)$/;
  const { selection, document } = currentEditor;
  const position = document.getWordRangeAtPosition(selection.anchor, reg);
  if (!position) {
    return vscode.window.showInformationMessage(
      "您应该输入这种格式: xxx.imp"
    );
  }

  const docText = document.getText(position);
  const tempArr = reg.exec(docText);
  const prefix = tempArr && tempArr[1];
  const replaceText = `import ${prefix} from "@/assets/images/${prefix}.png"`;

  currentEditor
    .edit(editer => {
      editer.replace(position, replaceText);
    })
    .then(() => {
      const line = position.start.line;
      const index = document.lineAt(line).firstNonWhitespaceCharacterIndex;

      currentEditor.selection = new vscode.Selection(
        new vscode.Position(line, replaceText.length + index),
        new vscode.Position(line, replaceText.length + index)
      );
    });
});

export default autoImp;
