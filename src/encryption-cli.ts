import { readFileSync, writeFileSync } from 'fs';
import { decryptData, encryptData } from './encryption';

async function main() {
  if (process.env.OPERATION === 'encrypt') {
    const data = readFileSync('src/data.json', 'utf8');
    const encryptedData = await encryptData(data, process.env.PASSWORD!);
    writeFileSync('docs/encrypted-data.txt', encryptedData);
  } else if (process.env.OPERATION === 'decrypt') {
    const encryptedData = readFileSync('docs/encrypted-data.txt', 'utf8');
    const data = await decryptData(encryptedData, process.env.PASSWORD!);
    writeFileSync('src/data.json', data);
  }
}

main().catch(e => {
  throw e;
});
