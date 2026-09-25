const fs = require('fs');
const path = require('path');

const soundsDir = path.join(__dirname, '..', 'assets', 'musik2025');
const outputFile = path.join(__dirname, '..', 'src', 'sounds.ts');

if (!fs.existsSync(soundsDir)) {
  console.error('Hittade inte mappen:', soundsDir);
  process.exit(1);
}

const files = fs.readdirSync(soundsDir).filter(file => file.endsWith('.mp3'));

const items = files.map((file, index) => {
  // Rensa bort .mp3, youtube-taggar som [x3hMv0No84o] och onödiga parenteser
  let title = file.replace(/\.mp3$/i, '');
  title = title.replace(/\s*\[[a-zA-Z0-9_-]+\]/g, '');
  title = title.replace(/\s*\(Official Music Video\)/i, '');
  title = title.replace(/\s*Lyric Video/i, '');
  title = title.trim();

  const requirePath = `../assets/musik2025/${file}`;

  return `  {
    id: ${index + 1},
    title: ${JSON.stringify(title)},
    source: require(${JSON.stringify(requirePath)}),
  },`;
}).join('\n');

const content = `// Denna fil genereras automatiskt av scripts/generate-sounds.js
export interface SoundTrack {
  id: number;
  title: string;
  source: any;
}

export const sounds: SoundTrack[] = [
${items}
];
`;

fs.writeFileSync(outputFile, content, 'utf8');
console.log(`Skapade ${outputFile} med ${files.length} låtar!`);
