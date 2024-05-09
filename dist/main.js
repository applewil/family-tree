/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hexToBytes = exports.bytesToHex = exports.decryptData = exports.encryptData = void 0;
const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();
function getPasswordKey(password) {
    return crypto.subtle.importKey('raw', ENCODER.encode(password), 'PBKDF2', false, ['deriveKey']);
}
function deriveKey(passwordKey, salt) {
    return crypto.subtle.deriveKey({
        name: 'PBKDF2',
        salt: salt,
        iterations: 1,
        hash: 'SHA-256',
    }, passwordKey, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function encryptData(data, password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveKey(passwordKey, salt);
    const encryptedContent = await crypto.subtle.encrypt({
        name: 'AES-GCM',
        iv: iv,
    }, aesKey, ENCODER.encode(data));
    let bytes = new Uint8Array([...salt, ...iv, ...new Uint8Array(encryptedContent)]);
    return bytesToHex(bytes);
}
exports.encryptData = encryptData;
async function decryptData(data, password) {
    const bytes = hexToBytes(data);
    const salt = bytes.slice(0, 16);
    const iv = bytes.slice(16, 16 + 16);
    const encryptedData = bytes.slice(16 + 16);
    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveKey(passwordKey, salt);
    const decryptedBytes = await crypto.subtle.decrypt({
        name: 'AES-GCM',
        iv: iv,
    }, aesKey, encryptedData);
    return DECODER.decode(decryptedBytes);
}
exports.decryptData = decryptData;
function bytesToHex(buffer) {
    return buffer.reduce((data, byte) => {
        const hex = byte.toString(16);
        const padded = hex.length === 1 ? `0${hex}` : hex;
        return `${data}${padded}`;
    }, '');
}
exports.bytesToHex = bytesToHex;
function hexToBytes(hex) {
    const bytes = Array(hex.length)
        .fill(0)
        .map((_, i) => i)
        .filter(i => i % 2 === 0)
        .map(i => parseInt(`${hex[i]}${hex[i + 1]}`, 16));
    return new Uint8Array(bytes);
}
exports.hexToBytes = hexToBytes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jcnlwdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVuY3J5cHRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBTSxPQUFPLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztBQUNsQyxNQUFNLE9BQU8sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO0FBRWxDLFNBQVMsY0FBYyxDQUFDLFFBQWdCO0lBQ3RDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFDbEcsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFDLFdBQXNCLEVBQUUsSUFBZ0I7SUFDekQsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FDNUI7UUFDRSxJQUFJLEVBQUUsUUFBUTtRQUNkLElBQUksRUFBRSxJQUFJO1FBQ1YsVUFBVSxFQUFFLENBQUM7UUFDYixJQUFJLEVBQUUsU0FBUztLQUNoQixFQUNELFdBQVcsRUFDWCxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBQyxFQUM5QixLQUFLLEVBQ0wsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQ3ZCLENBQUM7QUFDSixDQUFDO0FBRU0sS0FBSyxVQUFVLFdBQVcsQ0FBQyxJQUFZLEVBQUUsUUFBZ0I7SUFDOUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hELE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN0RCxNQUFNLFdBQVcsR0FBRyxNQUFNLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuRCxNQUFNLE1B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

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.importTree = exports.getChildren = exports.getNode = exports.getParents = exports.getLevel = exports.getDepth = void 0;
function getDepth(root) {
    if (root === undefined) {
        return 0;
    }
    const fatherDepth = getDepth(root.father);
    const motherDepth = getDepth(root.mother);
    return Math.max(fatherDepth, motherDepth) + 1;
}
exports.getDepth = getDepth;
function getLevel(root, level) {
    if (root === undefined) {
        return [];
    }
    if (level === 0) {
        return [root];
    }
    return [...getLevel(root.father, level - 1), ...getLevel(root.mother, level - 1)];
}
exports.getLevel = getLevel;
function getParents(root) {
    if (root === undefined) {
        return [];
    }
    const father = root.father ? [root.father, ...getParents(root.father)] : [];
    const mother = root.mother ? [root.mother, ...getParents(root.mother)] : [];
    return [...father, ...mother];
}
exports.getParents = getParents;
function getNode(root, name) {
    if (root === undefined) {
        return undefined;
    }
    if (root.name === name) {
        return root;
    }
    return getNode(root.father, name) || getNode(root.mother, name);
}
exports.getNode = getNode;
function getChildren(root, subject, accumulator = []) {
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
exports.getChildren = getChildren;
function importTree(people) {
    const nameToPerson = new Map(people.map(person => [person.name, person]));
    if (people.length !== nameToPerson.size) {
        throw Error('Duplicate');
    }
    const parents = new Set([...people.flatMap(({ father, mother }) => [father, mother])]);
    const roots = people.filter(({ name }) => !parents.has(name));
    const [root, ...extra] = roots;
    if (!root) {
        throw Error('No root');
    }
    if (extra.length) {
        throw Error('Multiple roots');
    }
    return convertPerson(root, nameToPerson);
}
exports.importTree = importTree;
function convertPerson(root, nameToPerson) {
    const parentCount = [root.father, root.mother].filter(parent => parent).length;
    if (parentCount === 1) {
        throw Error('Single parent');
    }
    if (parentCount === 0) {
        return { ...root, father: undefined, mother: undefined };
    }
    if ([root.father, root.mother].some(parent => !nameToPerson.has(parent))) {
        throw Error('Parent not found');
    }
    const father = convertPerson(nameToPerson.get(root.father), nameToPerson);
    const mother = convertPerson(nameToPerson.get(root.mother), nameToPerson);
    return { ...root, father, mother };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBa0JBLFNBQWdCLFFBQVEsQ0FBQyxJQUFhO0lBQ3BDLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQ3ZCLE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNELE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUMsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBUEQsNEJBT0M7QUFFRCxTQUFnQixRQUFRLENBQUMsSUFBd0IsRUFBRSxLQUFhO0lBQzlELElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQ3ZCLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUNELElBQUksS0FBSyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBQ0QsT0FBTyxDQUFDLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEYsQ0FBQztBQVJELDRCQVFDO0FBRUQsU0FBZ0IsVUFBVSxDQUFDLElBQXdCO0lBQ2pELElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQ3ZCLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUNELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxH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

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.load = void 0;
const encryption_1 = __webpack_require__(1);
const tree_1 = __webpack_require__(2);
function personToRow(person, level, index) {
    const fatherOrMother = level === 0 ? '' : index % 2 === 0 ? 'father' : 'mother';
    const columns = [person.from || '??', person.born || '??', person.died || '??'];
    const name = `<span class="name">${person.name}</span>`;
    return `<td class=${fatherOrMother}>${name}</td><td>${columns.join('</td><td>')}</td>`;
}
function generateLevelRow(level, depth) {
    return `<td colspan="4" class="generation">Generation ${depth - level}</td>`;
}
function renderTree(data) {
    const root = (0, tree_1.importTree)(data);
    const depth = (0, tree_1.getDepth)(root);
    Array(depth)
        .fill(0)
        .forEach((_, level) => {
        const table = document.getElementById('main').children[0];
        const levelRow = table.insertRow(-1);
        levelRow.innerHTML = generateLevelRow(level, depth);
        const people = (0, tree_1.getLevel)(root, level);
        people.forEach((person, index) => {
            const personRow = table.insertRow(-1);
            personRow.innerHTML = personToRow(person, level, index);
            personRow.id = nameToId(person.name);
            personRow.children[0].children[0].onclick = () => highlight(root, personRow.id);
        });
    });
}
function highlight(root, subjectId) {
    const person = (0, tree_1.getNode)(root, idToName(subjectId));
    const parents = (0, tree_1.getParents)(person);
    const children = (0, tree_1.getChildren)(root, person);
    const highlightIds = [person, ...parents, ...children].map(person => nameToId(person.name));
    const ids = [root, ...(0, tree_1.getParents)(root)].map(person => nameToId(person.name));
    ids.forEach(id => document.getElementById(id)?.classList.remove('highlighted', 'selected'));
    document.getElementById(subjectId)?.classList.add('selected');
    highlightIds.forEach(id => document.getElementById(id)?.classList.add('highlighted'));
}
async function load() {
    const encryptedData = await (await fetch('encrypted-data.txt')).text();
    const passwordBox = document.getElementById('password');
    const data = await decrypt(encryptedData, passwordBox.value);
    if (data) {
        const peopleRaw = JSON.parse(data);
        renderTree(peopleRaw);
        document.getElementById('password-form').remove();
        document.getElementById('main').classList.remove('hidden');
    }
    else {
        passwordBox.value = '';
        document.getElementById('password-message').classList.remove('hidden');
    }
}
exports.load = load;
async function decrypt(encryptedData, password) {
    try {
        return await (0, encryption_1.decryptData)(encryptedData, password);
    }
    catch (e) {
        console.error(e);
        return undefined;
    }
}
function nameToId(name) {
    return name.replaceAll(' ', '-');
}
function idToName(name) {
    return name.replaceAll('-', ' ');
}
exports["default"] = {
    load,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQTJDO0FBQzNDLGlDQUE2RztBQUU3RyxTQUFTLFdBQVcsQ0FBQyxNQUFjLEVBQUUsS0FBYSxFQUFFLEtBQWE7SUFDL0QsTUFBTSxjQUFjLEdBQUcsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7SUFDaEYsTUFBTSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDO0lBQ2hGLE1BQU0sSUFBSSxHQUFHLHNCQUFzQixNQUFNLENBQUMsSUFBSSxTQUFTLENBQUM7SUFDeEQsT0FBTyxhQUFhLGNBQWMsSUFBSSxJQUFJLFlBQVksT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO0FBQ3pGLENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUFDLEtBQWEsRUFBRSxLQUFhO0lBQ3BELE9BQU8saURBQWlELEtBQUssR0FBRyxLQUFLLE9BQU8sQ0FBQztBQUMvRSxDQUFDO0FBRUQsU0FBUyxVQUFVLENBQUMsSUFBaUI7SUFDbkMsTUFBTSxJQUFJLEdBQUcsSUFBQSxpQkFBVSxFQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLE1BQU0sS0FBSyxHQUFHLElBQUEsZUFBUSxFQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLEtBQUssQ0FBQyxLQUFLLENBQUM7U0FDVCxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ1AsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ3BCLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBcUIsQ0FBQztRQUMvRSxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsUUFBUSxDQUFDLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEQsTUFBTSxNQUFNLEdBQUcsSUFBQSxlQUFRLEVBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDL0IsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDeEQsU0FBUyxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBcUIsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkcsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxJQUFZLEVBQUUsU0FBaUI7SUFDaEQsTUFBTSxNQUFNLEdBQUcsSUFBQSxjQUFPLEVBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBRSxDQUFDO0lBQ25ELE1BQU0sT0FBTyxHQUFHLElBQUEsaUJBQVUsRUFBQyxNQUFNLENBQUMsQ0FBQztJQUNuQyxNQUFNLFFBQVEsR0FBRyxJQUFBLGtCQUFXLEVBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNDLE1BQU0sWUFBWSxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsT0FBTyxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzVGLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBQSxpQkFBVSxFQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzdFLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDNUYsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzlELFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztBQUN4RixDQUFDO0FBRU0sS0FBSyxVQUFVLElBQUk7SUFDeEIsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN2RSxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBcUIsQ0FBQTtJQUMzRSxNQUFNLElBQUksR0FBRyxNQUFNLE9BQU8sQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdELElBQUksSUFBSSxFQUFFLENBQUM7UUFDVCxNQUFNLFNBQVMsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRCxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNuRCxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUQsQ0FBQztTQUFNLENBQUM7UUFDTixXQUFXLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUN2QixRQUFRLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMxRSxDQUFDO0FBQ0gsQ0FBQztBQWJELG9CQWFDO0FBRUQsS0FBSyxVQUFVLE9BQU8sQ0FBQyxhQUFxQixFQUFFLFFBQWdCO0lBQzVELElBQUksQ0FBQztRQUNILE9BQU8sTUFBTSxJQUFBLHdCQUFXLEVBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ1gsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQixPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0FBQ0gsQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLElBQVk7SUFDNUIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBRUQsU0FBUyxRQUFRLENBQUMsSUFBWTtJQUM1QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFFRCxrQkFBZTtJQUNiLElBQUk7Q0FDTCxDQUFDIn0=
})();

var __webpack_export_target__ = self;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map