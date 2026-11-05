/**
 * Minimal logger (FURPS+ S5).
 *
 * Silent in production builds. This is the single place to connect a monitoring
 * service later (Sentry, Logtail, Better Stack...) without touching call sites:
 * implement `forward` below and every warn/error will be shipped onwards.
 */

const isProduction = import.meta.env.PROD

function forward(_level, _message, _details) {
  // Intentionally empty: attach a monitoring client here.
}

function emit(level, message, details) {
  forward(level, message, details)

  if (isProduction) {
    return
  }

  const prefix = `[attachtrack:${level}]`

  if (details === undefined) {
    console[level === 'debug' ? 'log' : level](prefix, message)
    return
  }

  console[level === 'debug' ? 'log' : level](prefix, message, details)
}

export const logger = {
  debug(message, details) {
    emit('debug', message, details)
  },
  info(message, details) {
    emit('info', message, details)
  },
  warn(message, details) {
    emit('warn', message, details)
  },
  error(message, details) {
    emit('error', message, details)
  },
}

export default logger
