const FormGroup = (props: {
  children: React.ReactNode;
  label: string;
  htmlFor: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={props.htmlFor}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {props.label}
      </label>
      {props.children}
    </div>
  );
};

export default FormGroup;
