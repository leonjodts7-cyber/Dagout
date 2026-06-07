import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import { isAdminEmail } from "@/lib/admin";

export async function getUserFromRequest(
  request: Request
): Promise<User | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "");
  if (!token) return null;

  const supabase = createClient(url, key);
  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  return user;
}

export async function requireAdmin(request: Request): Promise<User | Response> {
  const user = await getUserFromRequest(request);
  if (!user || !isAdminEmail(user.email)) {
    return new Response(JSON.stringify({ error: "Geen toegang" }), {
      status: 403,
    });
  }
  return user;
}
