type ServerLogLevel = 'error' | 'warn';

const isProduction = () => process.env.NODE_ENV === 'production';

const safeErrorCode = (error: unknown): string | undefined => {
  if (!error || typeof error !== 'object') return undefined;
  const code = (error as { code?: unknown }).code;
  return typeof code === 'string' && /^[A-Z0-9_-]{1,80}$/i.test(code) ? code : undefined;
};

export const serverLog = (
  level: ServerLogLevel,
  event: string,
  error?: unknown,
  context: Record<string, string | number | boolean | undefined> = {}
): void => {
  const cleanContext = Object.fromEntries(
    Object.entries(context).filter(([, value]) => value !== undefined)
  );

  if (isProduction()) {
    const code = safeErrorCode(error);
    console[level]({
      event,
      ...(code ? { code } : {}),
      ...cleanContext,
    });
    return;
  }

  console[level](event, error, cleanContext);
};
