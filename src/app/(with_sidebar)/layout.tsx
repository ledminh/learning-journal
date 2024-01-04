import { getTags } from "@/data/api/tag";
import { getDates } from "@/data/api/date";

import SideBar from "@/ui/layout/SideBar";

export default async function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tagsLoad = await getTags({});
  const datesLoad = await getDates({
    offset: 0,
    limit: 5,
  });

  return (
    <div className="grid grid-cols-8 gap-10">
      <main className="order-2 col-span-8 md:order-1 md:col-span-5">
        {children}
      </main>
      <aside className="order-1 col-span-8 md:order-2 md:col-span-3">
        <SideBar tagsLoad={tagsLoad} datesLoad={datesLoad} />
      </aside>
    </div>
  );
}
