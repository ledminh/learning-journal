type PropsWithChildren<T> = T & { children?: React.ReactNode };

export default function DatesLayout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="flex flex-col gap-8">
      <h3 className="text-2xl font-bold">List of entries organized by date</h3>
      {children}
    </div>
  );
}
