export interface CRepo<T> {
  read(): Promise<T[]>;
  readId(id: string): Promise<T>;
  update(info: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
