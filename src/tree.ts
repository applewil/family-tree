export interface Person {
  name: string;
  from?: string;
  born?: string;
  died?: string;
  father?: Person;
  mother?: Person;
}

export interface PersonRaw {
  name: string;
  from?: string;
  born?: string;
  died?: string;
  father?: string;
  mother?: string;
}

export function getDepth(root?: Person): number {
  if (root === undefined) {
    return 0;
  }
  const fatherDepth = getDepth(root.father);
  const motherDepth = getDepth(root.mother);
  return Math.max(fatherDepth, motherDepth) + 1;
}

export function getLevel(root: Person | undefined, level: number): Person[] {
  if (root === undefined) {
    return [];
  }
  if (level === 0) {
    return [root];
  }
  return [...getLevel(root.father, level - 1), ...getLevel(root.mother, level - 1)];
}

export function getParents(root: Person | undefined): Person[] {
  if (root === undefined) {
    return [];
  }
  const father = root.father ? [root.father, ...getParents(root.father)] : [];
  const mother = root.mother ? [root.mother, ...getParents(root.mother)] : [];
  return [...father, ...mother];
}

export function getNode(root: Person | undefined, name: string): Person | undefined {
  if (root === undefined) {
    return undefined;
  }

  if (root.name === name) {
    return root;
  }

  return getNode(root.father, name) || getNode(root.mother, name);
}

export function getChildren(root: Person | undefined, subject: Person, accumulator: Person[] = []): Person[] {
  if (root === undefined) {
    return [];
  }

  if ([root.father, root.mother].includes(subject)) {
    return [root, ...accumulator];
  }

  return [
    ...getChildren(root.father, subject, [root, ...accumulator]),
    ...getChildren(root.mother, subject, [root, ...accumulator]),
  ];
}

export function importTree(people: PersonRaw[]): Person {
  const nameToPerson = new Map(people.map(person => [person.name, person]));
  if (people.length !== nameToPerson.size) {
    throw Error('Duplicate');
  }
  const parents = new Set([...people.flatMap(({father, mother}) => [father, mother])]);
  const roots = people.filter(({name}) => !parents.has(name));
  const [root, ...extra] = roots;
  if (!root) {
    throw Error('No root');
  }
  if (extra.length) {
    throw Error('Multiple roots');
  }
  return convertPerson(root, nameToPerson);
}

function convertPerson(root: PersonRaw, nameToPerson: Map<string, PersonRaw>): Person {
  const parentCount = [root.father, root.mother].filter(parent => parent).length;
  if (parentCount === 1) {
    throw Error('Single parent');
  }
  if (parentCount === 0) {
    return {...root, father: undefined, mother: undefined};
  }
  if ([root.father, root.mother].some(parent => !nameToPerson.has(parent!))) {
    throw Error('Parent not found');
  }
  const father = convertPerson(nameToPerson.get(root.father!)!, nameToPerson);
  const mother = convertPerson(nameToPerson.get(root.mother!)!, nameToPerson);
  return {...root, father, mother};
}
