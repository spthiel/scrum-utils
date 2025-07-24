import {Consumer, Runnable, Supplier} from "api:types";

/**
 * Checks whether the value is null or undefined.
 *
 * @param value - Value to check
 * @returns boolean saying it is.
 */
function isEmptyValue(value: unknown): value is null | undefined {
    return value === null || value === undefined;
}

/**
 * Throw an exception if the value is null or undefined.
 *
 * @param value - Value to check
 * @throws {Error}
 */
function throwOnEmpty(value: unknown): void | never {
    if (isEmptyValue(value)) {
        throw new Error("Null given where not expected.");
    }
}

/**
 * Mirror implementation of the JAVA Optional Class
 */
export default class Optional<T> {
    /**
     * Common instance for {@link Optional.empty()}.
     */
    private static EMPTY = new Optional<undefined>(undefined);

    /**
     * Creates the optional. If value is null or undefined it is treated as empty.
     *
     * @param value - Value of the optional
     */
    private constructor(private value: T) {}

    /**
     * Creates an empty optional.
     *
     * Use {@link Optional.isEmpty()} to check for empty optionals instead of ===.
     *
     * @returns an empty optional cast to the given type.
     */
    static empty<U>(): Optional<U> {
        return this.EMPTY as Optional<U>;
    }

    /**
     * Creates an optional with the given value.
     *
     * @param value - Value of the constructed optional.
     * @returns the filled optional.
     * @throws {Error} when the given value is null or undefined
     */
    static of<Type>(value: Type): Optional<Type> {
        throwOnEmpty(value);

        return new Optional<Type>(value);
    }

    /**
     * Creates an optional with the given value or an empty optional is the value is null or undefined.
     *
     * @param value - Value to create an optional from.
     * @returns an empty optional or the value optional.
     */
    static ofPossiblyEmpty<Type>(value: Type | null | undefined): Optional<Type> {
        if (isEmptyValue(value)) {
            return this.EMPTY as Optional<Type>;
        }

        return new Optional<Type>(value);
    }

    /**
     * @returns the value of the optional
     * @throws {Error} if used on an empty optional.
     */
    public get(): T {
        if (this.isEmpty()) {
            throw new Error("Attempting to unwrap value on empty optional.");
        }

        return this.value;
    }

    /**
     * @returns whether there is a value present.
     */
    public isPresent(): boolean {
        return !isEmptyValue(this.value);
    }

    /**
     * @returns whether there is no value present.
     */
    public isEmpty(): boolean {
        return isEmptyValue(this.value);
    }

    /**
     * Runs the callback when a value exists.
     *
     * @param action - Callback to run.
     */
    public ifPresent(action: Consumer<T>): void {
        if (this.isEmpty()) {
            return;
        }

        action(this.value);
    }

    /**
     * Runs a callback when a value exists or a different callback if it doesn't.
     *
     * @param action - Callback to run when a value exists
     * @param emptyAction - Callback to run when no value exists.
     */
    public ifPresentOrElse(action: Consumer<T>, emptyAction: Runnable): void {
        if (this.isPresent()) {
            action(this.value);
        } else {
            emptyAction();
        }
    }

    /**
     * Returns an empty optional if the value of the optional does not match the predicate.
     *
     * @param predicate - Predicate to check against.
     * @returns this optional if it's empty or the value matches the predicate. Otherwise, an empty optional.
     */
    public filter(predicate: (value: T) => boolean): Optional<T> {
        if (this.isEmpty()) {
            return this;
        }

        if (predicate(this.value)) {
            return this;
        }

        return Optional.empty();
    }

    /**
     * Maps the current value to a new value if it's present.
     *
     * @param mapper - Mapping function defining the new type of the returned optional.
     * @returns an empty optional if the current optional was empty or the mapping function returns null or undefined.
     */
    public map<U>(mapper: (value: T) => U): Optional<U> {
        if (this.isEmpty()) {
            return Optional.empty();
        }

        return Optional.ofPossiblyEmpty(mapper(this.value));
    }

    /**
     * Maps the current optional to a new optional if a value is present.
     *
     * @param mapper - Mapping function returning a new Optional.
     * @returns an empty Optional if the current optional was empty or the mapped optional.
     * @throws {Error} if the mapping functions returns null or undefined.
     */
    public flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U> {
        if (this.isEmpty()) {
            return Optional.empty();
        }

        const result = mapper(this.value);

        throwOnEmpty(result);

        return result;
    }

    /**
     * Switch to a new optional based on the given callback if this optional is empty.
     *
     * @param supplier - Callback called when the current optional is empty.
     * @returns the current optional if a value is present or the result of the supplier.
     * @throws {Error} if the returned value of the supplier is null or undefined.
     */
    public or(supplier: Supplier<Optional<T>>): Optional<T> {
        if (this.isPresent()) {
            return this;
        }

        const result = supplier();

        throwOnEmpty(result);

        return result;
    }

    /**
     * Gets the current value or returns a default value if the optional is empty.
     *
     * @param other - The value to return when the optional is empty.
     * @returns the current value or the default value.
     */
    public orElse<V extends undefined | null>(other: V): T | V;
    /**
     * Gets the current value or returns a default value if the optional is empty.
     *
     * @param other - The value to return when the optional is empty.
     * @returns the current value or the default value.
     */
    public orElse(other: T): T;
    /**
     * Gets the current value or returns a default value if the optional is empty.
     *
     * @param other - The value to return when the optional is empty.
     * @returns the current value or the default value.
     */
    public orElse(other: T | undefined | null): T | undefined | null {
        if (this.isPresent()) {
            return this.value;
        }

        return other;
    }

    /**
     * Gets the current value or returns a default value based on the supplier if the optional is empty.
     *
     * @param supplier - Callback to generate the new return value.
     * @returns the value of the current optional if one is present or the return value of the supplier.
     */
    public orElseGet(supplier: Supplier<T>): T {
        if (this.isPresent()) {
            return this.value;
        }

        return supplier();
    }

    /**
     * Gets the current value or throws if empty.
     *
     * @returns the value of the optional
     * @throws {Error} if no value was present.
     */
    public orElseThrow(): T | never {
        if (this.isEmpty()) {
            throw new Error("No value present");
        }

        return this.value;
    }

    /**
     * Gets the current value or throws the error of the supplier if empty.
     *
     * @template {Error} ErrorType
     *
     * @param exceptionSupplier - Callback to generate the error in case of an empty optional.
     * @returns the value of the optional
     * @throws {ErrorType}
     */
    public orElseThrows<ErrorType extends Error>(exceptionSupplier: Supplier<ErrorType>): T | never {
        if (this.isEmpty()) {
            throw exceptionSupplier();
        }

        return this.value;
    }

    /**
     * Checks if this optional is equal to another value
     *
     * @param value - Value to check against
     * @returns true if value is an optional and both values are the same.
     *          Will return false for an empty optional with the value "null" and an optional with the value "undefined"
     */
    public equals(value: unknown): boolean {
        if (this === value) {
            return true;
        }

        if (value instanceof Optional) {
            return value.value === this.value;
        }

        return false;
    }
}
