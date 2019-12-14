class BaseNormalizerException extends Error {}

export class TableExists extends BaseNormalizerException {}
export class TableDoesNotExists extends BaseNormalizerException {}
export class DatabaseNotProvidedError extends BaseNormalizerException {}
