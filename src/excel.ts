import xlsx from "node-xlsx";
import _ from "lodash";
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
//为什么要用map不用object 因为map有序
const resultMap = new Map(); //收集数据
export default function i18nExcel(option: CommanderQuery) {
  const { inDir, outDir, name, lang } = Object.assign(
    {
      inDir: path.join("./", "i18n-land.xlsx"),
      outDir: path.join("./"),
      name: "i18n-land",
      lang: ["zh", "en"],
    },
    option
  );
  excelFilePath = inDir;
  outFolderPath = path.join(outDir, name);
  const { data: excelData }: any = xlsx.parse(excelFilePath)[0];

  const outFolderExists = fs.existsSync(outFolderPath);
  if (outFolderExists) {
    //文件夹存在删除掉
    removeDir(outFolderPath);
  }
  fs.mkdirSync(outFolderPath);
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
        trMap.set(needFindKey[i], index as number);
        if (!["key", "documentName"].includes(needFindKey[i])) {
          resultObj[needFindKey[i]] = {};
        }
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
          if (resultMap.has(curDocName)) {
            //追加
            console.log("curDocName", curDocName);
            const pervDocVal = resultMap.get(curDocName);
            resultMap.set(curDocName, _.merge(pervDocVal, resultObj));
          } else {
            resultMap.set(curDocName, _.cloneDeep(resultObj));
          }
        }
        //跳出循环
        if (item[trMap.get("documentName")] === "end") {
          for (const [key, val] of resultMap) {
            outFolder.forEach((fold) => {
              const writeData = JSON.stringify(val[fold], undefined, "\t");
              const writePath = path.join(outFolderPath, fold, key!) + ".js";
              fs.writeFileSync(writePath, `export default ${writeData}`);
            });
          }
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
      lang.forEach((langItem) => {
        const curLangIdx = trMap.get(langItem);
        if (!curLangIdx) {
          throw new Error(`在${item}key值是${key},${langItem}语言的值为空`);
        }
        const keyArr = key.split(".");
        keyArr.reduce((perv, keyItem: string, index: number) => {
          if (index === keyArr.length - 1) {
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
    return true;
  });
  console.log("------翻译成功-----");
}

/**
 * 删除文件夹
 * dir:文件夹路径
 */
function removeDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const key in files) {
    const childPath = path.join(dir, files[key]);
    const childState = fs.statSync(childPath);
    if (childState.isDirectory()) {
      removeDir(childPath);
    } else {
      fs.unlinkSync(childPath);
    }
  }
  fs.rmdirSync(dir);
}
