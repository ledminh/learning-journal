"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClientComponentClient();

  const router = useRouter();

  const onClick = () => {
    supabase.auth.signOut().then(() => router.refresh());
  };

  return (
    <button
      className="px-2 py-1 text-sm text-white bg-red-900 border-b-4 shadow-lg hover:bg-red-700 active:bg-red-500"
      onClick={onClick}
    >
      Sign Out
    </button>
  );
}
