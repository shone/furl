'use strict';

const viewEl = document.getElementById('triple-tree-view');

function findTriplesWithId(id) {
	const results = [];
	for (const block of blocks) {
		let idTriples = Convert({source: block, targetId: idTripleArray});

		if (!idTriples) {
			const blockTriples = Convert({source: block, targetId: blockTripleArray});
			if (blockTriples) {
				idTriples = {
					value: blockTriples.value.map(blockTriple => [
						blockTriple[0].head || blockTriple[0],
						blockTriple[1].head || blockTriple[1],
						blockTriple[2].head || blockTriple[2],
					])
				}
			}
		}

		if (!idTriples) {
			continue;
		}

		for (const triple of idTriples.value) {
			if (triple.includes(id)) {
				results.push(triple);
			}
		}
	}
	return results;
}

function renderSymbolOrBlock(v) {
	if (typeof v === 'symbol') {
		return String(v);
	}
	return `{${v.id ? String(v.id) : ''} ${v.head ? String(v.head) : ''} ${v.value !== undefined ? String(v.value) : ''}}`
}

function setView(id) {
	viewEl.innerHTML = '';
	const triples = findTriplesWithId(id);
	viewEl.append(...triples.map(triple => {
		const tripleEl = document.createElement('div');

		const fromEl = document.createElement('span');
		fromEl.textContent = renderSymbolOrBlock(triple[0]);
		fromEl.symbolOrBlock = triple[0];
		tripleEl.append(fromEl);

		tripleEl.append('->');

		const viaEl = document.createElement('span');
		viaEl.textContent = renderSymbolOrBlock(triple[1]);
		viaEl.symbolOrBlock = triple[1];
		tripleEl.append(viaEl);

		tripleEl.append('->');

		const toEl = document.createElement('span');
		toEl.textContent = renderSymbolOrBlock(triple[2]);
		toEl.symbolOrBlock = triple[2];
		tripleEl.append(toEl);

		return tripleEl;
	}));
}

setView(m10line);

viewEl.onclick = event => {
	const symbolOrBlock = event.target.symbolOrBlock;
	if (symbolOrBlock && typeof symbolOrBlock === 'symbol') {
		setView(symbolOrBlock);
	}
}

// viewEl.innerHTML = findTriplesWithId(m10line).map(triple => {
// 	return `
// 		<div>
// 			${renderSymbolOrBlock(triple[0])} -> ${renderSymbolOrBlock(triple[1])} -> ${renderSymbolOrBlock(triple[2])}
// 		</div>
// 	`;
// }).join('\n');
