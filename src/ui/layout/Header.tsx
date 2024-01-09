import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-col gap-3">
      <Link href="/">
        <h1 className="text-5xl font-bold">LEARNING JOURNAL</h1>
      </Link>
      <p className="p-1 text-sm bg-slate-200">
        I created this learning journal to practice writing and to document my
        learning process.{" "}
        <Link
          href="https://github.com/ledminh/learning-journal"
          className="border-b border-slate-400 hover:border-slate-900"
        >
          Source code here
        </Link>
      </p>
    </div>
  );
}
