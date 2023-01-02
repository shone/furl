'use strict';

const idList = Symbol('IdList');

blocks.push({
	type: func,
	head: Symbol('Convert IdList to IdTripleArray'),
	value: {
		conversion: {
			from: idList,
			to: idTripleArray,
		},
		func: idList => {
			const triples = [];
			let prev = null;
			for (const id of idList.value.ids) {
				if (prev) {
					triples.push([prev, pattern.next, id]);
				}
				prev = id;
			}
			return {
				type: idTripleArray,
				head: idList.head,
				value: triples,
			}
		}
	}
});
