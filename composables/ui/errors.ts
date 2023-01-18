const errorCodes: { [key: string]: string } = { 
  'Invalid credentials': 'Benutzername oder Passwort falsch',
  'warehouse::article.name.invalid': 'Ein Artikel-Name muss angegeben werden.',
  'warehouse::article.number.taken': 'Ein Artikel mit dieser Artikelnummer existiert bereits',
  'password.not_filled': 'Ein Passwort muss angegeben werden.',
  'password.too_short': 'Das Passwort muss mindestens 6 Zeichen haben.',
  'password.not_matching': 'Die beiden Passwörter müssen übereinstimmen.'
}

export function useErrors() {
  const checkAndMapErrors = (fieldName:string, errors:any) => {
    let errorMessages = [] as any
    if (errors["errors"]) {
      errors["errors"].forEach((error:any) => {
        if (error.field_name === fieldName) {
          errorMessages.push(mappedErrorCode(error.code))
        }
      })
    }
    return errorMessages
  }

  const mappedErrorCode = (errorCode:string) => {
    if (errorCodes[errorCode]) {
      return errorCodes[errorCode]
    }
    return errorCode
  }

  return {
    mappedErrorCode,
    checkAndMapErrors
  }
}