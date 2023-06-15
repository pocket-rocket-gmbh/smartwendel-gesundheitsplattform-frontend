export function useEnums() {

  // Define enums here
  const facilitiesStatus = [
    { value: 'is_checked', name: 'In Prüfung', class: 'warning' },
    { value: 'confirmed', name: 'Freigegeben', class: 'success' },
    { value: 'rejected', name: 'Abgelehnt', class: 'error' }
  ]

  const facilitiesKind = [
    { value: 'event', name: 'Vernanstaltung', class: '' },
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

  // return enums
  return {
    facilitiesStatus,
    facilitiesKind,
    getName,
    getClassName
  }
}