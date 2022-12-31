'use strict';

const idTriplePattern = Symbol('IdTriplePattern');

blocks.push({
	id: func,
	head: idTriplePattern,
	value: {
		conversion: {
			from: idTriplePattern,
			to: idTripleArray,
		},
		func: block => {
			return {
				id: block.id,
				head: block.head,
				value: block.value.ids.map(id => [
					block.value.from || id,
					block.value.via  || id,
					block.value.to   || id,
				])
			}
		}
	}
});
