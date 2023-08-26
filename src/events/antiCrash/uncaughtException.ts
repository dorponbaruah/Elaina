import { ErrorEvent } from "../../index";

export default new ErrorEvent("uncaughtException", (error) => {
  console.log(`Uncaught Exception:`, error);
});