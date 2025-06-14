export const rules = {
  required: (value: string) => !!value || "Pflichtangabe",
  counter: (value: string) => value?.length <= 20 || "Maximal 20 Zeichen",
  phoneCounter: (value: string) => value?.length <= 15 || "Maximal 15 Zeichen",
  excerptCounter:(value: string) => value?.length <= 250 || "Maximal 250 Zeichen",
  Counter: (value: string) => value?.length <= 15 || "Maximal 15 Zeichen",
  counterStreet: (value: string) => value?.length <= 60 || "Maximal 60 Zeichen",
  zip: (value: string) => value.length === 5 || "Maximal 5 Zeichen",
  noSpecialCharacters: (value: string) => {
    const pattern = /^[a-zA-Z0-9-]*$/; // Allows only alphanumeric characters and hyphens
    if (!pattern.test(value)) {
      return "Keine Leer- oder Sonderzeichen erlaubt, nur alphanumerische Zeichen und Bindestriche";
    }
    return true;
  },
  email: (value: string) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "Ungültige E-Mail-Adresse";
  },
  validateNumber: (value: string) => {
    const pattern = /^[0-9]+$/;
    return (
      pattern.test(value) ||
      "Die Eingabe ist ungültig. Es dürfen keine Sonder- oder Leerzeichen verwendet werden"
    );
  },
  validateEventDuration: (value: string) => {
    const pattern = /^[0-9]+$/;
    return (
      pattern.test(value) || "Ungültige Eingabe. Außschließlich Zahlen eingeben"
    );
  },
  length: (value: string) =>
    !value ||
    value?.length < 1000 ||
    "Die Beschreibung darf höchstens 1000 Zeichen lang sein.",
  password: (value: string) =>
    !value ||
    value.length >= 6 ||
    "Das Passwort muss mindestens 6 Zeichen haben.",
  fileRequired: (v: File) => (v && v.size > 0) || "Pflichtangabe",
  isUrl: (url: string) => {
    const urlRegex =
      /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;

    if (!url) return;

    if (url.match(urlRegex)?.length) return;

    return "Bitte gib eine gültige URL an";
  },
};
