#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const excel_1 = require("./excel");
const program = new commander_1.Command();
program.version("1.0.0");
program
    .requiredOption("-i | --inDir <Exldir>", "excel in to dir")
    .requiredOption("-o | --outDir <Outdir>", "result folder out to dir")
    .option("-n | --name [Name]", "result out folder file name", "i18n-land")
    .option("-l | --lang [Lang...]", "you can choose output lang", ['en', 'zh']);
program.parse();
const options = program.opts();
console.log(options);
(0, excel_1.i18nExcel)(options);
//# sourceMappingURL=bin.js.map