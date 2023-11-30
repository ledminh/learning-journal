import Entry from "@/entry";

export default function Home() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <Entry key={i} type="summary" />
      ))}
    </>
  );
}
