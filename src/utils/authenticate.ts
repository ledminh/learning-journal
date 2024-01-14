import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function authenticate() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      error: null,
      data: null,
    };
  } else if (session.user.email !== process.env.ADMIN_EMAIL) {
    return {
      errorMessage: "Wrong credentials",
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: session,
  };
}
