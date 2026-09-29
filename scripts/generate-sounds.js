const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'assets', 'musik2025');
const outputFile = path.join(__dirname, '..', 'src', 'sounds.ts');

if (!fs.existsSync(baseDir)) {
  console.error('Hittade inte mappen:', baseDir);
  process.exit(1);
}

function cleanTitle(fileName) {
  let title = fileName.replace(/\.mp3$/i, '');
  title = title.replace(/\s*\[[a-zA-Z0-9_-]+\]/g, '');
  title = title.replace(/\s*\(Official Music Video\)/i, '');
  title = title.replace(/\s*Lyric Video/i, '');
  return title.trim();
}

function getAudioFiles(dir, category, relativePrefix) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.mp3'))
    .map(entry => ({
      fileName: entry.name,
      title: cleanTitle(entry.name),
      category: category,
      requirePath: `../assets/musik2025/${relativePrefix ? relativePrefix + '/' : ''}${entry.name}`,
    }));
}

const breakFiles = getAudioFiles(baseDir, 'break', '');
const goalFiles = getAudioFiles(path.join(baseDir, 'Goal'), 'goal', 'Goal');
const penaltyFiles = getAudioFiles(path.join(baseDir, 'Penalty'), 'penalty', 'Penalty');

const allFiles = [...breakFiles, ...goalFiles, ...penaltyFiles];

const items = allFiles.map((file, index) => {
  return `  {
    id: ${index + 1},
    title: ${JSON.stringify(file.title)},
    source: require(${JSON.stringify(file.requirePath)}),
    category: ${JSON.stringify(file.category)},
  },`;
}).join('\n');

const content = `// Denna fil genereras automatiskt av scripts/generate-sounds.js
export type SoundCategory = "break" | "goal" | "penalty";

export interface SoundTrack {
  id: number;
  title: string;
  source: any;
  category: SoundCategory;
}

export const sounds: SoundTrack[] = [
${items}
];
`;

fs.writeFileSync(outputFile, content, 'utf8');
console.log(`Skapade ${outputFile} med ${allFiles.length} låtar (Break: ${breakFiles.length}, Goal: ${goalFiles.length}, Penalty: ${penaltyFiles.length})!`);
