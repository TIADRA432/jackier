import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) return next(err);

  console.error('API Error:', err);

  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ success: false, error: 'Request body is too large', code: 'PAYLOAD_TOO_LARGE' });
  }

  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, error: 'Invalid JSON payload', code: 'INVALID_JSON' });
  }

  if (err?.name === 'MulterError' && err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, error: 'Uploaded file is too large', code: 'FILE_TOO_LARGE' });
  }

  return res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    code: 'INTERNAL_ERROR',
  });
};
