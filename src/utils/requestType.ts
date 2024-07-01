import { AxiosRequestConfig } from 'axios'
export interface ResponseModel<T = any> {
  code: number | string
  data: T
  message: string | Array<string> | null
  msg?: string
  token?: string
}
export interface listModel<T = any> extends ResponseModel {
  current: number,
  list: T,
  pages: number,
  size: number,
  total: number
}
export interface UploadFileItemModel {
  name: string,
  value: string | Blob
}

export type UploadRequestConfig = Omit<AxiosRequestConfig, 'url' | 'data'>