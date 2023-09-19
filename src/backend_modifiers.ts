import * as fs from "fs";

import chalk from "chalk";
import { dirname } from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const runBackendModifiers = async (data: any) => {
  const configPath = path.join(__dirname, "../../backend", "config.json");

  try {
    const configFileContent = fs.readFileSync(configPath, "utf8");
    const configData = JSON.parse(configFileContent);

    configData.port = data.port;

    const updatedConfigFileContent = JSON.stringify(configData, null, 2);
    fs.writeFileSync(configPath, updatedConfigFileContent, "utf8");

    console.log(
      "[" + chalk.greenBright("SUCCESS") + "] Backend config updated"
    );
  } catch (err) {
    console.log(chalk.red("Error writing config.json"));
  }
};
