/**
 * Utility class inspired by rusts Result type.
 * Used to give a return type that may be an error or a value.
 */
export default class Result<T, E extends Error = Error> {
    /**
     * @param value - Value of the result if it has one.
     * @param error - Error of the result if it has one.
     */
    private constructor(
        private value: T,
        private error: E,
    ) {}

    /**
     * Creates an error result.
     *
     * @param error - The error of the result.
     */
    static of<Type, ErrorType extends Error>(error: ErrorType): Result<Type, ErrorType>;

    /**
     * Creates a success result.
     *
     * @param value - The value of the result.
     */
    static of<Type, ErrorType extends Error>(value: Type): Result<Type, ErrorType>;
    /**
     * Create an error or success result. See documentation on overload calls for more information.
     *
     * @param value - The error or value of the result.
     * @returns the result with the value.
     */
    static of<Type, ErrorType extends Error>(value: Type | ErrorType): Result<Type, ErrorType> {
        if (value instanceof Error) {
            return new Result<Type, ErrorType>(undefined, value);
        } else {
            return new Result<Type, ErrorType>(value, undefined);
        }
    }

    /**
     * @returns whether this result is an error result
     */
    public hasError(): boolean {
        return this.error !== undefined;
    }

    /**
     * @returns the value
     * @throws {Error} when this is an error result.
     */
    public get(): T {
        if (this.hasError()) {
            throw new Error("Attempting to unwrap value on error result.");
        }

        return this.value;
    }

    /**
     * @returns the error of the result.
     * @throws {Error} when this is a success result.
     */
    public getError(): E {
        if (!this.hasError()) {
            throw new Error("Attempting to unwrap error on value result.");
        }

        return this.error;
    }

    /**
     * Default to undefined on error
     *
     * @returns the value of the result or undefined if this is an error result.
     */
    public getOrUndefined(): T | undefined {
        if (this.hasError()) {
            return undefined;
        }

        return this.get();
    }

    /**
     * Switch to a different value if this is an error result
     *
     * @param or - The other value to switch to.
     * @returns either the value of this result or the value given.
     */
    public getOr<V>(or: V): T | V {
        if (this.hasError()) {
            return or;
        }

        return this.get();
    }

    /**
     * Switch to a different value when the error matches any of the error types passed to the function.
     *
     * @param or - The value to switch to
     * @param types - Constructor functions of the error types to check.
     * @returns this result in case this is a successful result or the error doesn't match any of the types.
     *          Returns a new result with the switched value in case the error does match any of the types.
     */
    public switchOn<ErrorType extends new (message?: string) => Error>(or: T, ...types: ErrorType[]): Result<T, E> {
        if (!this.hasError()) {
            return this;
        }

        const error = this.getError();

        for (const type of types) {
            if (error instanceof type) {
                return Result.of(or);
            }
        }

        return this;
    }

    /**
     * @throws {E} the error of the result
     * @throws {Error} when this is a successful result.
     */
    public throw(): never {
        if (!this.hasError()) {
            throw new Error("Attempting to throw error with value present.");
        }

        throw this.error;
    }
}
