import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { LoginFunction } from "@/types";

const login: LoginFunction = async ({ email, password }) => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      errorMessage: error.message,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: { email: data.user.email as string },
  };
};

export default login;
