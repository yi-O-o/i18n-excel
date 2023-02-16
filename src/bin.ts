#!/usr/bin/env node
import { Command } from "commander";
import i18nExcel from "./excel";
import type { CommanderQuery } from "./type";
import path from "path";
const program = new Command();
program.version("1.0.0");

program
  .option(
    "-i | --inDir <Exldir>",
    "excel in to dir",
    path.join("./", "i18n-land.xlsx")
  )
  .option("-o | --outDir <Outdir>", "result folder out to dir", path.join("./"))
  .option("-n | --name [Name]", "result out folder file name", "i18n-land")
  .option("-l | --lang [Lang...]", "you can choose output lang", ["en", "zh"]);

program.parse();
const options: CommanderQuery = program.opts();
console.log(options);
i18nExcel(options);
