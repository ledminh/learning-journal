export default function ErrorLoginScreen(props: { errorMessage: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h1 className="text-3xl font-bold text-red-900">
        Error: {props.errorMessage}
      </h1>
      <p className="text-xl font-semibold text-red-900">
        Please try again later
      </p>
    </div>
  );
}
