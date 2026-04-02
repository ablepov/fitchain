import { NextRequest, NextResponse } from "next/server";
import type { ApiError } from "@/lib/types";

type ApiErrorCode = ApiError["code"];

const NO_STORE_VALUE = "no-store";

export function jsonNoStore<T>(body: T, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", NO_STORE_VALUE);

  return NextResponse.json(body, {
    ...init,
    headers,
  });
}

export function jsonSuccess<T>(data: T, init: ResponseInit = {}) {
  return jsonNoStore(
    {
      data,
      error: null,
    },
    init
  );
}

export function jsonError(status: number, code: ApiErrorCode, message: string, init: ResponseInit = {}) {
  return jsonNoStore(
    {
      data: null,
      error: {
        code,
        message,
      },
    },
    {
      ...init,
      status,
    }
  );
}

export function getAuthorizationHeader(req: NextRequest) {
  return req.headers.get("authorization") ?? req.headers.get("Authorization") ?? "";
}

export async function readJsonSafely<T>(req: NextRequest): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

export function noStoreHeaders(init?: HeadersInit) {
  const headers = new Headers(init);
  headers.set("Cache-Control", NO_STORE_VALUE);
  return headers;
}
