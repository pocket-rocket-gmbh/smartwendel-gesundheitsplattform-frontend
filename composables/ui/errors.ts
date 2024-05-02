const errorCodes: { [key: string]: string } = { 
  'Invalid credentials': 'Benutzername oder Passwort falsch',
  'tag.name.invalid': 'das Feld "Bezeichnung" darf nicht leer sein',
  'category.name.invalid': 'das Feld "Bezeichnung" darf nicht leer sein',
  'category.name.taken': 'Bereich existiert bereits',
  'warehouse::article.name.invalid': 'Ein Artikel-Name muss angegeben werden.',
  'warehouse::article.number.taken': 'Ein Artikel mit dieser Artikelnummer existiert bereits',
  'password.not_filled': 'Ein Passwort muss angegeben werden.',
  'password.too_short': 'Das Passwort muss mindestens 6 Zeichen haben.',
  'password.not_matching': 'Die beiden Passwörter müssen übereinstimmen.',
  'register.failed': 'E-Mail falsch oder bereits vergeben.',
  'reset_password.failed': 'E-Mail falsch oder noch nicht registriert.',
  'ERR_BAD_REQUEST': 'Benutzername oder Passwort sind falsch',
  'user.email.taken': 'E-Mail bereits vergeben',
  'carefacility.slug.taken' : 'Einrichtungslink existiert bereits',
}

export function useErrors() {
  const checkAndMapErrors = (fieldName:string, errors:any) => {
    if (!errors) return;
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

  const getErrorMessage = (error: any) => {
    let result: string

    if (error.response) {
      if (error.response.data && error.response.data.msg) {
        result = error.response.data.msg
      }
      else {
        return;
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
    mappedErrorCode,
    checkAndMapErrors,
    getErrorMessage
  }
}