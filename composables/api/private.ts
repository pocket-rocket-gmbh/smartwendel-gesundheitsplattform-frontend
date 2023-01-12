import { Method } from 'axios'
import { useServerInterface } from '@/composables/server/interface'
import { ServerCallResult } from '@/types/serverCallResult'

export function usePrivateApi() {
  const config = useRuntimeConfig()

  const serverInterface = useServerInterface()
  serverInterface.setDomain(config.public.API_BASE_URL)

  let token = null
  if (process.client) {
    token = localStorage.getItem('auth._token.jwt')

    serverInterface.setHeaders({
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    })
  
    const call = async (method: Method, url: string, data?: any): Promise<ServerCallResult> => {
      const result = await serverInterface.call(method, url, JSON.stringify(data))
  
      // Unauthorized because token is probably expired -> delete it.
      if (result.httpCode === 401 && process.server) {
        if (process.client) {
          token = localStorage.removetItem('auth._token.jwt')
        }
      }
  
      return result
    }

    return {
      call
    }
  }
}
