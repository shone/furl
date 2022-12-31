'use strict';

const blockTripleSet = Symbol('BlockTripleSet');

function BlockTripleSet() {
	const triples = new Set();

	let counter = 0;

	const valToCounter = new Map();
	const countersToVal = new Map();

	// const idsToCounter = new Map();
	// const countersToId = new Map();
 // 
	// const valuesToCounter = new Map();
	// const countersToValue = new Map();

	function addBlock(block) {
		let idCounter = null;
		if (block.id) {
			idCounter = valToCounter.get(block.id);
			if (!idCounter) {
				idCounter = counter++;
				valToCounter.set(block.id, idCounter);
				countersToVal.set(idCounter, block.id);
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
		return {idCounter, headCounter, valueCounter};
	}
	function getBlockCounters(block) {
		return {
			idCounter:    valToCounter.get(block.id),
			headCounter:  valToCounter.get(block.head),
			valueCounter: valToCounter.get(block.value),
		}
	}
	function getBlockFromCounters({idCounter, headCounter, valueCounter}) {
		return {
			id:    countersToVal.get(idCounter),
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

const convertBlockTripleArrayToBlockTripleSet = Symbol('Convert BlockTripleArray to BlockTripleSet');
blocks.push({
	id: func,
	head: convertBlockTripleArrayToBlockTripleSet,
	value: {
		conversion: {
			from: blockTripleArray,
			to: blockTripleSet,
		},
		func: array => {
			const set = BlockTripleSet();
			for (const block of array) {
				set.add(block);
			}
			return set;
		}
	}
});

const convertBlockTripleSetToBlockTripleArray = Symbol('Convert BlockTripleSet to BlockTripleArray');
blocks.push({
	id: func,
	head: convertBlockTripleSetToBlockTripleArray,
	value: {
		conversion: {
			from: blockTripleSet,
			to: blockTripleArray,
		},
		func: set => {
			const array = [];
			set.value.forEach(triple => array.push(triple));
			return {id: blockTripleArray, value: array};
		}
	}
});

const mergeBlockTripleSet = Symbol('Merge BlockTripleSet');
blocks.push({
	id: func,
	head: mergeBlockTripleSet,
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
