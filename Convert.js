'use strict';

const convert = Symbol('Convert');

function findConversionPath(sourceType, targetType) {
	const conversions = blocks.filter(block => block.type === func && block.value.conversion).map(block => block.value);
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

function Convert({block, type}) {
	if (block.type === type) {
		return block;
	}
	const conversionPath = findConversionPath(block.type, type);
	if (!conversionPath) {
		return null;
	}
	let convertedBlock = block;
	for (const conversion of conversionPath) {
		convertedBlock = conversion.func(convertedBlock);
	}
	return convertedBlock;
}

blocks.push({
	type: func,
	head: convert,
	value: {
		args: {
			block: {},
			type: {},
		},
		func: Convert,
	}
});
