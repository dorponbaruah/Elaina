import { ErrorEvent } from "../../index";

export default new ErrorEvent("unhandledRejection", (reason, promise) => {
  console.log(`Unhandled Rejection at:`, promise, `Reason:`, reason);
});