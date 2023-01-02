'use strict';

customElements.define('triple-treeview', class TripleTreeview extends HTMLElement {
	constructor() {
		super();

		const self = this;

		function renderSymbolOrBlock(v) {
			const el = document.createElement('span');
			el.className = 'block';
			if (typeof v === 'symbol') {
				el.textContent = v.description;
			} else {
				el.textContent = `{${v.type ? v.type.description : ''} ${v.head ? v.head.description : ''} ${v.value !== undefined ? String(v.value) : ''}}`;
			}
			el.symbolOrBlock = v;
			return el;
		}

		function setView(id) {
			self.innerHTML = '';
			const triples = findTriplesWithId(id);
			self.append(...triples.map(triple => {
				const tripleEl = document.createElement('div');
				tripleEl.className = 'triple';

				tripleEl.append(renderSymbolOrBlock(triple[0]));
				tripleEl.append('->');
				tripleEl.append(renderSymbolOrBlock(triple[1]));
				tripleEl.append('->');
				tripleEl.append(renderSymbolOrBlock(triple[2]));

				return tripleEl;
			}));
		}

		setView(m10line);

		self.onclick = event => {
			const symbolOrBlock = event.target.symbolOrBlock;
			if (symbolOrBlock && typeof symbolOrBlock === 'symbol') {
				setView(symbolOrBlock);
			}
		}
	}
});
