import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { getGlobalPortfolio, isRedisConfigured, setGlobalPortfolio } from "@/lib/portfolio-server";

export const runtime = "nodejs";

export async function GET() {
  const result = await getGlobalPortfolio();
  return NextResponse.json({
    data: result.data,
    source: result.source,
    exists: result.exists,
    redisConfigured: isRedisConfigured(),
  });
}

export async function PUT(req: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized. Please log in as admin." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = await setGlobalPortfolio(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Save failed." }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
}
