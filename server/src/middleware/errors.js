export class AppError extends Error { constructor(status, message, code='APP_ERROR') { super(message); this.status=status; this.code=code; } }
export function errorHandler(err, req, res, next) { if (res.headersSent) return next(err); console.error(err); res.status(err.status || 500).json({ error: err.message || 'Internal server error', code: err.code || 'INTERNAL_ERROR' }); }
