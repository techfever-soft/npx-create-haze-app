#!/usr/bin/env node

import { exec } from "child_process";
// import { input } from "@inquirer/prompts";

// const port = await input({
//   message: "HazeCMS backend server port :",
//   default: "3000",
// });
// console.log(port);

const cloneClientRepository =
  "git clone https://github.com/techfever-soft/hazecms-frontend.git ./frontend";
exec(cloneClientRepository, (err, stdout, stderr) => {
  if (err) {
    console.log("Error when cloning client repository");
    return;
  }

  console.info("HazeCMS (front-end) cloned");

  exec("cd ./frontend && npm i", (err, stdout, stderr) => {
    console.info("Dependencies installed");
  });
});

const cloneServerRepository =
  "git clone https://github.com/techfever-soft/hazecms-backend.git ./backend";
exec(cloneServerRepository, (err, stdout, stderr) => {
  if (err) {
    console.log("Error when cloning server repository");
    return;
  }

  console.info("HazeCMS (back-end) cloned");

  exec("cd ./backend && npm i", (err, stdout, stderr) => {
    console.info("Dependencies installed");
  });
});
