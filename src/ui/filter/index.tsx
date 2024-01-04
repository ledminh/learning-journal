import Block from "@/ui/layout/Block";
import SearchBar from "../admin/JournalList/SearchBar";
import MaterialSelect from "./MaterialSelect";

export function FilterBlock() {
  return (
    <Block title="Filter">
      <div className="flex flex-col gap-4">
        <MaterialSelect />
        <SearchBar />
      </div>
    </Block>
  );
}
