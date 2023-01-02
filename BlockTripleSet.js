'use strict';

const blockTripleSet = Symbol('BlockTripleSet');

function BlockTripleSet() {
	const triples = new Set();

	let counter = 0;

	const valToCounter = new Map();
	const countersToVal = new Map();

	function addBlock(block) {
		let typeCounter = null;
		if (block.type) {
			typeCounter = valToCounter.get(block.type);
			if (!typeCounter) {
				typeCounter = counter++;
				valToCounter.set(block.type, typeCounter);
				countersToVal.set(typeCounter, block.type);
			}
		}
		let headCounter = null;
		if (block.head) {
			headCounter = valToCounter.get(block.head);
			if (!headCounter) {
				headCounter = counter++;
				valToCounter.set(block.head, headCounter);
				countersToVal.set(headCounter, block.head);
			}
		}
		let valueCounter = null;
		if (block.value) {
			valueCounter = valToCounter.get(block.value);
			if (!valueCounter) {
				valueCounter = counter++;
				valToCounter.set(block.value, valueCounter);
				countersToVal.set(valueCounter, block.value);
			}
		}
		return {typeCounter, headCounter, valueCounter};
	}
	function getBlockCounters(block) {
		return {
			typeCounter:    valToCounter.get(block.type),
			headCounter:  valToCounter.get(block.head),
			valueCounter: valToCounter.get(block.value),
		}
	}
	function getBlockFromCounters({typeCounter, headCounter, valueCounter}) {
		return {
			type:  countersToVal.get(typeCounter),
			head:  countersToVal.get(headCounter),
			value: countersToVal.get(valueCounter),
		}
	}
	return {
		add: triple => {
			const from = addBlock(triple[0]);
			const via  = addBlock(triple[1]);
			const to   = addBlock(triple[2]);
			triples.add(JSON.stringify([from, via, to]));
		},
		has: triple => {
			const from = getBlockCounters(triple[0]);
			const via  = getBlockCounters(triple[1]);
			const to   = getBlockCounters(triple[2]);
			return triples.has(JSON.stringify([from, via, to]));
		},
		forEach: callback => {
			for (const triple of triples) {
				const [from, via, to] = JSON.parse(triple);
				callback([
					getBlockFromCounters(from),
					getBlockFromCounters(via),
					getBlockFromCounters(to),
				]);
			}
		}
	}
}

blocks.push({
	type: func,
	head: Symbol('Convert BlockTripleArray to BlockTripleSet'),
	value: {
		conversion: {
			from: blockTripleArray,
			to: blockTripleSet,
		},
		func: array => {
			const set = BlockTripleSet();
			for (const block of array.value) {
				set.add(block);
			}
			return {type: blockTripleSet, head: array.head, value: set};
		}
	}
});

blocks.push({
	type: func,
	head: Symbol('Convert BlockTripleSet to BlockTripleArray'),
	value: {
		conversion: {
			from: blockTripleSet,
			to: blockTripleArray,
		},
		func: set => {
			const array = [];
			set.value.forEach(triple => array.push(triple));
			return {type: blockTripleArray, head: set.head, value: array};
		}
	}
});

blocks.push({
	type: func,
	head: Symbol('Merge BlockTripleSet'),
	value: {
		merge: blockTripleSet,
		func: sets => {
			const mergedTriples = BlockTripleSet();
			for (const set of sets) {
				set.forEach(triple => mergedTriples.add(triple));
			}
			return mergedTriples;
		}
	}
});
