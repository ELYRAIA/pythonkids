export function parsePythonError(raw: string): string {
  const lines = raw.split("\n");

  // Trouve le dernier numéro de ligne dans le traceback (le plus proche de l'erreur)
  let lineNum: number | null = null;
  for (const line of lines) {
    const m = line.match(/File "<exec>", line (\d+)/);
    if (m) lineNum = parseInt(m[1]) - 1; // -1 pour le wrapper async def _main()
  }

  // Prend la dernière ligne non-vide : c'est le type et message d'erreur
  const errorDesc = lines.filter((l) => l.trim()).pop()?.trim() ?? raw;

  if (lineNum !== null && lineNum > 0) {
    return `Ligne ${lineNum} — ${errorDesc}`;
  }
  return errorDesc;
}
