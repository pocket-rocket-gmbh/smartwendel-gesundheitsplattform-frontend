import { Buffer } from 'buffer'
import { Method } from 'axios'
import { useServerInterface } from '@/composables/server/interface'
import { ServerCallResult } from '@/types/serverCallResult'

export function usePublicApi() {
  const config = useRuntimeConfig()
  const token = `${config.PUBLIC_API_USERNAME}:${config.PUBLIC_API_PASSWORD}`
  const encodedToken = Buffer.from(token).toString('base64')

  const serverInterface = useServerInterface()  
  serverInterface.setDomain(`${config.public.API_BASE_URL}public/`)
  
  serverInterface.setHeaders({
    common: {
      Authorization: `Basic ${encodedToken}`
    }
  })

  const call = async (method: Method, url: string, data?: any): Promise<ServerCallResult> => {
    const result = await serverInterface.call(method, url, data)
    return result
  }

  return {
    call
  }
}
