import * as cp from "child_process";
import * as os from "os";

export interface ICommandResult {
  code: number;
  cmdOutput: string;
  cmdOutputIncludingStderr: string;
  formattedArgs: string;
}

export interface DebugLogger {
  debug(message: string): Promise<boolean>;
}

export async function getNodeVersion(): Promise<string | null> {
  const nodeVersionRegex =
    /v(?<major_version>\d+)\.(?<minor_version>\d+)\.(?<patch_version>\d+)/gm;
  try {
    const output = await executeCommand(
      undefined,
      undefined,
      undefined,
      "node",
      "--version"
    );
    const match = nodeVersionRegex.exec(output);
    if (match && match.groups?.major_version) {
      return match.groups.major_version;
    } else {
      return null;
    }
  } catch (error) {
    console.debug(`Failed to run 'node --version', error = '${error}'`);
    return null;
  }
}

export async function executeCommand(
  workingDirectory: string | undefined,
  logger: DebugLogger | undefined,
  options: cp.SpawnOptions | undefined,
  command: string,
  ...args: string[]
): Promise<string> {
  const result: ICommandResult = await tryExecuteCommand(
    workingDirectory,
    logger,
    options,
    command,
    ...args
  );
  if (result.code !== 0) {
    const errorMessage = `Failed to run command: "${command} ${result.formattedArgs}", code: "${result.code}",
                            output: "${result.cmdOutput}", error: "${result.cmdOutputIncludingStderr}"`;
    await logger?.debug(errorMessage);
    throw new Error(errorMessage);
  } else {
    await logger?.debug(
      `Finished running command: "${command} ${result.formattedArgs}".`
    );
  }

  return result.cmdOutput;
}

export async function tryExecuteCommand(
  workingDirectory: string | undefined,
  logger: DebugLogger | undefined,
  additionalOptions: cp.SpawnOptions | undefined,
  command: string,
  ...args: string[]
): Promise<ICommandResult> {
  return await new Promise(
    (
      resolve: (res: ICommandResult) => void,
      reject: (e: Error) => void
    ): void => {
      let cmdOutput = "";
      let cmdOutputIncludingStderr = "";
      const formattedArgs: string = args.join(" ");

      workingDirectory = workingDirectory || os.tmpdir();
      const options: cp.SpawnOptions = {
        cwd: workingDirectory,
        shell: true,
      };
      Object.assign(options, additionalOptions);

      const childProc: cp.ChildProcess = cp.spawn(command, args, options);
      let timer: NodeJS.Timeout;
      if (options.timeout && options.timeout > 0) {
        // timeout only exists for exec not spawn
        timer = setTimeout(() => {
          childProc.kill();
          logger?.debug(
            `Stop exec due to timeout, command: "${command} ${formattedArgs}", options = '${JSON.stringify(
              options
            )}'`
          );
          reject(
            new Error(
              `Exec command: "${command} ${formattedArgs}" timeout, ${options.timeout} ms`
            )
          );
        }, options.timeout);
      }
      logger?.debug(
        `Running command: "${command} ${formattedArgs}", options = '${JSON.stringify(
          options
        )}'`
      );

      childProc.stdout?.on("data", (data: string | Buffer) => {
        data = data.toString();
        cmdOutput = cmdOutput.concat(data);
        cmdOutputIncludingStderr = cmdOutputIncludingStderr.concat(data);
      });

      childProc.stderr?.on("data", (data: string | Buffer) => {
        data = data.toString();
        cmdOutputIncludingStderr = cmdOutputIncludingStderr.concat(data);
      });

      childProc.on("error", (error) => {
        logger?.debug(
          `Failed to run command '${command} ${formattedArgs}': cmdOutputIncludingStderr: '${cmdOutputIncludingStderr}', error: ${error}`
        );
        if (timer) {
          clearTimeout(timer);
        }
        reject(error);
      });
      childProc.on("close", (code: number) => {
        logger?.debug(
          `Command finished with outputs, cmdOutputIncludingStderr: '${cmdOutputIncludingStderr}'`
        );
        if (timer) {
          clearTimeout(timer);
        }
        resolve({
          code,
          cmdOutput,
          cmdOutputIncludingStderr,
          formattedArgs,
        });
      });
    }
  );
}
