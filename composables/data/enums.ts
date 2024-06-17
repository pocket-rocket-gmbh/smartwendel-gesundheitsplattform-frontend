// insert enums in Interface
export interface Enums {
  facilitiesStatus: EnumValue[],
  facilitiesKind: EnumValue[],
  userRole: EnumValue[]  // Add the userRole property
}

export type EnumValue = {
  value: string;
  name: string;
  class: string;
}

export function useEnums() {

  const  complaintsStatus = [
    { value: 'open', name: 'Offen', class: 'is-yellow' },
    { value: 'pending', name: 'In Bearbeitung', class: 'is-blue' },
    { value: 'complete', name: 'Geschlossen', class: 'is-green'
    },
    { value: 'rejected', name: 'Abgelehnt', class: 'is-red'
  }
  ]

  const complaintsActions = [
    { value: 'blockContent', name: 'Inhalt gesperrt', class: 'is-yellow' },
    { value: 'blockUser', name: 'Benutzer gesperrt', class: 'is-red' },
    { value: 'deleteContent', name: 'Inhalt gelöscht', class: 'is-red' },
    { value: 'unchanged', name: 'Unverändert', class: '' },
  ]

  // Define enums here
  const facilitiesStatus = [
    { value: false, name: 'In Prüfung', class: 'is-yellow' },
    { value: true, name: 'Freigegeben', class: 'is-green' }
  ]

  const complaintsKind = [
    { value: 'law_break', name: 'Verstoß gegen geltendes Recht', class: 'primary' },
    { value: 'harassment', name: 'Belästigung', class: 'secondary' },
    { value: 'spam', name: 'Spam', class: 'red' },
    { value: 'terms_violation', name: 'Verstoß gegen die Nutzungsbedingungen ', class: 'green' },
    { value: 'other', name: 'Andere', class: 'Andere' }
  ]


  const facilitiesKind = [
    { value: 'event', name: 'Veranstaltung', class: '' },
    { value: 'course', name: 'Kurs', class: '' },
  ]

  const userRole = [
    { value: 'facility_owner', name: 'Einrichtungss', class: '' },
    { value: 'admin', name: 'Adminitrator', class: '' },
    { value: 'care_facility_admin', name: 'Super Adminitrator', class: '' },
  ]

  // insert enums in Interface
  interface Enums {
    facilitiesStatus: EnumValue[],
    complaintsActions: EnumValue[],
    complaintsStatus: EnumValue[],
    complaintsKind: EnumValue[],
    facilitiesKind: EnumValue[],
    userRole: EnumValue[]
  }
  
  // insert enums in JSON
  const enums: Record<keyof Enums, EnumValue[]> = {
    facilitiesStatus,
    complaintsActions,
    complaintsStatus,
    complaintsKind,
    facilitiesKind,
    userRole
  }

  const getName = (enumName: keyof Enums, value:string) => {
    const found = enums[enumName].find((val:any) => val.value === value) as EnumValue | undefined
    if (found) {
      return found.name
    }
    return null
  }

  const getClassName = (enumName: keyof Enums, value:string) => {
    const found = enums[enumName].find((val:any) => val.value === value) as EnumValue | undefined
    if (found) {
      return found.class
    }
    return null
  } 

  const getEnum = (enumName: keyof Enums) => {
    const found = enums[enumName]
    if (found) {
      return found
    }
    return null
  }

  // return enums
  return {
    facilitiesStatus,
    complaintsKind,
    complaintsStatus,
    facilitiesKind,
    complaintsActions,
    userRole,
    getName,
    getClassName,
    getEnum
  }
}
