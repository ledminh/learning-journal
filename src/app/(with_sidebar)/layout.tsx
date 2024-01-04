import SideBar from "@/ui/layout/SideBar";

export default function MultiEntriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-8 gap-10">
      <main className="order-2 col-span-8 md:order-1 md:col-span-5">
        {children}
      </main>
      <aside className="order-1 col-span-8 md:order-2 md:col-span-3">
        <SideBar />
      </aside>
    </div>
  );
}
