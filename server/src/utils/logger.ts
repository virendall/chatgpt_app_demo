// logger.ts
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',

    // Foreground colors
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const levelConfig: Record<LogLevel, { color: string; label: string }> = {
    debug: { color: colors.gray, label: 'DEBUG' },
    info: { color: colors.cyan, label: 'INFO' },
    warn: { color: colors.yellow, label: 'WARN' },
    error: { color: colors.red, label: 'ERROR' },
}

function getTimestamp(): string {
    return new Date().toISOString()
}

function formatMessage(
    level: LogLevel,
    category: string,
    message: string,
    data?: unknown
): string {
    const { color, label } = levelConfig[level]
    const timestamp = `${colors.gray}${getTimestamp()}${colors.reset}`
    const levelStr = `${color}${label.padEnd(5)}${colors.reset}`
    const categoryStr = `${colors.magenta}[${category}]${colors.reset}`

    let output = `${timestamp} ${levelStr} ${categoryStr} ${message}`

    if (data !== undefined) {
        const dataStr =
            typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data)
        output += `\n${colors.dim}${dataStr}${colors.reset}`
    }

    return output
}

class Logger {
    private category: string

    constructor(category: string) {
        this.category = category
    }

    debug(message: string, data?: unknown) {
        console.log(formatMessage('debug', this.category, message, data))
    }

    info(message: string, data?: unknown) {
        console.log(formatMessage('info', this.category, message, data))
    }

    warn(message: string, data?: unknown) {
        console.warn(formatMessage('warn', this.category, message, data))
    }

    error(message: string, data?: unknown) {
        console.error(formatMessage('error', this.category, message, data))
    }

    // Special formatted logs
    request(method: string, path: string, body?: unknown) {
        const arrow = `${colors.green}>${colors.reset}`
        console.log(
            formatMessage(
                'info',
                this.category,
                `${arrow} ${method} ${path}`,
                body
            )
        )
    }

    response(statusCode: number, duration: number) {
        const arrow = `${colors.blue}<${colors.reset}`
        const status =
            statusCode >= 400
                ? `${colors.red}${statusCode}${colors.reset}`
                : `${colors.green}${statusCode}${colors.reset}`

        console.log(
            formatMessage(
                'info',
                this.category,
                `${arrow} ${status} (${duration}ms)`
            )
        )
    }

    tool(action: 'call' | 'result', toolName: string, data?: unknown) {
        const icon = action === 'call' ? '↗' : '✅'
        const verb = action === 'call' ? 'Calling' : 'Result from'
        console.log(
            formatMessage(
                'info',
                this.category,
                `${icon} ${verb} tool: ${colors.bright}${toolName}${colors.reset}`,
                data
            )
        )
    }

    resource(action: 'register' | 'fetch', resourceName: string, uri?: string) {
        const icon = action === 'register' ? '📦' : '📥'
        const verb = action === 'register' ? 'Registered' : 'Fetching'
        const msg = uri
            ? `${verb} resource: ${colors.bright}${resourceName}${colors.reset} (${uri})`
            : `${verb} resource: ${colors.bright}${resourceName}${colors.reset}`

        console.log(formatMessage('info', this.category, `${icon} ${msg}`))
    }
}

// Create loggers for different components
export const serverLogger = new Logger('Server')
export const toolLogger = new Logger('Tool')
export const resourceLogger = new Logger('Resource')
export const httpLogger = new Logger('HTTP')

// Factory function
export function createLogger(category: string): Logger {
    return new Logger(category)
}
