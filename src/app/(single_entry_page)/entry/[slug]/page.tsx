import Entry from "@/entry";

export default function EntryPage(props: { params: { slug: string } }) {
  return (
    <>
      <p>Entry {props.params.slug}</p>
      <Entry type="full" />
    </>
  );
}
