export const revalidate = 0;

export default function SingleEntryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
