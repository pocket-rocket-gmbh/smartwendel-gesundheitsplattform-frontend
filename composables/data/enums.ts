export function useEnums() {

  // Define enums here
  const facilitiesStatus = [
    { value: 'is_checked', name: 'In Prüfung', class: 'has-box-warning' },
    { value: 'confirmed', name: 'Freigegeben', class: 'has-box-success' },
    { value: 'rejected', name: 'Abgelehnt', class: 'has-box-danger' }
  ]
  const projectKinds = [
    { value: 'upvote', name: 'Like', class: '' },
    { value: 'upvote_downvote', name: 'Like & Dislike', class: '' }
  ]

  const pinboardStatus = [
    { value: 'is_checked', name: 'In Prüfung', class: 'has-box-warning' },
    { value: 'confirmed', name: 'Freigegeben', class: 'has-box-success' },
    { value: 'rejected', name: 'Abgelehnt', class: 'has-box-danger' }
  ]

  const gamificationKinds = [
    { value: 'comment', name: 'Kommentare', class: '' },
    { value: 'poll', name: 'Umfrage', class: '' },
    { value: 'rating', name: 'Bewertung', class: '' },
    { value: 'login', name: 'Login', class: '' }
  ]

  const userKind = [
    { value: 'user', name: 'Benutzer', class: '' },
    { value: 'admin', name: 'Admin', class: '' }
  ]

  type EnumValue = {
    value: string;
    name: string;
    class: string;
  };
  
  // insert enums in Interface
  interface Enums {
    facilitiesStatus: EnumValue[];
    projectKinds: EnumValue[];
    pinboardStatus: EnumValue[];
    gamificationKinds: EnumValue[];
    userKind: EnumValue[];
  }
  
  // insert enums in JSON
  const enums: Record<keyof Enums, EnumValue[]> = {
    facilitiesStatus,
    projectKinds,
    pinboardStatus,
    gamificationKinds,
    userKind
  };

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
    projectKinds,
    pinboardStatus,
    getName,
    getClassName
  }
}