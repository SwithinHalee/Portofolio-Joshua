import { Redis } from "@upstash/redis";
import { DEFAULT_PORTFOLIO, sanitizePortfolio, type PortfolioData } from "./portfolio-store";

export const PORTFOLIO_REDIS_KEY = "portfolio:v1";

function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function getGlobalPortfolio(): Promise<{
  data: PortfolioData;
  source: "redis" | "default";
  exists: boolean;
}> {
  const redis = getRedisClient();
  if (!redis) {
    return { data: DEFAULT_PORTFOLIO, source: "default", exists: false };
  }
  try {
    const raw = await redis.get<unknown>(PORTFOLIO_REDIS_KEY);
    if (!raw) return { data: DEFAULT_PORTFOLIO, source: "default", exists: false };
    const sanitized = sanitizePortfolio(raw);
    if (!sanitized) return { data: DEFAULT_PORTFOLIO, source: "default", exists: false };
    return { data: sanitized, source: "redis", exists: true };
  } catch (err) {
    console.error("Failed to read from Upstash Redis:", err);
    return { data: DEFAULT_PORTFOLIO, source: "default", exists: false };
  }
}

export async function setGlobalPortfolio(data: PortfolioData): Promise<{ success: boolean; error?: string }> {
  const redis = getRedisClient();
  if (!redis) {
    return {
      success: false,
      error: "Upstash Redis environment variables (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN) are not configured.",
    };
  }
  const sanitized = sanitizePortfolio(data);
  if (!sanitized) {
    return { success: false, error: "Invalid portfolio data structure." };
  }
  try {
    await redis.set(PORTFOLIO_REDIS_KEY, sanitized);
    return { success: true };
  } catch (err) {
    console.error("Failed to save to Upstash Redis:", err);
    return { success: false, error: "Failed to persist to Upstash Redis." };
  }
}

export function isRedisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}
