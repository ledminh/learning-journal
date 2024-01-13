import Link from "next/link";

export default function Footer() {
  return (
    <div className="pt-4 my-4 border-t-2 border-t-neutral-700">
      <span>{new Date().getFullYear()} © </span>
      <Link href="https://www.ledminh.dev" className="underline">
        Minh Le
      </Link>
    </div>
  );
}
