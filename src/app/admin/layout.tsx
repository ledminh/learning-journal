import Link from "next/link";
import authenticate from "@/utils/authenticate";
import ErrorLoginScreen from "@/ui/admin/ErrorLoginScreen";
import SignOutButton from "@/ui/admin/SignOutButton";
import UnAuthenticateScreen from "@/ui/admin/UnAuthenticateScreen";

export default async function AdminLayout(props: {
  children: React.ReactNode;
}) {
  const { errorMessage, payload } = await authenticate();

  if (errorMessage) {
    return <ErrorLoginScreen errorMessage={errorMessage} />;
  } else if (!payload) {
    return <UnAuthenticateScreen />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Link href="/admin">
        <h1 className="inline-block w-1/5 pb-1 text-xl font-bold text-red-900 border-b-2 border-red-950">
          Admin CP
        </h1>
      </Link>
      <div className="flex flex-row gap-4">
        <p className="font-mono text-slate-950">
          Welcome, {payload.user.email}
        </p>
        <SignOutButton />
      </div>
      <div>{props.children}</div>
    </div>
  );
}
