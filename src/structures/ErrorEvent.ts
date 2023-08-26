import { EventEmitter } from 'stream';

export class ErrorEvent {
  constructor(
    public event: "uncaughtException" | "uncaughtExceptionMonitor" | "unhandledRejection",
    public run: (...args: any) => void,
  ) {}
}