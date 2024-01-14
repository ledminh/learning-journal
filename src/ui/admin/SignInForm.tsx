"use client";

import Form from "@/ui/admin/FormElements/Form";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import FormGroup from "@/ui/admin/FormElements/FormGroup";
import TextInput from "@/ui/admin/FormElements/TextInput";
import PasswordInput from "@/ui/admin/FormElements/PasswordInput";

import { useRouter } from "next/navigation";
import login from "@/utils/login";
import { useEffect, useState } from "react";

export default function SignInForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const _onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const { errorMessage, payload } = await login({
      email: data.email,
      password: data.password,
    });

    if (errorMessage) {
      reset();
      setErrorMessage(errorMessage);
      return;
    }

    if (!payload) {
      reset();
      setErrorMessage("Unknown error. Payload is null.");
      return;
    }

    router.refresh();
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLButtonElement) return;

      if (event.key === "Enter") {
        handleSubmit(_onSubmit)();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <Form onSubmit={handleSubmit(_onSubmit)}>
      {errorMessage && (
        <div className="p-2 mb-2 font-mono text-sm font-semibold bg-red-100 rounded-md">
          {errorMessage}
        </div>
      )}
      <FormGroup label="Email" htmlFor="email">
        <TextInput
          register={register}
          errors={errors}
          name="email"
          required="email required"
        />
      </FormGroup>
      <FormGroup label="Password" htmlFor="password">
        <PasswordInput
          register={register}
          errors={errors}
          name="password"
          required="password required"
        />
      </FormGroup>
      <div className="flex gap-2">
        <button
          className="p-2 text-white bg-blue-600 rounded-md hover:bg-blue-500"
          type="submit"
        >
          Log In
        </button>
        <button
          className="p-2 text-white bg-gray-600 rounded-md hover:bg-gray-500"
          type="reset"
        >
          Cancel
        </button>
      </div>
    </Form>
  );
}
