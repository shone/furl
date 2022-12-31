'use strict';

const find = Symbol('Find');

function Find({from, via, to}) {
	const results = [];
	for (const block of blocks) {
		let idTriples = Convert({source: block, targetId: idTripleArray});
		if (!idTriples) {
			const blockTriples = Convert({source: block, targetId: blockTripleArray});
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
	id: func,
	head: find,
	value: {
		args: {
			from: {},
			via:  {},
			to:   {},
		},
		func: Find,
	}
});
