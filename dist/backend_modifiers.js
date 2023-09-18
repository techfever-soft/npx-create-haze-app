import * as fs from "fs";
import chalk from "chalk";
import path from "path";
export const runBackendModifiers = (data) => {
    const configPath = path.join("./backend", "config.json");
    try {
        const configFileContent = fs.readFileSync(configPath, "utf8");
        const configData = JSON.parse(configFileContent);
        configData.port = data.port;
        const updatedConfigFileContent = JSON.stringify(configData, null, 2);
        fs.writeFileSync(configPath, updatedConfigFileContent, "utf8");
        console.log("[" + chalk.greenBright("SUCCESS") + "] Backend config updated");
    }
    catch (err) {
        console.log(chalk.red("Error writing config.json"));
    }
};
