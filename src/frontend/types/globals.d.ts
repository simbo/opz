import type { IpcInvokeApi } from '../../shared/ipc/ipc-invoke-api.types';

declare global {
  interface Window {
    ipc: IpcInvokeApi;
  }
}
