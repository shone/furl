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
	type: idTriplePattern,
	value: {
		via: is,
		to: station,
		ids: [eberswalderStr, husemannStr, prenzDanz, winsStr, greifsDanzStr],
	},
});

blocks.push({
	type: blockTripleArray,
	value: [
		[{head: m10line},         {head: is},    {head: transitLine}],
		[{head: eberswalderStr},  {head: label}, {type: string, value: 'Eberswalder Str.'}],
		[{head: husemannStr},     {head: label}, {type: string, value: 'Husemann Str.'}],
		[{head: prenzDanz},       {head: label}, {type: string, value: 'Prenzlauer Allee/Danziger Str.'}],
		[{head: winsStr},         {head: label}, {type: string, value: 'Winsstr.'}],
		[{head: greifsDanzStr},   {head: label}, {type: string, value: 'Greifswalder Str.'}],
	],
});

blocks.push({
	type: idArray,
	head: m10line,
	value: [greifsDanzStr, winsStr, prenzDanz, husemannStr, eberswalderStr],
});
