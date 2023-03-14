export interface URepo<P> {
  create(_info: Partial<P>): Promise<P>;

  search(query: { key: string; value: unknown }): Promise<P[]>;
}
