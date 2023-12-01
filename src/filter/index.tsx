import Block from "@/layout/Block";

export function FilterBlock() {
  return (
    <Block title="Filter">
      <div>Sort by date/title</div>
      <div>Sorted order: asc/desc</div>
      <div>Filtered by type: Link/Quote/Code/Image</div>
    </Block>
  );
}
