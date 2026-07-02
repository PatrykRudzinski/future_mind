import { z } from "zod";

export type LocalStorageErrorCode =
  | "json_parse"
  | "json_stringify"
  | "validation"
  | "quota_exceeded"
  | "unknown";

export class LocalStorageError extends Error {
  constructor(
    message: string,
    public readonly code: LocalStorageErrorCode,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "LocalStorageError";
  }
}

export type LocalStorageAdapterOptions<T> = {
  key: string;
  schema: z.ZodType<T>;
  defaultValue: T;
};

export type LocalStorageReadResult<T> =
  | { success: true; data: T }
  | { success: false; data: T; error: LocalStorageError };

export type LocalStorageWriteResult =
  | { success: true }
  | { success: false; error: LocalStorageError };

function toLocalStorageError(error: unknown, fallbackCode: LocalStorageErrorCode): LocalStorageError {
  if (error instanceof LocalStorageError) {
    return error;
  }

  if (error instanceof DOMException && error.name === "QuotaExceededError") {
    return new LocalStorageError("localStorage quota exceeded", "quota_exceeded", error);
  }

  return new LocalStorageError("localStorage operation failed", fallbackCode, error);
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch (error) {
    throw new LocalStorageError("Failed to parse stored JSON", "json_parse", error);
  }
}

function stringifyJson(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    throw new LocalStorageError("Failed to stringify value as JSON", "json_stringify", error);
  }
}

function validatePayload<T>(schema: z.ZodType<T>, payload: unknown): T {
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    throw new LocalStorageError(
      parsed.error.issues[0]?.message ?? "Stored value failed validation",
      "validation",
      parsed.error,
    );
  }

  return parsed.data;
}

export function createLocalStorageAdapter<T>(options: LocalStorageAdapterOptions<T>) {
  const { key, schema, defaultValue } = options;

  function read(): LocalStorageReadResult<T> {
    try {
      const rawValue = localStorage.getItem(key);

      if (rawValue === null) {
        return { success: true, data: defaultValue };
      }

      const data = validatePayload(schema, parseJson(rawValue));
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        data: defaultValue,
        error: toLocalStorageError(error, "unknown"),
      };
    }
  }

  function write(value: T): LocalStorageWriteResult {
    try {
      const validated = validatePayload(schema, value);
      localStorage.setItem(key, stringifyJson(validated));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: toLocalStorageError(error, "unknown"),
      };
    }
  }

  function remove(): LocalStorageWriteResult {
    try {
      localStorage.removeItem(key);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: toLocalStorageError(error, "unknown"),
      };
    }
  }

  return {
    key,
    read,
    write,
    remove,
  };
}

export type LocalStorageAdapter<T> = ReturnType<typeof createLocalStorageAdapter<T>>;
