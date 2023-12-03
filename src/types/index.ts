export type AsyncFunction<P, R> = (params: P) => Promise<
  | {
      errorMessage: string;
      payload: null;
    }
  | {
      errorMessage: null;
      payload: R;
    }
>;
