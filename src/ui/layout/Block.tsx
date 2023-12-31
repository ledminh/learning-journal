export default function Block(props: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="w-full overflow-hidden border rounded-lg border-slate-600">
      <div className="px-2 text-white bg-black">
        {props.title.toLocaleUpperCase()}
      </div>
      <div className="px-2 py-4 md:block">{props.children}</div>
    </div>
  );
}
