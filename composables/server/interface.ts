import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios'
import { ServerCallResult } from '@/types/serverCallResult'
import { useSnackbar } from "~/composables/ui/snackbar";

export function useServerInterface() {
  
  const client: AxiosInstance =  axios.create()
  const snackbar = useSnackbar()

  let domain = null
  let headers = null

  const setDomain = (domain_: string) => {
    domain = domain_
  }

  const setHeaders = (headers_: Object) => {
    headers = headers_
  }

  const call = async (method: Method, url: string, data?: any): Promise<ServerCallResult> => {

    const requestConfig: AxiosRequestConfig = {
      baseURL: domain,
      url: url,
      method: method,
      data: data,
      headers: headers
    }

    try {
      const response = await client.request(requestConfig)
      return ServerCallResult.success(response.status, response.data)
    }
    catch (error) {
      snackbar.showError(getErrorMessage(error))
      return ServerCallResult.error(getErrorMessage(error), error.response?.status, error.response?.data)
    }
  }

  const getErrorMessage = (error: any) => {
    let result: string

    if (error.response) {
      if (error.response.data && error.response.data.msg) {
        result = error.response.data.msg
      }
      else {
        result = 'Ein Fehler ist aufgetreten'
      }
    }
    else if (error.code) {
      result = error.code
    }
    else {
      result = error.message
    }

    return result
  }

  return {
    setDomain,
    setHeaders,
    call
  }
}
