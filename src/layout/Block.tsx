export default function Block(props: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="border border-slate-600 rounded-lg">
      <div>{props.title}</div>
      <div>{props.children}</div>
    </div>
  );
}
