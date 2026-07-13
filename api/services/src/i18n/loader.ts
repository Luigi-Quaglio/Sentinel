import fs from "fs";
import path from "path";

const languagesPath = path.join(__dirname, "languages");

export function loadLanguage(language: string) {
  const folder = path.join(languagesPath, language);

  if (!fs.existsSync(folder)) {
    throw new Error(`Language '${language}' not found`);
  }

  const files = fs.readdirSync(folder);

  return files.reduce((translations, file) => {
    const namespace = file.replace(".json", "");

    translations[namespace] = JSON.parse(
      fs.readFileSync(
        path.join(folder, file),
        "utf-8"
      )
    );

    return translations;
  }, {} as Record<string, any>);
}