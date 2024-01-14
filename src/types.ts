export type AsyncFunction<P, R> = (params: P) => Promise<
  | {
      errorMessage: null;
      payload: R | null;
    }
  | {
      errorMessage: string;
      payload: null;
    }
>;

export type AdminLoginRequest = {
  email: string;
  password: string;
};

export type AdminLoginResult = {
  email: string;
};

export type LoginFunction = AsyncFunction<AdminLoginRequest, AdminLoginResult>;
