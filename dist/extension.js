/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(2);
const fs = __webpack_require__(3);
const dqs = // 定义出发的命令，要和package.json的一致
 vscode.commands.registerCommand("dqs.sort", () => {
    // vs vode api
    const currentEditor = vscode.window.activeTextEditor;
    if (!currentEditor) {
        return;
    }
    // 匹配 依赖引入的正则
    const reg = /\s*import\s*(.+)\s*from\s*(.+)\s*\;*/g;
    const { document } = currentEditor;
    // 获取当前执行的文件路径
    const currentlyOpenTabfilePath = document.fileName;
    // 读取内容
    let fileContentArr = fs.readFileSync(currentlyOpenTabfilePath, "utf8");
    // newContent 是最后渲染的的内容 这里是匹配出所有的依赖句子
    let newContent = fileContentArr.matchAll(reg);
    // 统计一共有几句依赖，后续把依赖都替换成星号，然后再将星号替换成 newContent
    let depLength = 0;
    // 官方的 依赖数组  React、Vue等
    let originDepArr = [];
    // 自身的依赖数组  "../../***"
    let selfDepArr = [];
    // 自身最原始的依赖数组
    let originSelfDepArr = [];
    // 遍历匹配的内容
    for (let i of newContent) {
        depLength++;
        // 判断是否是 官方的依赖
        if (i[2].indexOf("/") == -1 && i[2].indexOf(".") == -1) {
            originDepArr.push({
                dep: i[1],
                from: i[2].replace("-", ""),
            });
        }
        else {
            originSelfDepArr.push({
                dep: i[1],
                from: i[2],
            });
            // 将除了字母以外的符号去掉，方便排序   {useEffect} => useEffect
            selfDepArr.push({
                dep: i[1].replace(/\{|\}|\,/g, ""),
                from: i[2],
            });
        }
    }
    // 单词排序
    function alphabeticSorting(params, key) {
        return params.sort((a, b) => {
            let x = a[key], y = b[key];
            return x > y ? 1 : x < y ? -1 : 0;
        });
    }
    const originDepArr2 = alphabeticSorting(originDepArr, "dep");
    const selfDepArr2 = alphabeticSorting(selfDepArr, "dep");
    // 获取排序后的依赖顺序
    const selfDepKeys = selfDepArr2.map((item) => item.from);
    // 最后要渲染的依赖数组
    const renderArr = [];
    // 对官方的依赖进行排序  如果是 React等 就放在最前面
    for (let i = originDepArr2.length - 1; i >= 0; i--) {
        const from = originDepArr2[i].from;
        if (/vue|react|angular/gi.test(from)) {
            renderArr.unshift(originDepArr2[i]);
        }
        else {
            renderArr.push(originDepArr2[i]);
        }
    }
    // 对自己的依赖进行排序
    selfDepKeys.map((key) => {
        originSelfDepArr.map(item => {
            if (item.from === key) {
                renderArr.push(item);
            }
        });
    });
    // 最后的依赖顺序
    let str = ``;
    // 拼接字符串
    renderArr.map((item, index) => {
        const str3 = index == renderArr.length - 1
            ? `\n import ${item.dep} from ${item.from} \n`
            : `\n import ${item.dep} from ${item.from}`;
        str += str3;
    });
    // 将本身的语句全部替换为星号
    newContent = fileContentArr.replace(reg, "*");
    //统计星号 再将星号替换成 最后的字符串
    let replaceStr = "";
    for (let i = 0; i < depLength; i++) {
        replaceStr += "*";
    }
    newContent = newContent.replace(replaceStr, str);
    // 渲染
    fs.writeFileSync(currentlyOpenTabfilePath, newContent);
});
exports["default"] = dqs;


/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(2);
const autoImp = vscode.commands.registerCommand("dqs.imp", () => {
    const currentEditor = vscode.window.activeTextEditor;
    if (!currentEditor) {
        return;
    }
    const reg = /(\S+)(\.imp)$/;
    const { selection, document } = currentEditor;
    const position = document.getWordRangeAtPosition(selection.anchor, reg);
    if (!position) {
        return vscode.window.showInformationMessage("您应该输入这种格式: xxx.imp");
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
        currentEditor.selection = new vscode.Selection(new vscode.Position(line, replaceText.length + index), new vscode.Position(line, replaceText.length + index));
    });
});
exports["default"] = autoImp;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const sort_ext_1 = __webpack_require__(1);
const autoImp_ext_1 = __webpack_require__(4);
function activate(context) {
    context.subscriptions.push(sort_ext_1.default);
    context.subscriptions.push(autoImp_ext_1.default);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map