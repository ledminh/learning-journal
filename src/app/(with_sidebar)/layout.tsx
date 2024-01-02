import SideBar from "@/ui/layout/SideBar";

export default function MultiEntriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-7 gap-10">
      <main className="col-span-7 order-2 md:order-1 md:col-span-5">
        {children}
      </main>
      <aside className="col-span-7 order-1 md:order-2 md:col-span-2">
        <SideBar />
      </aside>
    </div>
  );
}
