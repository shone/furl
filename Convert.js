'use strict';

const convert = Symbol('Convert');

function findConversionPath(sourceType, targetType) {
	const conversions = blocks.filter(block => block.id === func && block.value.conversion).map(block => block.value);
	const visitedTypes = new Set();
	const parents = new Map();
	const queue = [sourceType];
	outerLoop:
	while (true) {
		const currentType = queue.shift();
		if (!currentType) {
			return null;
		}
		visitedTypes.add(currentType);
		for (const c of conversions) {
			if (c.conversion.from === currentType && !visitedTypes.has(c.conversion.to)) {
				parents.set(c.conversion.to, c);
				if (c.conversion.to === targetType) {
					break outerLoop;
				}
				queue.push(c.conversion.to);
			}
		}
	}

	const path = [];
	let currentType = targetType;
	while (currentType !== sourceType) {
		const c = parents.get(currentType);
		path.unshift(c);
		currentType = c.conversion.from;
	}
	return path;
}

function Convert({source, targetId}) {
	if (source.id === targetId) {
		return source;
	}
	const conversionPath = findConversionPath(source.id, targetId);
	if (!conversionPath) {
		return null;
	}
	let currentBlock = source;
	for (const conversion of conversionPath) {
		currentBlock = conversion.func(currentBlock);
	}
	return currentBlock;
	// const conversion = blocks.find(b => {
	// 	return b.id === func && b.value.conversion &&
	// 		b.value.conversion.from === source.id &&
	// 		b.value.conversion.to === targetId;
	// });
	// if (!conversion) {
	// 	return null;
	// 	// throw `Unable to find conversion from ${String(source.id)} to ${String(targetId)}`;
	// }
	// return conversion.value.func(source.value);
}

blocks.push({
	id: func,
	head: convert,
	value: {
		args: {
			source: {},
			targetId: {},
		},
		func: Convert,
	}
});
