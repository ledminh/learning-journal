import Link from "next/link";

export default function AdminLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/admin">
        <h1 className="inline-block w-1/5 border-b-2 border-red-950 pb-1 font-bold text-red-900 text-xl">
          Admin CP
        </h1>
      </Link>
      <div>{props.children}</div>
    </div>
  );
}
