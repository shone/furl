'use strict';

const idList = Symbol('IdList');

const convertIdListToIdTripleArray = Symbol('Convert IdList to IdTripleArray');
blocks.push({
	id: func,
	head: convertIdListToIdTripleArray,
	value: {
		conversion: {
			from: idList,
			to: idTripleArray,
		},
		func: idList => {
			const triples = [];
			let prev = null;
			for (const id of idList.ids) {
				if (prev) {
					triples.push([
						{id: prev},
						{id: pattern.next},
						{id: id},
					]);
				}
				prev = id;
			}
			return triples;
		}
	}
});
