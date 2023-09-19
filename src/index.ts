#!/usr/bin/env node

import * as fs from "fs";

import { confirm, input } from "@inquirer/prompts";

import chalk from "chalk";
import { dirname } from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import { runBackendModifiers } from "./backend_modifiers.js";
import { runFrontendModifiers } from "./frontend_modifiers.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../package.json"), "utf-8")
) as { version: string };

console.log(
  chalk
    .bgHex("#3f51b5")
    .bold("Welcome to HazeCMS v" + packageJson.version + " install !")
);
console.log(
  "[" +
    chalk.blueBright("INFO") +
    "] You can follow full documentation at: " +
    chalk.bold("https://docs.hazecms.com")
);
console.log(" ");

/**
 * NOTE: Frontend configuration
 */

let frontendFolderName: string;
let frontendInstallDependenciesNow: boolean;

const frontendConfig = async () => {
  console.log(chalk.bgHex("#ffeb3b").bold("Front-end configuration"));

  // TODO: App name
  // const frontendAppName = await input({
  //   message: "Which app name do you want to use ?",
  //   default: "MyAwesomeApp",
  // });
  frontendFolderName = await input({
    message: "Which folder name for front-end code ?",
    default: "frontend",
  });
  frontendInstallDependenciesNow = await confirm({
    message: "Do you want to install dependencies now ?",
    default: false,
  });

  console.log(" ");
};

/**
 * NOTE: Backend configuration
 */

let backendFolderName: string;
let backendPort: string;
let backendInstallDependenciesNow: boolean;

const backendConfig = async () => {
  console.log(chalk.bgHex("#ffeb3b").bold("Back-end configuration"));

  backendFolderName = await input({
    message: "Which folder name for back-end code ?",
    default: "backend",
  });
  backendPort = await input({
    message: "Which port number for the back-end server ?",
    default: "3000",
  });
  backendInstallDependenciesNow = await confirm({
    message: "Do you want to install dependencies now ?",
    default: false,
  });
};

/**
 * NOTE: Clone frontend
 */

const cloneFrontend = async () => {
  const cloneClientRepository =
    "git clone https://github.com/techfever-soft/hazecms-frontend.git ./" +
    frontendFolderName;
  exec(cloneClientRepository, (err, stdout, stderr) => {
    if (err) {
      console.log(chalk.red("Error when cloning client repository"));
      return;
    }

    console.log(
      "[" + chalk.greenBright("SUCCESS") + "] Front-end repository cloned"
    );

    if (frontendInstallDependenciesNow) {
      exec("cd ./frontend && npm i", (err, stdout, stderr) => {
        console.log(
          "[" +
            chalk.greenBright("SUCCESS") +
            "] Front-end dependencies installed"
        );
      });
    }
  });
};

/**
 * NOTE: Clone backend
 */

const cloneBackend = async () => {
  return new Promise((resolve) => {
    const cloneServerRepository =
      "git clone https://github.com/techfever-soft/hazecms-backend.git ./" +
      backendFolderName;

    exec(cloneServerRepository, (err, stdout, stderr) => {
      if (err) {
        console.log(chalk.red("Error when cloning server repository"));
        return;
      }
      console.log(
        "[" + chalk.greenBright("SUCCESS") + "] Back-end repository cloned"
      );

      if (backendInstallDependenciesNow) {
        exec("cd ./backend && npm i", (err, stdout, stderr) => {
          console.log(
            "[" +
              chalk.greenBright("SUCCESS") +
              "] Back-end dependencies installed"
          );
        });
      }

      resolve({});
    });
  });
};

/**
 * NOTE: Startup
 */

const startup = async () => {
  await frontendConfig();
  await backendConfig();

  await cloneFrontend();
  await cloneBackend().then(async () => {
    await runBackendModifiers({
      port: backendPort,
    });
  });

  await runFrontendModifiers({});
};

startup();
