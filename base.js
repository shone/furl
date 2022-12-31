'use strict';

const blocks = [];

const blockTripleArray = Symbol('BlockTripleArray');
const is = Symbol('is');
const label = Symbol('label');

function merge(...blocks) {
	if (blocks.length <= 1) {
		return;
	}
	if (!blocks.every(block => block.format === blocks[0].format)) {
		throw new Error(`Cannot merge blocks because they don't all have the same format.`);
	}
	const mergeFunction = functions.find(f => f.action === 'merge' && f.format === blocks[0].id);
	if (!mergeFunction) {
		throw new Error(`Can't find merge function`);
	}
	return {
		id: blocks[0].id,
		value: mergeFunction.func(blocks.map(block => block.value)),
	};
}

function buildList(from, via) {
	const triples = merge(...blocks.map(block => convert(block, 'triples')));
	let currentNode = from;
	const nodes = [currentNode];
	while (currentNode) {
		const nextTriple = triples.data.find(triple => triple[0][0] === currentNode && triple[1][0] === via);
		if (nextTriple) {
			currentNode = nextTriple[2][0];
			nodes.push(currentNode);
		} else {
			currentNode = null;
		}
	}
	return nodes.join(' ');
}

function findNodes(from, via, to) {
	const blockTripleSet = merge(...blocks.map(block => convert(block, 'BlockTripleSet')));
	const result = [];
	blockTripleSet.value.forEach(triple => {
		if (
			(!from || triple[0].id === from) &&
			(!via  || triple[1].id === via) &&
			(!to   || triple[2].id === to)
		) {
			if (!from) result.push(triple[0].id);
			if (!via)  result.push(triple[1].id);
			if (!to)   result.push(triple[2].id);
		}
	});
	return result;
}

function walkIndirectList(firstEntry, ref, next) {
	const results = [];
	let entry = firstEntry;
	while (entry) {
		const values = findNodes(entry, ref, null);
		if (values.length === 1) {
			results.push(values[0]);
		} else {
			results.push(null);
		}
		const nextEntries = findNodes(entry, next, null);
		if (nextEntries.length === 1) {
			entry = nextEntries[0];
		} else {
			break;
		}
	}
	return results;
}
