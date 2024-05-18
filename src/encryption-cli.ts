import {readFileSync, writeFileSync} from 'fs';
import {decryptData, encryptData} from './encryption';

async function main() {
  if (process.env.OPERATION === 'encrypt') {
    const data = readFileSync('src/data.json', 'utf8');
    const encryptedData = await encryptData(data, process.env.PASSWORD!);
    writeFileSync('docs/encrypted-data.txt', encryptedData);

    const demoData = readFileSync('src/demo-data.json', 'utf8');
    const demoEncryptedData = await encryptData(demoData, 'demo');
    writeFileSync('docs/demo-encrypted-data.txt', demoEncryptedData);
  } else if (process.env.OPERATION === 'decrypt') {
    const encryptedData = readFileSync('docs/encrypted-data.txt', 'utf8');
    const data = await decryptData(encryptedData, process.env.PASSWORD!);
    writeFileSync('src/data.json', data);

    const demoEncryptedData = readFileSync('docs/demo-encrypted-data.txt', 'utf8');
    const demoData = await decryptData(demoEncryptedData, 'demo');
    writeFileSync('src/demo-data.json', demoData);
  }
}

main().catch(e => {
  throw e;
});
