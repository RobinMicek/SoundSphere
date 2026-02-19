abstract class Repository<T> {
    abstract get(id: string): T;
    abstract save(entity: T): T;
    abstract update(id: string, entity: T): T;
    abstract delete(id: string): T;
}