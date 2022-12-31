'use strict';

const func = Symbol('Func');

function call(id) {
	const f = blocks.find(block => block.id === func && block.head === id);
	if (!f) {
		throw `Cannot call "${id}": func block not found.`;
	}
	const argBlocks = (f.value.args||[]).map(arg => {
		const block = blocks.find(block => block.id === arg.blockId && block.head === arg.id);
		if (!block) {
			throw 'Could not find matching block for argument';
		}
		return block;
	});
	return f.value.func(...argBlocks);
}
