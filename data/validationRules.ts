export const rules = {
  required: (value: string) => !!value || "Erforderlich.",
  counter: (value: string) => value.length <= 20 || "Maximal 20 Zeichen",
  counterStreet: (value: string) => value.length <= 60 || "Maximal 60 Zeichen",
  zip: (value: string) => value.length === 5 || "Maximal 5 Zeichen",
  email: (value: string) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "Ungültige E-Mail-Adresse";
  },
  length: (value: string) => !value || value.length < 300 || "Die Beschreibung darf höchstens 300 Zeichen lang sein.",
};