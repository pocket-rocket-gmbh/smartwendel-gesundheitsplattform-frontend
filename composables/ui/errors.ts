import errorCodes from '@/data/errorCodes'

export function useErrors() {

  const checkAndMapErrors = (fieldName:string, errors:any) => {
    let errorMessages: any[] = []
    if (errors["errors"]) {
      errors["errors"].forEach((error:any)=> {
        if (error.field_name === fieldName) {
          errorMessages.push(mapError(error.code))
        }
      })
    }
    return errorMessages
  }

  const mapError = (errorCode:any) => {
    if (errorCodes[errorCode]) {
      return errorCodes[errorCode]
    } else {
      return errorCode
    }
  }

  return {
    checkAndMapErrors,
    mapError
  }
}
