export class Optional<T> {
    private readonly _value?: T;

    public constructor(value?: T) {
        this._value = value;
    }

    public static of<T>(this: new (value: T) => Optional<T>, value: T): Optional<T> {
        if (value === undefined || value === null) {
            throw new Error('Cannot create Optional.of with undefined or null');
        }
        return new this(value);
    }

    public static ofNullable<T>(this: new (value?: T) => Optional<T>, value?: T): Optional<T> {
        return new this(value);
    }

    public static empty<T>(this: new () => Optional<T>): Optional<T> {
        return new this();
    }

    public get value(): T {
        if (this._value === undefined) {
            throw new Error('Value is not present');
        }
        return this._value;
    }

    public get isPresent(): boolean {
        return this._value !== undefined;
    }

    public getOrElse(defaultValue: T): T {
        return this._value ?? defaultValue;
    }

    public map<U>(mapper: (value: T) => U | null | undefined): Optional<U> {
        if (this._value === undefined) {
            return Optional.empty<U>();
        }
        const result = mapper(this._value);
        return result === undefined || result === null
            ? Optional.empty<U>()
            : Optional.of<U>(result as NonNullable<U>);
    }

    public flatMap<U>(mapper: (value: T) => Optional<U> | null | undefined): Optional<U> {
        if (this._value === undefined) {
            return Optional.empty<U>();
        }
        const result = mapper(this._value);
        return result ?? Optional.empty<U>();
    }

    public filter(predicate: (value: T) => boolean): Optional<T> {
        if (this._value === undefined) {
            return this;
        }
        return predicate(this._value) ? this : Optional.empty<T>();
    }

    public ifPresent(consumer: (value: T) => void): void {
        if (this._value !== undefined) {
            consumer(this._value);
        }
    }

    public orElseThrow(errorSupplier: () => Error): T {
        if (this._value !== undefined) {
            return this._value;
        }
        throw errorSupplier();
    }

    public equals(other: Optional<T>): boolean {
        if (this._value === other._value) {
            return true;
        }
        return false;
    }

    public toString(): string {
        return this._value !== undefined ? `Optional(${this._value})` : 'Optional.empty';
    }
}
