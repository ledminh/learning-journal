import SideBar from "@/layout/SideBar";

export default function MultiEntriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-7 gap-10">
      <main className="col-span-7 order-2 sm:order-1 sm:col-span-5">
        {children}
      </main>
      <aside className="col-span-7 order-1 sm:order-2 sm:col-span-2">
        <SideBar />
      </aside>
    </div>
  );
}
