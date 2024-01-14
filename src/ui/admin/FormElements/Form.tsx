const Form = (props: {
  children: React.ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onReset?: (event: React.FormEvent<HTMLFormElement>) => void;
  ref?: React.RefObject<HTMLFormElement>;
}) => {
  return (
    <form
      className="flex flex-col gap-4 p-4 border border-black rounded-lg"
      onSubmit={props.onSubmit}
      onReset={props.onReset ? props.onReset : () => {}}
      ref={props.ref}
    >
      {props.children}
    </form>
  );
};

export default Form;
