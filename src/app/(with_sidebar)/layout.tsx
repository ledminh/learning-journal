import { getTags } from "@/data/api/tag";
import { getDates } from "@/data/api/date";

import SideBar from "@/ui/layout/SideBar";
import MobileSideBar from "@/ui/layout/MobileSideBar";

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
    <div className="grid grid-cols-8 gap-0 md:gap-10">
      <aside className="hidden col-span-8 md:sticky md:top-4 md:block md:col-span-3 md:order-2">
        <SideBar tagsLoad={tagsLoad} datesLoad={datesLoad} />
      </aside>
      <aside className="md:hidden">
        <MobileSideBar>
          <SideBar tagsLoad={tagsLoad} datesLoad={datesLoad} />
        </MobileSideBar>
      </aside>
      <main className="col-span-8 md:col-span-5 md:order-1">{children}</main>
    </div>
  );
}
