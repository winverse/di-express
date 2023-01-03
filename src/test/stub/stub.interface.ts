export type Stub<T, K extends keyof any = ""> = Record<
  keyof Omit<T, K>,
  jest.Mock<any, any>
>;
