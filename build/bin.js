#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commander_1 = require("commander");
const excel_1 = tslib_1.__importDefault(require("./excel"));
const path_1 = tslib_1.__importDefault(require("path"));
const program = new commander_1.Command();
program.version("1.0.0");
program
    .option("-i | --inDir <Exldir>", "excel in to dir", path_1.default.join("./", "i18n-land.xlsx"))
    .option("-o | --outDir <Outdir>", "result folder out to dir", path_1.default.join("./"))
    .option("-n | --name [Name]", "result out folder file name", "i18n-land")
    .option("-l | --lang [Lang...]", "you can choose output lang", ["en", "zh"]);
program.parse();
const options = program.opts();
console.log(options);
(0, excel_1.default)(options);
//# sourceMappingURL=bin.js.map