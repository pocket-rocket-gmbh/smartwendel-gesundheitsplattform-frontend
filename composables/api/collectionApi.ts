import { ResultStatus, ServerCallResult } from '@/types/serverCallResult'

export function useCollectionApi() {

  const snackbar = useSnackbar()

  // Parameters.
  let baseApi = null
  let endpoint = ''

  // Results.
  let totalPages = ref(0)
  let currentPage = ref(0)
  let totalResults = ref(0)
  let items = ref([])
  let item = ref<any>(null)

  const setBaseApi = (baseApi_: any) => {
    baseApi = baseApi_
  }

  const setEndpoint = (endpoint_: string) => {
    endpoint = endpoint_
  }

  const retrieveCollection = async (options = { page: 1, per_page: 25, sort_by: 'created_at', sort_order: 'DESC', searchQuery: null, concat: false, filters: [] }) => {

    let search = ''

    if (options.searchQuery) {
      search = `&search=${options.searchQuery}`
    }

    let filtersParam = ''

    if (options.filters?.length > 0) {
      options.filters.forEach(element => {
        filtersParam += '&filter_' + element.field + "=" + element.value        
      })
    }
    console.log("Filter param")
    console.log(filtersParam)
    let initialQueryOperator = '?'
    if (endpoint.includes("?")) {
      initialQueryOperator = '&'
    }
    const result: ServerCallResult = await baseApi.call('get', `/${endpoint}${initialQueryOperator}page=${options.page}&per_page=${options.per_page}&sort_by=${options.sort_by}&sort_order=${options.sort_order}${search}${filtersParam}`, null)

    if (result.status === ResultStatus.SUCCESSFUL) {
        totalPages.value = Math.ceil(result.data['total_results'] / options.per_page)
        currentPage.value = result.data['current_page']
        totalResults.value = result.data['total_results']

        if (options.concat === true) {
          items.value = items.value.concat(result.data['resources'])
        }
        else {
          items.value = result.data['resources']
        }
    }
    return result
  }

  const createItem = async (data: any, snackbarText?: string) => {
    const result: ServerCallResult = await baseApi.call('post', `${endpoint}`, data)

    if (result.status === ResultStatus.SUCCESSFUL && snackbarText) {
      snackbar.showSuccess(snackbarText)
    }
    return result 
  }

  const updateItem = async (data: any, snackbarText?: string) => {
    const result: ServerCallResult = await baseApi.call('put', `${endpoint}`, data)

    if (result.status === ResultStatus.SUCCESSFUL && snackbarText) {
      snackbar.showSuccess(snackbarText)
    }
    return result
  }

  const getItem = async () => {   
    const result: ServerCallResult = await baseApi.call('get', `${endpoint}`)

    if (result.status === ResultStatus.SUCCESSFUL) {
      item.value = result.data['resource']
    }
  }

  const getPlain = async () => {   
    const result: ServerCallResult = await baseApi.call('get', `${endpoint}`)

    if (result.status === ResultStatus.SUCCESSFUL) {
      item.value = result.data
    }
  }

  const deleteItem = async (snackbarText?: string) => {
    const result: ServerCallResult = await baseApi.call('delete', `${endpoint}`)

    if (result.status === ResultStatus.SUCCESSFUL && snackbarText) {
      snackbar.showSuccess(snackbarText)
    }
    return result 
  }

  const duplicateItem = async (data: any) => {
    const result: ServerCallResult = await baseApi.call(`${endpoint}/${data.id}/duplicate`, data)
    
    if (result.status === ResultStatus.SUCCESSFUL) {
      snackbar.showSuccess('Erfolgreich dupliziert.')
    }
  }

  return {
    totalPages,
    currentPage,
    totalResults,
    items,
    item,
    setBaseApi,
    setEndpoint,
    retrieveCollection,
    createItem,
    updateItem,
    getItem,
    getPlain,
    deleteItem,
    duplicateItem
  }
}
