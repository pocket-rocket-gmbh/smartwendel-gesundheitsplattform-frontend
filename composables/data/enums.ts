// insert enums in Interface
export interface Enums {
  facilitiesStatus: EnumValue[],
  userRole: EnumValue[]  // Add the userRole property
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

  const userRole = [
    { value: 'facility_owner', name: 'Einrichtungss', class: '' },
    { value: 'admin', name: 'Adminitrator', class: '' },
    { value: 'care_facility_admin', name: 'Super Adminitrator', class: '' },
  ]

  // insert enums in Interface
  interface Enums {
    facilitiesStatus: EnumValue[],
    userRole: EnumValue[]
  }
  
  // insert enums in JSON
  const enums: Record<keyof Enums, EnumValue[]> = {
    facilitiesStatus,
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
    userRole,
    getName,
    getClassName,
    getEnum
  }
}
