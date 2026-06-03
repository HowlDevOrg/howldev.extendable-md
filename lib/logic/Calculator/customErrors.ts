
/**
 * Returns an error with "Internal Error: " prefixed
 * to error messages. 
 * 
 * Only meant for internal debugging/use, should not show up
 * to the user. 
 */
export class InternalError extends Error {
    constructor(str: string) {
        super("Internal Error: " + str);
    }
}

/**
 * Returns an error with "Code Error: " prefixed
 * to error messages. 
 * 
 * Meant to be shown to the user about their input. 
 */
export class CodeError extends Error {
    constructor(str: string) {
        super("Code Error: " + str);
    }
}