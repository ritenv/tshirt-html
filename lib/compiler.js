var PromiserFn = require('./util/promiser');
var Promiser;

var Compiler = function(content) {

}

Compiler.prototype = {
	/**
	 * Lines from the raw code
	 * @type {Array}
	 */
	lines: [],

	/**
	 * Initialize raw uncompiled content holder
	 * @type {String}
	 */
	raw: '',

	/**
	 * Initialize compiled content holder
	 * @type {String}
	 */
	compiled: '',

	/**
	 * New line character identified
	 * @type {String}
	 */
	newline: '\n',

	/**
	 * Get lines from the raw content
	 * @return {Array} the lines array
	 */
	getLines: function() {
		var pInstance = this;
		var content = pInstance.get('raw');

		if (!content.length) {
			return [];
		}

		//TODO: deal with other line endings
		
		/**
		 * Check which newline 
		 */
		var lines;
		if (content.match(/\r\n/)) {
			pInstance.set('newline', '\r\n')
			lines = content.split('\r\n');
		} else if (content.match(/\n/)) {
			pInstance.set('newline', '\n')
			lines = content.split('\n');
		} else {
			lines = [content]; //only 1 line
		}

		pInstance.set('lines', lines);

		return lines;
	},

	/**
	 * Compiles a line to HTML
	 * @param  {String} line     One line string in raw format
	 * @param  {String} prevLine One line string in raw format to compare indentation
	 * @return {String}          One line string in compiled format
	 */
	compile: function() {
		var pInstance = this;
		var raw = pInstance.get('raw');
		var re = new RegExp('\{([^{}]+)\}', 'g');
		var matches = raw.match(re);

		var compiled = raw.replace(re, function(_, m) {
			var lines = m.split(pInstance.get('newline'));
			for (var j=0, jlen=lines.length; j<jlen; j++) {
				lines[j] = lines[j].trim();
			}
			return lines.join(pInstance.get('newline'));
		});

		console.log(compiled);

		// for (var i=0, len=matches.length; i<len; i++) {
		// 	var lines = matches[i].split(pInstance.get('newline'));
		// 	for (var j=0, jlen=lines.length; j<jlen; j++) {
		// 		lines[j] = lines[j].trim();
		// 	}
		// 	lines.join(pInstance.get('newline'));
		// 	matches[i] = lines;
		// }
		//console.log(matches);
	},


	/**
	 * Function to do the final compile
	 * @param  {String} raw Raw content format
	 * @return {String}     Compiled HTML content
	 */
	perform: function(raw) {
		var pInstance = this;
		pInstance.set('raw', raw);
		pInstance.compile();
		
		//var re = new RegExp(['{%(.+?)%}|', '{(.+?)}'].join(''), 'g');
		//var re = new RegExp(['{%(.+?)%}|', '{[^}]*}'].join(''), 'g');

		// pInstance.getLines();
		// var cleanedLines = pInstance.cleanIndents(pInstance.get('lines'));
		// console.log(cleanedLines);

		// //The compilation STUD
		// pInstance.set('compiled', pInstance.get('lines'));
		

		return pInstance.get('compiled');
	},

	/**
	 * Setter function for the object
	 * @param {String} key Name of property
	 * @param {String} val Value of property
	 */
	set: function(key, val) {
		var pInstance = this;
		if (typeof val === "undefined") {
			return;
		}
		if (typeof pInstance[key] != "undefined") {
			pInstance[key] = val;
		}
	},

	/**
	 * Getter function for the object
	 * @param  {String} key Name of property
	 * @return {Any}     Value of property
	 */
	get: function(key) {
		var pInstance = this;
		if (typeof pInstance[key] != "undefined") {
			return pInstance[key];
		} else {
			throw new Error('Property \'' + key +'\' does not exist');
		}
	},

}

module.exports = Compiler;