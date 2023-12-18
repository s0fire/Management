// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ProgrammingLanguage } from "@microsoft/teamsfx-core";
import { execAsync, editDotEnvFile } from "./commonUtils";
import { TemplateProjectFolder, Capability } from "./constants";
import path from "path";

export class Executor {
  static async execute(
    command: string,
    cwd: string,
    processEnv?: NodeJS.ProcessEnv,
    timeout?: number
  ) {
    try {
      const result = await execAsync(command, {
        cwd,
        env: processEnv ?? process.env,
        timeout: timeout ?? 0,
      });
      if (result.stderr) {
        /// the command exit with 0
        console.log(
          `[Success] "${command}" in ${cwd} with some stderr: ${result.stderr}`
        );
      } else {
        console.log(`[Success] "${command}" in ${cwd}.`);
      }
      return { ...result, success: true };
    } catch (e: any) {
      if (e.killed && e.signal == "SIGTERM") {
        console.error(`[Failed] "${command}" in ${cwd}. Timeout and killed.`);
      } else {
        console.error(
          `[Failed] "${command}" in ${cwd} with error: ${e.message}`
        );
      }
      return { stdout: "", stderr: e.message as string, success: false };
    }
  }

  static login() {
    const command = `az login --service-principal -u ${process.env.AZURE_CLIENT_ID} -p ${process.env.AZURE_CLIENT_SECRET} -t ${process.env.AZURE_TENANT_ID}`;
    return this.execute(command, process.cwd());
  }

  static concatProcessEnv(
    processEnv: NodeJS.ProcessEnv,
    env: Record<string, string>
  ) {
    return Object.assign({}, processEnv, env);
  }

  static async createProject(
    workspace: string,
    appName: string,
    capability: Capability,
    language: ProgrammingLanguage,
    customized: Record<string, string> = {}
  ) {
    const command =
      `teamsapp new --interactive false --app-name ${appName} --capability ${capability} --programming-language ${language} ` +
      Object.entries(customized)
        .map(([key, value]) => "--" + key + " " + value)
        .join(" ");
    return this.execute(command, workspace);
  }

  static async addEnv(workspace: string, newEnv: string, env = "dev") {
    const command = `teamsapp env add ${newEnv} --env ${env}`;
    return this.execute(command, workspace);
  }

  static async addSPFxWebPart(
    workspace: string,
    spfxFolder: string,
    webpartName: string,
    manifestPath: string,
    localManifestPath: string
  ) {
    const command =
      `teamsapp add spfx-web-part --spfx-webpart-name ${webpartName}` +
      ` --spfx-folder ${spfxFolder} --teams-manifest-file ${manifestPath}` +
      ` --local-teams-manifest-file ${localManifestPath} --interactive false `;
    return this.execute(command, workspace);
  }

  static async upgrade(workspace: string, isV3 = true) {
    const prefix = isV3 ? "teamsapp" : "teamsfx";
    const command = `${prefix} upgrade --force`;
    return this.execute(command, workspace);
  }

  static async executeCmd(
    workspace: string,
    cmd: string,
    env = "dev",
    processEnv?: NodeJS.ProcessEnv,
    npx = false,
    isV3 = true
  ) {
    const npxCommand = npx ? "npx " : "";
    const cliPrefix = isV3 ? "teamsapp" : "teamsfx";
    const command = `${npxCommand} ${cliPrefix} ${cmd} --env ${env}`;
    return this.execute(command, workspace, processEnv);
  }

  static async provision(workspace: string, env = "dev", isV3 = true) {
    return this.executeCmd(workspace, "provision", env, undefined, false, isV3);
  }

  static async provisionWithCustomizedProcessEnv(
    workspace: string,
    processEnv: NodeJS.ProcessEnv,
    env = "dev",
    npx = false,
    isV3 = true
  ) {
    return this.executeCmd(workspace, "provision", env, processEnv, npx, isV3);
  }

  static async validate(workspace: string, env = "dev") {
    return this.executeCmd(
      workspace,
      "validate -t ./appPackage/manifest.json",
      env
    );
  }

  static async validateWithCustomizedProcessEnv(
    workspace: string,
    processEnv: NodeJS.ProcessEnv,
    env = "dev",
    npx = false,
    isV3 = true
  ) {
    return this.executeCmd(workspace, "deploy", env, processEnv, npx, isV3);
  }

