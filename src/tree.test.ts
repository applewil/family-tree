import {expect} from 'chai';
import {Person, PersonRaw, getChildren, getDepth, getLevel, getNode, getParents, importTree} from './tree';

describe('Tree', () => {
  it('getLevel', () => {
    const root = generateTree();
    const testCases: [number, string[]][] = [
      [0, ['Will']],
      [1, ['Jawad', 'Kathryn']],
      [2, ['Zhara', 'Lowell', 'Marion']],
      [3, ['John']],
      [4, []],
      [-2, []],
      [3000, []],
    ];

    testCases.forEach(([level, expected], i) => {
      const actual = getLevel(root, level).map(({name}) => name);
      expect(actual).to.eql(expected, `Case ${i + 1}`);
    });
  });

  it('getDepth', () => {
    const root1 = generateTree();
    const root2 = generateTree();
    root2.mother!.father!.father = undefined;
    const root3 = generateTree();
    root3.father = undefined;
    root3.mother = undefined;
    const testCases: [Person, number][] = [
      [root1, 4],
      [root2, 3],
      [root3, 1],
    ];
    testCases.forEach(([root, expected], i) => {
      const actual = getDepth(root);
      expect(actual).to.eql(expected, `Case ${i + 1}`);
    });
  });

  it('getParents', () => {
    const root = generateTree();
    const testCases: [Person, string[]][] = [
      [root.mother!, ['Lowell', 'John', 'Marion']],
      [root.father!, ['Zhara']],
      [root.father!.mother!, []],
    ];
    testCases.forEach(([root, expected], i) => {
      const actual = getParents(root).map(({name}) => name);
      expect(actual).to.eql(expected, `Case ${i + 1}`);
    });
  });

  it('getChildren', () => {
    const root = generateTree();
    const testCases: [Person, Person, string[]][] = [
      [root, root.mother!, ['Will']],
      [root, root, []],
      [root, {name: 'Bob'}, []],
      [root, root.mother!.father!.father!, ['Lowell', 'Kathryn', 'Will']],
    ];
    testCases.forEach(([root, subject, expected], i) => {
      const actual = getChildren(root, subject).map(({name}) => name);
      expect(actual).to.eql(expected, `Case ${i + 1}`);
    });
  });

  it('getNode', () => {
    const root = generateTree();
    const testCases: [Person, Person, Person | undefined][] = [
      [root, root.mother!, root.mother!],
      [root, root, root],
      [root, {name: 'Bob'}, undefined],
      [root, root.mother!.father!.father!, root.mother!.father!.father!],
    ];
    testCases.forEach(([root, subject, expected], i) => {
      const actual = getNode(root, subject.name);
      expect(actual).to.eql(expected, `Case ${i + 1}`);
    });
  });

  describe('importTree', () => {
    it('success', () => {
      const people: PersonRaw[] = [
        {name: 'Kathryn', father: 'Lowell', mother: 'Marion'},
        {name: 'Jawad'},
        {name: 'Lowell'},
        {name: 'Marion'},
        {name: 'Will', father: 'Jawad', mother: 'Kathryn'},
      ];
      const root = importTree(people);
      const actual = getParents(root).map(({name}) => name);
      expect(actual).to.eql(['Jawad', 'Kathryn', 'Lowell', 'Marion']);
    });
    it('duplicate', () => {
      const people: PersonRaw[] = [
        {name: 'Will', father: 'Jawad', mother: 'Kathryn'},
        {name: 'Kathryn'},
        {name: 'Jawad'},
        {name: 'Will', father: 'Jawad', mother: 'Kathryn'},
      ];
      expect(() => importTree(people)).to.throw(Error, 'Duplicate');
    });
    it('No root', () => {
      const people: PersonRaw[] = [
        {name: 'Will', father: 'Jawad', mother: 'Kathryn'},
        {name: 'Kathryn', father: 'Will', mother: 'Marion'},
        {name: 'Marion'},
        {name: 'Jawad'},
      ];
      expect(() => importTree(people)).to.throw(Error, 'No root');
    });
    it('Multiple roots', () => {
      const people: PersonRaw[] = [
        {name: 'Kathryn', father: 'Lowell', mother: 'Marion'},
        {name: 'Jawad'},
        {name: 'Lowell'},
        {name: 'Marion'},
      ];
      expect(() => importTree(people)).to.throw(Error, 'Multiple roots');
    });
    it('Single parent', () => {
      const people: PersonRaw[] = [{name: 'Will', father: 'Jawad'}, {name: 'Jawad'}];
      expect(() => importTree(people)).to.throw(Error, 'Single parent');
    });
    it('Parent not found', () => {
      const people: PersonRaw[] = [{name: 'Will', father: 'Jawad', mother: 'Kathryn'}, {name: 'Jawad'}];
      expect(() => importTree(people)).to.throw(Error, 'Parent not found');
    });
  });
});

function generateTree() {
  const will: Person = {name: 'Will'};
  const kathryn: Person = {name: 'Kathryn'};
  const jawad: Person = {name: 'Jawad'};
  const marrion: Person = {name: 'Marion'};
  const lowell: Person = {name: 'Lowell'};
  const zhara: Person = {name: 'Zhara'};
  const john: Person = {name: 'John'};
  will.father = jawad;
  will.mother = kathryn;
  will.father.mother = zhara;
  will.mother.mother = marrion;
  will.mother.father = lowell;
  will.mother.father.father = john;
  return will;
}
