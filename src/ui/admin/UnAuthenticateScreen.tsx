import SignInForm from "@/ui/admin/SignInForm";

export default function UnAuthenticateScreen() {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black/70">
      <div className="flex flex-col gap-4 p-8 bg-gray-300 rounded-lg shadow-xl">
        <p className="text-xl font-semibold text-red-800">
          You are not authorized to access this area.
        </p>
        <p className="font-semibold">Please sign in first</p>
        <div className="shadow-xl">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