  static async deploy(workspace: string, env = "dev") {
    return this.executeCmd(workspace, "deploy", env);
  }

  static async deployWithCustomizedProcessEnv(
    workspace: string,
    processEnv: NodeJS.ProcessEnv,
    env = "dev",
    npx = false,
    isV3 = true
  ) {
    return this.executeCmd(workspace, "deploy", env, processEnv, npx, isV3);
  }

  static async publish(workspace: string, env = "dev") {
    return this.executeCmd(workspace, "publish", env);
  }

  static async publishWithCustomizedProcessEnv(
    workspace: string,
    processEnv: NodeJS.ProcessEnv,
    env = "dev",
    npx = false,
    isV3 = true
  ) {
    return this.executeCmd(workspace, "publish", env, processEnv, npx, isV3);
  }

  static async preview(workspace: string, env = "dev") {
    return this.executeCmd(workspace, "prevew", env);
  }

  static async previewWithCustomizedProcessEnv(
    workspace: string,
    processEnv: NodeJS.ProcessEnv,
    env = "dev",
    npx = false,
    isV3 = true
  ) {
    return this.executeCmd(workspace, "preview", env, processEnv, npx, isV3);
  }

  static async installCLI(workspace: string, version: string, global: boolean) {
    const packageName = version.startsWith("3.")
      ? "@microsoft/teamsapp-cli"
      : "@microsoft/teamsfx-cli";
    if (global) {
      const command = `npm install -g ${packageName}@${version}`;
      return this.execute(command, workspace);
    } else {
      const command = `npm install ${packageName}@${version}`;
      return this.execute(command, workspace);
    }
  }

  static async createTemplateProject(
    appName: string,
    testFolder: string,
    template: TemplateProjectFolder,
    processEnv?: NodeJS.ProcessEnv
  ) {
    const command = `teamsapp new sample ${template} --interactive false `;
    const timeout = 100000;
    try {
      await this.execute(command, testFolder, processEnv, timeout);

      //  change original template name to appName
      await this.execute(
        `mv ./${template} ./${appName}`,
        testFolder,
        processEnv ? processEnv : process.env,
        timeout
      );

      const localEnvPath = path.resolve(
        testFolder,
        appName,
        "env",
        ".env.local"
      );
      const remoteEnvPath = path.resolve(
        testFolder,
        appName,
        "env",
        ".env.dev"
      );
      editDotEnvFile(localEnvPath, "TEAMS_APP_NAME", appName);
      editDotEnvFile(remoteEnvPath, "TEAMS_APP_NAME", appName);

      const message = `scaffold project to ${path.resolve(
        testFolder,
        appName
      )} with template ${template}`;
      console.log(message);
    } catch (e: any) {
      console.log(
        `Run \`${command}\` failed with error msg: ${JSON.stringify(e)}.`
      );
      if (e.killed && e.signal == "SIGTERM") {
        console.log(`Command ${command} killed due to timeout ${timeout}`);
      }
    }
  }

  static async openTemplateProject(
    appName: string,
    testFolder: string,
    template: TemplateProjectFolder,
    processEnv?: NodeJS.ProcessEnv,
    subFolder?: string
  ) {
    const timeout = 100000;
    let oldPath = "";
    if (subFolder) {
      oldPath = path.resolve("./resource", subFolder, template);
    } else {
      oldPath = path.resolve("./resource", template);
    }
    const newPath = path.resolve(testFolder, appName);
    try {
      await this.execute(
        `mv ${oldPath} ${newPath}`,
        testFolder,
        processEnv,
        timeout
      );
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to open project: ${newPath}`);
    }
    const localEnvPath = path.resolve(testFolder, appName, "env", ".env.local");
    const remoteEnvPath = path.resolve(testFolder, appName, "env", ".env.dev");
    editDotEnvFile(localEnvPath, "TEAMS_APP_NAME", appName);
    editDotEnvFile(remoteEnvPath, "TEAMS_APP_NAME", appName);
    console.log(`successfully open project: ${newPath}`);
  }

  static async package(workspace: string, env = "dev") {
    return this.executeCmd(
      workspace,
      "package -t ./appPackage/manifest.json",
      env
    );
  }
}
