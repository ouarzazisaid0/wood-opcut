export type DraggerMouseHandler = (evt: MouseEvent) => void;
export type DraggerMoveHandler = (evt: MouseEvent, dx: number, dy: number) => void;
export type DraggerCreateMoveHandler = (evt: MouseEvent) => DraggerMoveHandler | null;
export declare function draggerMouseDownHandler(createMoveHandlerCb: DraggerCreateMoveHandler): DraggerMouseHandler;
