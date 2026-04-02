type LogLevel = "debug" | "info" | "warn" | "error";

interface LogError {
  message: string;
  name: string;
  stack?: string;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  component?: string;
  error?: LogError;
}

const MAX_LOGS = 200;

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";
  private logs: LogEntry[] = [];

  private serializeError(error?: Error): LogError | undefined {
    if (!error) {
      return undefined;
    }

    return {
      name: error.name,
      message: error.message,
      stack: this.isDevelopment ? error.stack : undefined,
    };
  }

  private log(level: LogLevel, message: string, component?: string, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      component,
      error: this.serializeError(error),
    };

    this.logs.push(entry);
    if (this.logs.length > MAX_LOGS) {
      this.logs = this.logs.slice(-MAX_LOGS);
    }

    if (!this.isDevelopment && (level === "debug" || level === "info")) {
      return;
    }

    const prefix = component ? `[${component}]` : "";
    const logMessage = `${prefix} ${message}`;

    switch (level) {
      case "debug":
        console.debug(logMessage, entry.error);
        break;
      case "info":
        console.info(logMessage, entry.error);
        break;
      case "warn":
        console.warn(logMessage, entry.error);
        break;
      case "error":
        console.error(logMessage, entry.error);
        break;
    }
  }

  debug(message: string, component?: string) {
    this.log("debug", message, component);
  }

  info(message: string, component?: string) {
    this.log("info", message, component);
  }

  warn(message: string, component?: string, error?: Error) {
    this.log("warn", message, component, error);
  }

  error(message: string, component?: string, error?: Error) {
    this.log("error", message, component, error);
  }

  getLogs(level?: LogLevel, limit = 50): LogEntry[] {
    const safeLimit = Math.max(1, Math.min(limit, MAX_LOGS));
    const filtered = level ? this.logs.filter((log) => log.level === level) : this.logs;
    return filtered.slice(-safeLimit);
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
