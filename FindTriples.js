'use strict';

function Find({from, via, to}) {
	const results = [];
	for (const block of blocks) {
		let idTriples = Convert({block, type: idTripleArray});
		if (!idTriples) {
			const blockTriples = Convert({block, type: blockTripleArray});
			if (blockTriples) {
				idTriples = blockTriples.map(blockTriple => [
					blockTriple[0].head,
					blockTriple[1].head,
					blockTriple[2].head,
				]);
			}
		}
		if (!idTriples) {
			continue;
		}
		for (const triple of idTriples) {
			if (
				(!from || triple[0] === from) &&
				(!via  || triple[1] === via) &&
				(!to   || triple[2] === to)
			) {
				results.push(triple);
			}
		}
	}
	return results;
}

blocks.push({
	type: func,
	head: Symbol('Find'),
	value: {
		args: {
			from: {},
			via:  {},
			to:   {},
		},
		func: Find,
	}
});

function findTriplesWithId(id) {
	const results = [];
	for (const block of blocks) {
		let idTriples = Convert({block, type: idTripleArray});

		if (!idTriples) {
			const blockTriples = Convert({block, type: blockTripleArray});
			if (blockTriples) {
				idTriples = {
					value: blockTriples.value.map(blockTriple => [
						blockTriple[0].head || blockTriple[0],
						blockTriple[1].head || blockTriple[1],
						blockTriple[2].head || blockTriple[2],
					])
				}
			}
		}

		if (!idTriples) {
			continue;
		}

		for (const triple of idTriples.value) {
			if (triple.includes(id)) {
				results.push(triple);
			}
		}
	}
	return results;
}
