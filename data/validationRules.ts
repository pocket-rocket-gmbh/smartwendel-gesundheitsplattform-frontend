export const rules = {
  required: (value: string) => !!value || "Erforderlich.",
  counter: (value: string) => value?.length <= 20 || "Maximal 20 Zeichen",
  phoneCounter: (value: string) => value?.length <= 15 || "Maximal 15 Zeichen",
  counterStreet: (value: string) => value?.length <= 60 || "Maximal 60 Zeichen",
  zip: (value: string) => value.length === 5 || "Maximal 5 Zeichen",
  email: (value: string) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "Ungültige E-Mail-Adresse";
  },
  validateNumber: (value: string) => {
    const pattern = /^[0-9]+$/;
    return pattern.test(value) || "Ungültige Eingabe. Keine Sonder- oder Leerzeichen eingeben";
  },
  length: (value: string) => !value || value?.length < 1000 || "Die Beschreibung darf höchstens 1000 Zeichen lang sein.",
  password: (value: string) => !value || value.length >= 6 || "Das Passwort muss mindestens 6 Zeichen haben.",
  fileRequired: (v: File) => (v && v.size > 0) || "Erforderlich",
  isUrl: (url: string) => {
    const urlRegex =
      /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;

    if (!url) return;

    if (url.match(urlRegex)?.length) return;

    return "Bitte gib eine gültige URL an";
  },
};
