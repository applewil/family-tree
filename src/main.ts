import {decryptData} from './encryption';
import {Person, PersonRaw, getChildren, getDepth, getLevel, getNode, getParents, importTree} from './tree';

function personToRow(person: Person, level: number, index: number): string {
  const fatherOrMother = level === 0 ? '' : index % 2 === 0 ? 'father' : 'mother';
  const columns = [person.from || '??', person.born || '??', person.died || '??'];
  const name = `<span class="name">${person.name}</span>`;
  return `<td class=${fatherOrMother}>${name}</td><td>${columns.join('</td><td>')}</td>`;
}

function generateLevelRow(level: number, depth: number): string {
  return `<td colspan="4" class="generation">Generation ${depth - level}</td>`;
}

function renderTree(data: PersonRaw[]): void {
  const root = importTree(data);
  const depth = getDepth(root);
  Array(depth)
    .fill(0)
    .forEach((_, level) => {
      const table = document.getElementById('main')!.children[0] as HTMLTableElement;
      const levelRow = table.insertRow(-1);
      levelRow.innerHTML = generateLevelRow(level, depth);
      const people = getLevel(root, level);
      people.forEach((person, index) => {
        const personRow = table.insertRow(-1);
        personRow.innerHTML = personToRow(person, level, index);
        personRow.id = nameToId(person.name);
        (personRow.children[0].children[0] as HTMLSpanElement).onclick = () => highlight(root, personRow.id);
      });
    });
}

function highlight(root: Person, subjectId: string): void {
  const person = getNode(root, idToName(subjectId))!;
  const parents = getParents(person);
  const children = getChildren(root, person);
  const highlightIds = [person, ...parents, ...children].map(person => nameToId(person.name));
  const ids = [root, ...getParents(root)].map(person => nameToId(person.name));
  ids.forEach(id => document.getElementById(id)?.classList.remove('highlighted', 'selected'));
  document.getElementById(subjectId)?.classList.add('selected');
  highlightIds.forEach(id => document.getElementById(id)?.classList.add('highlighted'));
}

async function fetchEncryptedData(): Promise<string> {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const isDemo = urlSearchParams.get('demo') === 'true';
  const filename = isDemo ? 'demo-encrypted-data.txt' : 'encrypted-data.txt';
  return fetch(filename).then(response => response.text());
}

export async function load() {
  const encryptedData = await fetchEncryptedData();
  const passwordBox = document.getElementById('password') as HTMLInputElement;
  const data = await decrypt(encryptedData, passwordBox.value);
  if (data) {
    const peopleRaw: PersonRaw[] = JSON.parse(data);
    renderTree(peopleRaw);
    document.getElementById('password-form')!.remove();
    document.getElementById('main')!.classList.remove('hidden');
  } else {
    passwordBox.value = '';
    document.getElementById('password-message')!.classList.remove('hidden');
  }
}

async function decrypt(encryptedData: string, password: string): Promise<string | undefined> {
  try {
    return await decryptData(encryptedData, password);
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

function nameToId(name: string): string {
  return name.replaceAll(' ', '-');
}

function idToName(name: string): string {
  return name.replaceAll('-', ' ');
}

export default {
  load,
};
