class BaseNormalizerException extends Error {}

export class TableExists extends BaseNormalizerException {}
export class TableDoesNotExist extends BaseNormalizerException {}
export class DatabaseNotProvidedError extends BaseNormalizerException {}
export class RowDoesNotExist extends BaseNormalizerException {}
