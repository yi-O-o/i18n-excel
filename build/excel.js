"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.i18nExcel = void 0;
const tslib_1 = require("tslib");
const node_xlsx_1 = tslib_1.__importDefault(require("node-xlsx"));
const child_process_1 = require("child_process");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
let excelFilePath;
let outFolderPath;
let needFindKey;
const resultObj = {};
const trMap = new Map();
function i18nExcel({ inDir, outDir, name, lang }) {
    excelFilePath = inDir;
    outFolderPath = path_1.default.join(outDir, name);
    const { data: excelData } = node_xlsx_1.default.parse(excelFilePath)[0];
    const outFolderExists = fs_1.default.existsSync(outFolderPath);
    if (outFolderExists) {
        //文件夹存在删除掉
        removeDir(outFolderPath);
    }
    fs_1.default.mkdirSync(outFolderPath);
    let outFolder = fs_1.default.readdirSync(outFolderPath);
    lang.forEach((item) => {
        !outFolder.includes(item) && fs_1.default.mkdirSync(path_1.default.join(outFolderPath, item));
    });
    outFolder = fs_1.default.readdirSync(outFolderPath);
    needFindKey = ["documentName", "key"].concat(lang);
    for (let i = 0; i < needFindKey.length; i++) {
        const index = excelData[0].indexOf(needFindKey[i]);
        if (index === -1) {
            throw new Error(`excel格式错误,应该要有${needFindKey[i]}字段`);
        }
        else {
            if (!trMap.has(needFindKey[i])) {
                trMap.set(needFindKey[i], index);
                needFindKey[i] !== "documentName" &&
                    Object.assign(resultObj, {
                        [needFindKey[i]]: {},
                    });
            }
        }
    }
    let curDocName = null;
    const keyIndex = trMap.get("key");
    excelData.every((item, index) => {
        if (index === 0) {
            return true;
        }
        else {
            if (item[trMap.get("documentName")]) {
                if (curDocName) {
                    //把之前上一个文件的数据收集起来放进去
                    outFolder.forEach((fold) => {
                        const writeData = JSON.stringify(resultObj[fold], undefined, "\t");
                        const writePath = path_1.default.join(outFolderPath, fold, curDocName) + ".js";
                        //支持documentName同名情况
                        if (fs_1.default.existsSync(writePath)) {
                            //如果有同名追加进去
                            (0, child_process_1.execSync)(`sed -i '' -e '$d' ${curDocName}.js`, {
                                cwd: path_1.default.join(outFolderPath, fold),
                            });
                            fs_1.default.writeFileSync(writePath, `,${writeData.slice(1)}`, {
                                flag: "a",
                            });
                        }
                        else {
                            fs_1.default.writeFileSync(writePath, `export default ${writeData}`);
                        }
                    });
                }
                //跳出循环
                if (item[trMap.get("documentName")] === "end") {
                    return false;
                }
                curDocName = item[trMap.get("documentName")];
                for (const key in resultObj) {
                    resultObj[key] = {};
                }
            }
            //增加数据
            const key = item[keyIndex];
            if (!key) {
                throw new Error(`在${index + 1}那一行，内容是${item}，的key为空 `);
            }
            const keyArr = key.split(".");
            lang.forEach((langItem) => {
                keyArr.reduce((perv, keyItem, index) => {
                    if (index === keyArr.length - 1) {
                        if (!item[trMap.get(langItem)]) {
                            throw new Error(`在${item}key值是${key},${langItem}语言的值为空`);
                        }
                        if (perv[keyItem]) {
                            throw new Error(`在${item}那一行,key值重复了,key在同一个documentName应该唯一`);
                        }
                        return (perv[keyItem] = item[trMap.get(langItem)]);
                    }
                    if (!perv[keyItem]) {
                        return (perv[keyItem] = {});
                    }
                    return perv[keyItem];
                }, resultObj[langItem]);
            });
        }
        return true;
    });
    console.log("------翻译成功-----");
}
exports.i18nExcel = i18nExcel;
/**
 * 删除文件夹
 * dir:文件夹路径
 */
function removeDir(dir) {
    const files = fs_1.default.readdirSync(dir);
    for (const key in files) {
        const childPath = path_1.default.join(dir, files[key]);
        const childState = fs_1.default.statSync(childPath);
        if (childState.isDirectory()) {
            removeDir(childPath);
        }
        else {
            fs_1.default.unlinkSync(childPath);
        }
    }
    fs_1.default.rmdirSync(dir);
}
//# sourceMappingURL=excel.js.map