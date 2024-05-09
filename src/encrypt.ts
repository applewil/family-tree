import {readFileSync, writeFileSync} from 'fs';
import {encryptData} from './encryption';

async function main() {
  const data = readFileSync('src/data.json', 'utf8');
  const encryptedData = await encryptData(data, process.env.PASSWORD!);
  writeFileSync('dist/encrypted-data.txt', encryptedData);
}

main().catch(e => {
  throw e;
});
