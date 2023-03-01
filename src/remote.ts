import type {
  PM2,
  JsonObject,
  ErrResultCallback,
  RemoteConnectOptions,
  StartOptions,
  ReloadOptions,
  Proc,
  Platform,
} from "./common.js";
import { isConfigFile } from "./common.js";
import type { AppRouter } from "pm2-server";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { ProcessDescription } from "pm2";

export default class implements PM2 {
  #client;
  constructor({ password, url }: RemoteConnectOptions) {
    this.#client = createTRPCProxyClient<AppRouter>({
      links: [
        httpBatchLink({
          url: url.origin + url.pathname.replace(/\/$/, "") + url.search,
          headers: {
            Authorization: "Basic " + btoa("pm2:" + password),
          },
        }),
      ],
    });
  }
  async connect(noDaemonMode?: boolean): Promise<void> {}
  async start(options: StartOptions): Promise<Proc>;
  async start(jsonConfigFile: string): Promise<Proc>;
  async start(script: string): Promise<Proc>;
  async start(script: string, options: StartOptions): Promise<Proc>;
  async start(script: string, jsonConfigFile: string): Promise<Proc>;
  async start(
    cmd: StartOptions | string,
    opts?: StartOptions | string
  ): Promise<Proc> {
    if (typeof opts === "string" || isConfigFile(cmd)) {
      throw new Error("not implemented");
    }
    if (typeof cmd === "object") {
      opts = cmd;
    } else {
      if (!opts) opts = {};
      opts.script = cmd;
    }
    return await this.#client.start.mutate(opts);
  }
  disconnect(): void {
    // connectionless
  }
  async stop(process: string | number): Promise<Proc> {
    return await this.#client.stop.mutate(process);
  }
  async restart(process: string | number): Promise<Proc> {
    return await this.#client.restart.mutate(process);
  }
  async delete(process: string | number): Promise<Proc> {
    return await this.#client.delete.mutate(process);
  }
  async reload(process: string | number): Promise<Proc>;
  async reload(process: string | number, options: ReloadOptions): Promise<Proc>;
  async reload(
    process: string | number,
    options?: ReloadOptions
  ): Promise<Proc> {
    if (typeof options === "object") {
      throw new Error("not implemented");
    }
    return await this.#client.reload.mutate(process);
  }
  async describe(process: string | number): Promise<ProcessDescription[]> {
    return await this.#client.describe.query(process);
  }
  async list(): Promise<ProcessDescription[]> {
    return await this.#client.list.query();
  }
  async dump(): Promise<any> {
    return await this.#client.dump.mutate();
  }
  async flush(process: string | number): Promise<any> {
    return await this.#client.flush.mutate(process);
  }
  async reloadLogs(): Promise<any> {
    return await this.#client.reloadLogs.mutate();
  }
  async sendSignalToProcessName(
    signal: string | number,
    process: string | number
  ): Promise<any> {
    return await this.#client.sendSignalToProcessName.mutate({
      signal,
      process,
    });
  }
  async startup(platform: Platform): Promise<any> {
    return await this.#client.startup.mutate(platform);
  }
  async sendDataToProcessId(process: number, packet: JsonObject): Promise<any> {
    return await this.#client.sendDataToProcessId.mutate({ packet, process });
  }
}
