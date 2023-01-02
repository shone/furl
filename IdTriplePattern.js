'use strict';

const idTriplePattern = Symbol('IdTriplePattern');

blocks.push({
	type: func,
	head: idTriplePattern,
	value: {
		conversion: {
			from: idTriplePattern,
			to: idTripleArray,
		},
		func: block => {
			return {
				type: block.type,
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
