import Entry from "@/entry";

export default function Home() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <Entry key={i} type="summary" />
      ))}
    </>
  );
}
