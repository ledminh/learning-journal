import Link from "next/link";

export default function Header() {
  return (
    <>
      <h1 className="text-4xl font-bold">LEARNING JOURNAL</h1>
      <p className="bg-slate-200 p-1 text-sm">
        I created this learning journal to practice writing and to document my
        learning process.{" "}
        <Link
          href="https://github.com/ledminh/learning-journal"
          className="border-b border-slate-400 hover:border-slate-900"
        >
          Source code here
        </Link>
      </p>
    </>
  );
}
