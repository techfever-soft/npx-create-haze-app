#!/usr/bin/env node

import { confirm, input } from "@inquirer/prompts";

import chalk from "chalk";
import { exec } from "child_process";
import { runBackendModifiers } from "./backend_modifiers.js";
import { runFrontendModifiers } from "./frontend_modifiers.js";

console.log(chalk.bgHex("#3f51b5").bold("Welcome to HazeCMS install !"));
console.log(
  "[" +
    chalk.blueBright("INFO") +
    "] You can follow full documentation at: https://docs.hazecms.com"
);
console.log(" ");

/**
 * NOTE: Frontend configuration
 */

console.log(chalk.bgHex("#ffeb3b").bold("Front-end configuration"));
// const frontendAppName = await input({
//   message: "Which app name do you want to use ?",
//   default: "MyAwesomeApp",
// });
const frontendFolderName = await input({
  message: "Which folder name for front-end code ?",
  default: "frontend",
});
const frontendInstallDependenciesNow = await confirm({
  message: "Do you want to install dependencies now ?",
  default: false,
});

console.log(" ");

/**
 * NOTE: Backend configuration
 */

console.log(chalk.bgHex("#ffeb3b").bold("Back-end configuration"));
const backendFolderName = await input({
  message: "Which folder name for back-end code ?",
  default: "backend",
});
const backendPort = await input({
  message: "Which port number for the back-end server ?",
  default: "3000",
});
const backendInstallDependenciesNow = await confirm({
  message: "Do you want to install dependencies now ?",
  default: false,
});

/**
 * NOTE: Clone frontend
 */

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

  runFrontendModifiers({});

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

/**
 * NOTE: Clone backend
 */

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

  runBackendModifiers({
    port: backendPort,
  });

  if (backendInstallDependenciesNow) {
    exec("cd ./backend && npm i", (err, stdout, stderr) => {
      console.log(
        "[" + chalk.greenBright("SUCCESS") + "] Back-end dependencies installed"
      );
    });
  }
});
