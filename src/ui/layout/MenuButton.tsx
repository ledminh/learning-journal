export default function MenuButton(props: { open: () => void }) {
  return (
    <button
      className="fixed top-0 right-0 z-10 p-2 text-xl text-white bg-black rounded-bl-lg hover:bg-black/80"
      onClick={props.open}
    >
      MENU
    </button>
  );
}
