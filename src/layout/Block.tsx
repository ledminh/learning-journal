export default function Block(props: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="border border-slate-600 rounded-lg overflow-hidden">
      <div className="bg-black text-white px-2">
        {props.title.toLocaleUpperCase()}
      </div>
      <div>{props.children}</div>
    </div>
  );
}
