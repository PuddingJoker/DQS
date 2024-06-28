import * as prettier from 'prettier';
import * as vscode from 'vscode';

const fs = require("fs");
const path = require("path")

function sortAndOrganizeImports(code: string, isVue: boolean): string {
  // 将代码按行分割
  let lines = code.split('\n');

  // 定义存储各类 import 的数组
  let defaultImports: string[] = [];
  let otherImports: string[] = [];
  let otherLines: string[] = [];

  // vue的依赖开始排序
  let vueDepStart = false;

  // 遍历每一行，根据 import 关键字和路径判断分类
  lines.forEach((line) => {
    line = line.trim(); // 去除首尾空格

    if (line?.startsWith('import')) {
      let importStatement = line.match(
        /^import\s+((?:{[^}]*})?|[^'"]+)\s+from\s+['"]([^'"]+)['"]/
      );
      if (importStatement) {
        let [, imports, path] = importStatement;
        // 判断路径是否为默认依赖
        if (!['./', '../', '@/', '~/'].some((prefix) => path?.startsWith(prefix))) {
          !imports?.startsWith('{') ? defaultImports.unshift(line) : defaultImports.push(line);
        } else {
          !imports?.startsWith('{') ? otherImports.unshift(line) : otherImports.push(line);
        }
      } else {
        otherLines.push(line); // 无法解析的 import 语句，默认放入其他行
      }


      if (isVue) vueDepStart = true

    } else {
      if (vueDepStart) {
        otherLines.push(...defaultImports, ...otherImports)
        vueDepStart = false
      }

      otherLines.push(line); // 非 import 行，默认放入其他行
    }
  });

  // 合并排序后的结果
  let sortedCode: string = (isVue ? otherLines : [
    ...defaultImports,
    ...otherImports,
    ...otherLines
  ]).join('\n');

  return sortedCode;
}

const start = async (currentEditor: vscode.TextEditor) => {
  const { document } = currentEditor;
  // 获取当前执行的文件路径
  const currentlyOpenTabfilePath = document.fileName;
  // 读取内容
  let fileContent = fs.readFileSync(currentlyOpenTabfilePath, "utf8");
  const fileExtension = path.extname(currentlyOpenTabfilePath)
  const parser = fileExtension == '.vue' ? 'vue' : 'typescript'

  fileContent = sortAndOrganizeImports(fileContent, parser == 'vue')

  // 读取配置项，决定是否执行操作命令
  const config = vscode.workspace.getConfiguration('DQS');
  // 排序后自动格式化
  const formatAfterSort = config.get('formatAfterSort', true); // 默认为 true

  if (formatAfterSort) {
    const formatted = await prettier.format(fileContent, { semi: false, parser });
    fs.writeFileSync(currentlyOpenTabfilePath, formatted);
  } else {
    fs.writeFileSync(currentlyOpenTabfilePath, fileContent);
  }
}

// 定义出发的命令，要和package.json的一致
const dqs = vscode.commands.registerCommand("dqs.sort", async () => {
  // vscode api
  const currentEditor = vscode.window.activeTextEditor;
  if (!currentEditor) {
    return;
  }

  start(currentEditor)
});

const disposables = vscode.workspace.onDidSaveTextDocument(async (document) => {
  // 读取配置项，决定是否执行操作命令
  const config = vscode.workspace.getConfiguration('DQS');
  // 保存时自动排序
  const sortOnSaveEnabled = config.get('sortOnSaveEnabled', true); // 默认为 true

  // 确保只在当前活动的文档保存时执行操作
  if (vscode.window.activeTextEditor && document === vscode.window.activeTextEditor.document && sortOnSaveEnabled) {
    await start(vscode.window.activeTextEditor);
  }
});

export {
  disposables,
  dqs
};



