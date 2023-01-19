type KindCareFacility = {
  id: string,
  name: string
}

const kindsCareFacilities: KindCareFacility[] = [
  { id: 'doctor', name: 'Ärztin / Arzt' },
  { id: 'hospital', name: 'Krankenhaus' },
  { id: 'facility', name: 'Pflegeeinrichtung /-angebot' },
  { id: 'drugstore', name: 'Apotheke' },
  { id: 'courses', name: 'Kurs' },
  { id: 'consulting', name: 'Beratung & Hilfe' },
]

export default kindsCareFacilities
