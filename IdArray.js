'use strict';

const idArray = Symbol('IdArray');
const arrayIndex = Symbol('Array index');

blocks.push({
	type: func,
	head: Symbol('Convert IdArray to BlockTripleSet'),
	value: {
		conversion: {
			from: idArray,
			to: blockTripleSet,
		},
		func: idArray => {
			const set = BlockTripleSet();
			for (const [index, id] of idArray.value.entries()) {
				set.add([
					{head: idArray.head},
					{type: arrayIndex, value: index},
					{head: id},
				]);
			}
			return {type: blockTripleSet, head: idArray.head, value: set};
		}
	}
});

// const convertIdArrayToBlockTripleSetInplace = Symbol('Convert IdArray to BlockTripleSet in-place');
// blocks.push({
// 	id: func,
// 	head: convertIdArrayToBlockTripleSetInplace,
// 	value: {
// 		conversion: {
// 			from: idArray,
// 			to: blockTripleSet,
// 		},
// 		func: block => {
// 			const set = BlockTripleSet();
// 			for (const [index, id] of block.value.entries()) {
// 				set.add([
// 					{id: block.head},
// 					{id: arrayIndex, value: index},
// 					{id: id},
// 				]);
// 			}
// 			block.id = blockTripleSet;
// 			block.value = set;
// 		}
// 	}
// });

blocks.push({
	type: func,
	head: Symbol('Convert BlockTripleSet to IdArray in-place'),
	value: {
		conversion: {
			from: blockTripleSet,
			to: idArray,
		},
		arg: {type: blockTripleSet},
		func: block => {
			const ids = [];
			block.value.forEach(triple => {
				if (triple[0].head === block.head && triple[1].id === arrayIndex) {
					ids[triple[1].value] = triple[2].head;
				}
			});
			block.type = idArray;
			block.value = {
				ids: ids,
			}
		}
	}
});
