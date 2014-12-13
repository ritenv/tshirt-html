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
		if (content.match(/;/)) {
			pInstance.set('newline', ';')
			lines = content.split(';');
		}
		// else if (content.match(/\n/)) {
		// 	pInstance.set('newline', '\n')
		// 	lines = content.split('\n');
		// } else {
		// 	lines = [content]; //only 1 line
		// }

		pInstance.set('lines', lines);

		return lines;
	},

	/**
	 * Compilation routine from raw to compiled
	 * @return {String}          String in compiled format
	 */
	compile: function() {

		var RE = function(str) {
			return new RegExp(str, 'g');
		};

		var pInstance = this;
		var raw = pInstance.get('raw');
		var subsetRE = '\{([^{}]+)\}';
		var re = RE('(.+?'+subsetRE+')');
		//var matches = raw.match(re);
		
		var compiled = raw.replace(re, function(_, full, inner) {
			/**
			 * Get open and close tags
			 */
			var subRe = RE(subsetRE);
			tag = full.replace(subRe, '');

			var lines = inner.split(pInstance.get('newline'));
			for (var j=0, jlen=lines.length; j<jlen; j++) {
				lines[j] = pInstance.compileLine(lines[j]);
			}
			return pInstance.wrapTags(tag, lines.join(pInstance.get('newline')));
		});
		return compiled;
	},

	/**
	 * Return content wrapped in tag
	 * @param  {String} tag     The tag to wrap
	 * @param  {String} content The innerHTML
	 * @return {String}         The final HTML for the tag
	 */
	wrapTags: function(tag, content) {
		//TODO: Maintain tag indent
		var pInstance = this;
		var indent = tag.match(pInstance.regexps().extractIndent)[0];
		tag = tag.trim();
		return indent + "<" + tag + ">" + content + "</" + tag + ">";
	},
	regexps: function() {
		return {
			extractIndent: '^(\\t|\\s)*(?!\\t\\s)',
			extractTag: '^.+?(?!\\w)', //matches all alphanumeric till non-alphanumeric found
			extractAttribs: '\\[([^{}?]+?)\\]'//
		}
	},
	/**
	 * Compile a single line
	 * @param  {String} line Raw line
	 * @return {String}      Compiled line
	 */
	compileLine: function(line) {
		var pInstance = this;

		if (!line.trim().length)
			return line;
		var re = pInstance.regexps();
		var RE = function(str) {
			return new RegExp(str, 'g');
		};

		var indentMatch = line.match(RE(re.extractIndent));
		var indent = indentMatch ? indentMatch.pop() : '';

		var tagMatch = line.trim().match(RE(re.extractTag));

		var tag = tagMatch ? tagMatch.pop(): '';

		return indent + "<" + tag + ">" + "</" + tag + ">";
	},


	/**
	 * Function to do the final compile
	 * @param  {String} raw Raw content format
	 * @return {String}     Compiled HTML content
	 */
	perform: function(raw) {
		var pInstance = this;
		pInstance.set('raw', raw);
		var compiled = pInstance.compile();
		
		pInstance.set('compiled', compiled);

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