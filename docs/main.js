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
async function fetchEncryptedData() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const isDemo = urlSearchParams.get('demo') === 'true';
    const filename = isDemo ? 'demo-encrypted-data.txt' : 'encrypted-data.txt';
    return fetch(filename).then(response => response.text());
}
async function load() {
    const encryptedData = await fetchEncryptedData();
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

})();

var __webpack_export_target__ = self;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map