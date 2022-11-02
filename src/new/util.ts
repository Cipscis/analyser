export type InnerType<T> = T extends Array<infer E> ? E : T;
