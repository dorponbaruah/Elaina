import { ErrorEvent } from "../../index";

export default new ErrorEvent("uncaughtExceptionMonitor", (error, origin) => {
  console.log(`Uncaught Exception Monitor:`, error, origin);
});