import { FieldValues, FieldErrors, UseFormRegister } from "react-hook-form";

export default function PasswordInput(props: {
  register: UseFormRegister<FieldValues>;
  name: string;
  required: string | boolean;
  errors: FieldErrors<FieldValues>;
  defaultValue?: string;
}) {
  return (
    <>
      <input
        id={props.name}
        {...props.register(props.name, {
          required: props.required,
        })}
        type="password"
        defaultValue={props.defaultValue}
        className="block w-full rounded-md border border-black py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
      focus:outline-none focus:ring-black disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
      />
      {props.errors[props.name]?.type === "required" && (
        <span className="text-sm text-red-500">
          {props.errors[props.name]?.message as string}
        </span>
      )}
    </>
  );
}
