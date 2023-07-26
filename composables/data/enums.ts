// insert enums in Interface
export interface Enums {
  facilitiesStatus: EnumValue[],
  facilitiesKind: EnumValue[]
}


export type EnumValue = {
  value: string;
  name: string;
  class: string;
}

export function useEnums() {

  // Define enums here
  const facilitiesStatus = [
    { value: false, name: 'In Prüfung', class: 'is-yellow' },
    { value: true, name: 'Freigegeben', class: 'is-green' }
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

  type EnumValue = {
    value: string;
    name: string;
    class: string;
  }
  
  // insert enums in Interface
  interface Enums {
    facilitiesStatus: EnumValue[],
    facilitiesKind: EnumValue[],
    userRole: EnumValue[]
  }
  
  // insert enums in JSON
  const enums: Record<keyof Enums, EnumValue[]> = {
    facilitiesStatus,
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
    facilitiesKind,
    userRole,
    getName,
    getClassName,
    getEnum
  }
}