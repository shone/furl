'use strict';

// {
// 	const main = Symbol('Main');
// 	blocks.push({
// 		id: func,
// 		head: main,
// 		value: {
// 			args: [
// 				{id: convertIdArrayToBlockTripleSetInplace, blockId: func},
// 				{id: m10line, blockId: idArray},
// 			],
// 			func: (convert, idArray) => {
// 				convert.value.func(idArray);
// 			}
// 		}
// 	});
// 	console.log(call(main));
// }
// {
// 	const main = Symbol('Main');
// 	blocks.push({
// 		id: func,
// 		head: main,
// 		value: {
// 			args: [
// 				{id: convertBlockTripleSetToIdArrayInplace, blockId: func},
// 				{id: m10line, blockId: blockTripleSet},
// 			],
// 			func: (convert, idArray) => {
// 				convert.value.func(idArray);
// 				console.log(idArray);
// 			}
// 		}
// 	});
// 	console.log(call(main));
// }
// 
// console.log(Find({via: is, to: station}));
// 
const conversions = blocks.filter(block => block.id === func && block.value.conversion);
console.log(conversions.map(c => String(c.value.conversion.from) + ' -> ' + String(c.value.conversion.to)).join('\n'));

const m10lineBlock = {
	id: idArray,
	head: m10line,
	value: [greifsDanzStr, winsStr, prenzDanz, husemannStr, eberswalderStr],
}
console.log(Convert({source: m10lineBlock, targetId: blockTripleArray}));
