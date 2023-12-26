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
