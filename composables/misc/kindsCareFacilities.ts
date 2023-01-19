import kindsCareFacilities from "@/data/kindsCareFacilities"

export function useKindsCareFacilities() {
  const getNameFromId = (id:string) => {
    const found = kindsCareFacilities.find((fac:any) => fac.id === id)
    if (found) {
      return found.name
    }
    return "uhu"
  }

  return {
    getNameFromId
  }
}