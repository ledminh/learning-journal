import SideBar from "@/layout/SideBar";

export default function SingleEntryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
