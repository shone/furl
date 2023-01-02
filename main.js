'use strict';

const conversions = blocks.filter(block => block.type === func && block.value.conversion);
console.log(conversions.map(c => String(c.value.conversion.from) + ' -> ' + String(c.value.conversion.to)).join('\n'));

const m10lineBlock = {
	type: idArray,
	head: m10line,
	value: [greifsDanzStr, winsStr, prenzDanz, husemannStr, eberswalderStr],
}
console.log(Convert({block: m10lineBlock, type: blockTripleArray}));
