'use strict';

const station = Symbol('Station');

const transitLine = Symbol('Transit line');
const m10line = Symbol('M10 line');

const eberswalderStr = Symbol('Eberswalder Str.');
const husemannStr = Symbol('Husemann Str.');
const prenzDanz = Symbol('Prenzlauer Allee/Danziger Str.');
const winsStr = Symbol('Winsstr.');
const greifsDanzStr = Symbol('Greifswalder Str./Danziger Str.');

blocks.push({
	id: idTriplePattern,
	value: {
		via: is,
		to: station,
		ids: [eberswalderStr, husemannStr, prenzDanz, winsStr, greifsDanzStr],
	},
});

blocks.push({
	id: blockTripleArray,
	value: [
		[{head: m10line},         {head: is},    {head: transitLine}],
		[{head: eberswalderStr},  {head: label}, {id: string, value: 'Eberswalder Str.'}],
		[{head: husemannStr},     {head: label}, {id: string, value: 'Husemann Str.'}],
		[{head: prenzDanz},       {head: label}, {id: string, value: 'Prenzlauer Allee/Danziger Str.'}],
		[{head: winsStr},         {head: label}, {id: string, value: 'Winsstr.'}],
		[{head: greifsDanzStr},   {head: label}, {id: string, value: 'Greifswalder Str.'}],
	],
});

blocks.push({
	id: idArray,
	head: m10line,
	value: [greifsDanzStr, winsStr, prenzDanz, husemannStr, eberswalderStr],
});
