import type { PM2 } from "./common.js";
import type { ConnectOptions } from "./common.js";
export { ConnectOptions };
import Remote from "./remote.js";
export default async function connect(options: ConnectOptions): Promise<PM2> {
  let instance;
  if (options.target === "local") {
    if (typeof window !== "undefined") {
      throw new Error("only remote connections can be used from browsers");
    }
    try {
      instance = new (await import("./local.js")).default();
      await instance._connect();
    } catch (e) {
      throw new Error("add pm2 as a dependency to use local connections");
    }
  } else {
    instance = new Remote(options);
  }
  return instance;
}
