type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  component?: string;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logs: LogEntry[] = [];

  private log(level: LogLevel, message: string, component?: string, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      component,
      error
    };

    this.logs.push(entry);

    // В продакшене отправляем только ошибки и предупреждения
    if (!this.isDevelopment && (level === 'debug' || level === 'info')) {
      return;
    }

    const prefix = component ? `[${component}]` : '';
    const logMessage = `${prefix} ${message}`;

    switch (level) {
      case 'debug':
        console.debug(logMessage, error);
        break;
      case 'info':
        console.info(logMessage, error);
        break;
      case 'warn':
        console.warn(logMessage, error);
        break;
      case 'error':
        console.error(logMessage, error);
        break;
    }
  }

  debug(message: string, component?: string) {
    this.log('debug', message, component);
  }

  info(message: string, component?: string) {
    this.log('info', message, component);
  }

  warn(message: string, component?: string, error?: Error) {
    this.log('warn', message, component, error);
  }

  error(message: string, component?: string, error?: Error) {
    this.log('error', message, component, error);
  }

  // Получить последние логи (для отладки)
  getLogs(level?: LogLevel, limit = 50): LogEntry[] {
    let filtered = level ? this.logs.filter(log => log.level === level) : this.logs;
    return filtered.slice(-limit);
  }

  // Очистить логи
  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();