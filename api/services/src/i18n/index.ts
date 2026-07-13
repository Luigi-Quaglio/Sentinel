import { loadLanguage } from "./loader";

const languages = {
  "pt-BR": loadLanguage("pt-BR"),
  en: loadLanguage("en"),
};

export type Language = keyof typeof languages;


export function translate(
  language: Language,
  key: string,
  variables?: Record<string, string>
): string {

  const translation = key
    .split(".")
    .reduce(
      (obj, part) => obj?.[part],
      languages[language]
    );


  if (!translation) {
    return key;
  }


  if (!variables) {
    return translation;
  }


  return Object.entries(variables)
    .reduce(
      (text, [name, value]) =>
        text.replace(
          `{{${name}}}`,
          value
        ),
      translation
    );
}