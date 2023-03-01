import type {
  PM2,
  Platform,
  StartOptions,
  ReloadOptions,
  ProcessDescription,
} from "./common.js";
import { isConfigFile } from "./common.js";
import pm2 from "pm2";
export default class implements PM2 {
  _connect(noDaemonMode?: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      function callback(err?: Error) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
      if (typeof noDaemonMode === "boolean") {
        pm2.connect(noDaemonMode, callback);
      } else {
        pm2.connect(callback);
      }
    });
  }
  async start(options: StartOptions): Promise<ProcessDescription>;
  async start(jsonConfigFile: string): Promise<ProcessDescription>;
  async start(script: string): Promise<ProcessDescription>;
  async start(
    scriptOrConfig: string | StartOptions,
    options?: string | StartOptions
  ): Promise<ProcessDescription> {
    if (typeof options === "string" || isConfigFile(scriptOrConfig)) {
      throw new Error("not implemented");
    }
    let opts: StartOptions = {};
    if (typeof scriptOrConfig === "object") {
      opts = scriptOrConfig;
    } else {
      opts.script = scriptOrConfig;
      opts = { ...opts, ...options };
    }
    return new Promise((resolve, reject) => {
      pm2.start(opts, (err, proc) => {
        if (err) {
          reject(err);
        } else {
          resolve(proc);
        }
      });
    });
  }
  disconnect(): void {
    pm2.disconnect();
  }
  stop(process: string | number): Promise<ProcessDescription> {
    return new Promise((resolve, reject) => {
      pm2.stop(process, (err, proc) => {
        if (err) {
          reject(err);
        } else {
          resolve(proc);
        }
      });
    });
  }
  restart(process: string | number): Promise<ProcessDescription> {
    return new Promise((resolve, reject) => {
      pm2.restart(process, (err, proc) => {
        if (err) {
          reject(err);
        } else {
          resolve(proc);
        }
      });
    });
  }
  delete(process: string | number): Promise<ProcessDescription> {
    return new Promise((resolve, reject) => {
      pm2.delete(process, (err, proc) => {
        if (err) {
          reject(err);
        } else {
          resolve(proc);
        }
      });
    });
  }
  describe(process: string | number): Promise<ProcessDescription[]> {
    return new Promise((resolve, reject) => {
      pm2.describe(process, (err, proc) => {
        if (err) {
          reject(err);
        } else {
          resolve(proc);
        }
      });
    });
  }
  list(): Promise<ProcessDescription[]> {
    return new Promise((resolve, reject) => {
      pm2.list((err, proc) => {
        if (err) {
          reject(err);
        } else {
          resolve(proc);
        }
      });
    });
  }
  flush(process: string | number): Promise<any> {
    return new Promise((resolve, reject) => {
      pm2.flush(process, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
  dump(): Promise<any> {
    return new Promise((resolve, reject) => {
      pm2.dump((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
  reloadLogs(): Promise<any> {
    return new Promise((resolve, reject) => {
      pm2.reloadLogs((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  sendSignalToProcessName(
    signal: string | number,
    process: string | number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      pm2.sendSignalToProcessName(signal, process, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  startup(platform: Platform): Promise<void> {
    return new Promise((resolve, reject) => {
      pm2.startup(platform, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  sendDataToProcessId(proc_id: number, packet: object): Promise<any> {
    return new Promise((resolve, reject) => {
      pm2.sendDataToProcessId(proc_id, packet, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  async reload(
    process: string | number,
    options?: ReloadOptions
  ): Promise<ProcessDescription> {
    if (typeof options === "object") {
      throw new Error("not implemented");
    }
    return new Promise((resolve, reject) => {
      pm2.reload(process, (err, proc) => {
        if (err) {
          reject(err);
        } else {
          resolve(proc);
        }
      });
    });
  }
}
