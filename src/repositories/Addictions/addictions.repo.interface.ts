export interface ARepo<T> {
  read(): Promise<T[]>;
  readId(id: string): Promise<T>;
  update(info: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
