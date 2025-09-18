import type { IpcInvokeHandlers } from '../../backend/ipc-invoke-handlers/ipc-invoke-handlers';

type ExcludeFirstParameter<T extends unknown[]> = T extends [unknown, ...infer Rest] ? Rest : never;

/**
 * This describes the API exposed by the main process to the renderer processes.
 *
 * It is used to type the `contextBridge.exposeInMainWorld` call in the main
 * process, and the `window.ipc` object in the renderer processes.
 *
 * It is automatically derived from the `IpcInvokeHandlers` type, which
 * describes the handlers registered in the main process.
 */
export type IpcInvokeApi = {
  [K in keyof IpcInvokeHandlers]: (
    ...args: ExcludeFirstParameter<Parameters<IpcInvokeHandlers[K]>>
  ) => Promise<Awaited<ReturnType<IpcInvokeHandlers[K]>>>;
};
