'use strict';

const idArray = Symbol('IdArray');
const arrayIndex = Symbol('Array index');

const convertIdArrayToBlockTripleSet = Symbol('Convert IdArray to BlockTripleSet');
blocks.push({
	id: func,
	head: convertIdArrayToBlockTripleSet,
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
					{id: arrayIndex, value: index},
					{head: id},
				]);
			}
			return {id: 'BlockTripleSet', head: idArray.head, value: set};
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

const convertBlockTripleSetToIdArrayInplace = Symbol('Convert BlockTripleSet to IdArray in-place');
blocks.push({
	id: func,
	head: convertBlockTripleSetToIdArrayInplace,
	value: {
		conversion: {
			from: blockTripleSet,
			to: idArray,
		},
		arg: {blockId: blockTripleSet},
		func: block => {
			const ids = [];
			block.value.forEach(triple => {
				if (triple[0].id === block.head && triple[1].id === arrayIndex) {
					ids[triple[1].value] = triple[2].id;
				}
			});
			block.id = idArray;
			block.value = {
				ids: ids,
			}
		}
	}
});
