"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.i18nExcel = void 0;
const tslib_1 = require("tslib");
const node_xlsx_1 = tslib_1.__importDefault(require("node-xlsx"));
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
    if (!fs_1.default.existsSync(excelFilePath)) {
        throw new Error("excel文件不存在，请检查输入路径");
    }
    const outFolderExists = fs_1.default.existsSync(outFolderPath);
    if (!outFolderExists) {
        //文件夹不存在
        fs_1.default.mkdirSync(outFolderPath);
    }
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
    excelData.forEach((item, index) => {
        if (index === 0) {
            return;
        }
        else {
            if (item[trMap.get("documentName")]) {
                if (curDocName) {
                    //把之前上一个文件的数据收集起来放进去
                    outFolder.forEach((fold) => {
                        const writeData = JSON.stringify(resultObj[fold], undefined, "\t");
                        fs_1.default.writeFileSync(path_1.default.join(outFolderPath, fold, curDocName) + ".js", `export default ${writeData}`);
                    });
                }
                if (item[trMap.get("documentName")] === "end") {
                    return;
                }
                curDocName = item[trMap.get("documentName")];
                for (const key in resultObj) {
                    resultObj[key] = {};
                }
            }
            //增加数据
            const key = item[keyIndex];
            if (!key) {
                throw new Error(`在${item}那一行的key为空 `);
            }
            const keyArr = key.split(".");
            lang.forEach((langItem) => {
                keyArr.reduce((perv, keyItem, index) => {
                    if (index === keyArr.length - 1) {
                        if (!item[trMap.get(langItem)]) {
                            throw new Error(`在${item}key值是${key},${langItem}语言的值为空`);
                        }
                        if (perv[keyItem]) {
                            throw new Error(`key值是${key}重复,key在同一个documentName应该唯一`);
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
    });
}
exports.i18nExcel = i18nExcel;
//# sourceMappingURL=excel.js.map