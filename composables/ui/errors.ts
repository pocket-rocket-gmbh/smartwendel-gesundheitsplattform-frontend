const errorCodes: { [key: string]: string } = { 
  'warehouse::article.name.invalid': 'Ein Artikel-Name muss angegeben werden.',
  'warehouse::article.number.taken': 'Ein Artikel mit dieser Artikelnummer existiert bereits',
  'password.not_filled': 'Ein Passwort muss angegeben werden.',
  'password.too_short': 'Das Passwort muss mindestens 6 Zeichen haben.',
  'password.not_matching': 'Die beiden Passwörter müssen übereinstimmen.'
}

export function useErrors() {
  const mappedErrorCode = (errorCode:string) => {
    if (errorCodes[errorCode]) {
      return errorCodes[errorCode]
    }
    return errorCode
  }

  return {
    mappedErrorCode
  }
}