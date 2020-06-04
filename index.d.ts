import { IncomingMessage, OutgoingMessage, ObserveWriteStream } from "@ref/coap";

export interface IncomingMessageWithParams<P> extends IncomingMessage {
  params: Readonly<P>;
}

export type RouteMethods =
  | "all"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "observe";

export type RouteCallback<P> = (
  req: IncomingMessageWithParams<P>,
  res: OutgoingMessage | ObserveWriteStream
) => void;

export interface Router {
  (
    req: IncomingMessage,
    res: OutgoingMessage | ObserveWriteStream,
    next?: () => void
  ): void;

  isRouter: boolean;

  method<P = any>(
    method: RouteMethods,
    path: string,
    callback: RouteCallback<P>
  ): Router;
  all<P = any>(path: string, callback: RouteCallback<P>): Router;
  get<P = any>(path: string, callback: RouteCallback<P>): Router;
  post<P = any>(path: string, callback: RouteCallback<P>): Router;
  put<P = any>(path: string, callback: RouteCallback<P>): Router;
  delete<P = any>(path: string, callback: RouteCallback<P>): Router;
  observe<P = any>(path: string, callback: RouteCallback<P>): Router;

  use(path: string, subRouter: Router): void;
}

export default function createRouter(): Router;
