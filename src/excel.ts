import xlsx from "node-xlsx";
import type { CommanderQuery } from "./type";
import path from "path";
import fs from "fs";
let excelFilePath: string;
let outFolderPath: string;
let needFindKey: string[];
const resultObj: {
  [key: string]: any;
} = {};
const trMap = new Map();
export function i18nExcel({ inDir, outDir, name, lang }: CommanderQuery) {
  excelFilePath = inDir;
  outFolderPath = path.join(outDir, name);
  const { data: excelData }: any = xlsx.parse(excelFilePath)[0];

  const outFolderExists = fs.existsSync(outFolderPath);
  if (!outFolderExists) {
    //文件夹不存在
    fs.mkdirSync(outFolderPath);
  }
  let outFolder = fs.readdirSync(outFolderPath);
  lang.forEach((item) => {
    !outFolder.includes(item) && fs.mkdirSync(path.join(outFolderPath, item));
  });
  outFolder = fs.readdirSync(outFolderPath);
  needFindKey = ["documentName", "key"].concat(lang);
  for (let i = 0; i < needFindKey.length; i++) {
    const index = excelData[0].indexOf(needFindKey[i]);
    if (index === -1) {
      throw new Error(`excel格式错误,应该要有${needFindKey[i]}字段`);
    } else {
      if (!trMap.has(needFindKey[i])) {
        trMap.set(needFindKey[i], index);
        needFindKey[i] !== "documentName" &&
          Object.assign(resultObj, {
            [needFindKey[i]]: {},
          });
      }
    }
  }
  let curDocName: string | null = null;
  const keyIndex = trMap.get("key");
  excelData.every((item: string[], index: number) => {
    if (index === 0) {
      return true;
    } else {
      if (item[trMap.get("documentName")]) {
        if (curDocName) {
          //把之前上一个文件的数据收集起来放进去
          outFolder.forEach((fold) => {
            const writeData = JSON.stringify(resultObj[fold], undefined, "\t");
            fs.writeFileSync(
              path.join(outFolderPath, fold, curDocName!) + ".js",
              `export default ${writeData}`
            );
          });
        }
        //跳出循环
        if (item[trMap.get("documentName")] === "end") {
          return false;
        }
        curDocName = item[trMap.get("documentName")];

        for (const key in  resultObj) {
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
        keyArr.reduce((perv, keyItem: string, index: number) => {
          if (index === keyArr.length - 1) {
            if (!item[trMap.get(langItem)]) {
              throw new Error(`在${item}key值是${key},${langItem}语言的值为空`);
            }
            if (perv[keyItem]) {
              throw new Error(
                `在${item}那一行,key值重复了,key在同一个documentName应该唯一`
              );
            }
            return (perv[keyItem] = item[trMap.get(langItem)] as string);
          }
          if (!perv[keyItem]) {
            return (perv[keyItem] = {});
          }
          return perv[keyItem];
        }, resultObj[langItem]);
      });
    }
    return true
  });
    console.log("------翻译成功-----");
}
