export function useEnums() {

  // Define enums here
  const facilitiesStatus = [
    { value: 'is_checked', name: 'In Prüfung', class: 'is-yellow' },
    { value: 'confirmed', name: 'Freigegeben', class: 'is-green' },
    { value: 'rejected', name: 'Abgelehnt', class: 'is-red' }
  ]

  const facilitiesKind = [
    { value: 'event', name: 'Veranstaltung', class: '' },
    { value: 'course', name: 'Kurs', class: '' },
  ]

  type EnumValue = {
    value: string;
    name: string;
    class: string;
  }
  
  // insert enums in Interface
  interface Enums {
    facilitiesStatus: EnumValue[],
    facilitiesKind: EnumValue[]
  }
  
  // insert enums in JSON
  const enums: Record<keyof Enums, EnumValue[]> = {
    facilitiesStatus,
    facilitiesKind
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
    getName,
    getClassName,
    getEnum
  }
}