import { ResultStatus } from '@/types/serverCallResult'
export function useTableMove() {

  const api = useCollectionApi()
  api.setBaseApi(usePrivateApi())

  const move = async (entry, nextEntry, endpoint) => {
    const oldOrder = entry.menu_order
    const newOrder = nextEntry.menu_order
    api.setEndpoint(`${endpoint}/${entry.id}`)
    const result1 = await api.updateItem({ menu_order: newOrder }, null)
    api.setEndpoint(`${endpoint}/${nextEntry.id}`)
    const result2 = await api.updateItem({ menu_order: oldOrder }, null)
    if (result1.status === ResultStatus.SUCCESSFUL && result2.status === ResultStatus.SUCCESSFUL) {
      return true
    }
    return false
  }

  return {
    move
  }
}
