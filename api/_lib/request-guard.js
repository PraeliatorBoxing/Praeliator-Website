const rateLimitBuckets = new Map();

const DEFAULT_RATE_LIMIT = {
  limit: 20,
  windowMs: 60 * 1000,
};

export function getClientKey(request) {
  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const forwardedIp = forwardedFor.split(",")[0]?.trim();

  return (
    forwardedIp ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "anonymous"
  );
}

export function checkRateLimit(request, scope, options = {}) {
  const { limit, windowMs } = { ...DEFAULT_RATE_LIMIT, ...options };
  const key = `${scope}:${getClientKey(request)}`;
  const now = Date.now();
  const current = rateLimitBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: Math.max(0, limit - 1), retryAfter: 0 };
  }

  current.count += 1;

  if (current.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, limit - current.count),
    retryAfter: 0,
  };
}

export async function readJsonBody(request, options = {}) {
  const { maxBytes = 16 * 1024 } = options;
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    const error = new Error("Request body must be JSON.");
    error.status = 415;
    throw error;
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength && contentLength > maxBytes) {
    const error = new Error("Request body is too large.");
    error.status = 413;
    throw error;
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).length > maxBytes) {
    const error = new Error("Request body is too large.");
    error.status = 413;
    throw error;
  }

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    const error = new Error("Request body must be valid JSON.");
    error.status = 400;
    throw error;
  }
}

export function getPublicError(error, fallback) {
  const status = Number(error?.status || 0);
  if (status >= 400 && status < 500 && error?.message) {
    return error.message;
  }
  return fallback;
}

export function rateLimitResponse(jsonResponse, limitState) {
  return jsonResponse(
    {
      success: false,
      error: "Too many requests. Please wait briefly before trying again.",
    },
    429,
    {
      "Retry-After": String(limitState.retryAfter),
    },
  );
}
