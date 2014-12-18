var PromiserFn = require('./util/promiser');
var Promiser;

var Scanner = require('./scanner');

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
	compile: function(localRaw) {

		var pInstance = this;
		var raw = localRaw;
        var onlyonce=0;
        var doScan = function(content) {
            onlyonce++;
            var blocks = Scanner.scanCurly(content);
            var compiledContent = "";
            if (blocks.length) {
                for (var i = 0, len = blocks.length; i < len; i++) {
                    var tag = blocks[i].tag;
                    var tagContent = blocks[i].block;
                    compiledContent += pInstance.wrapTags(tag, doScan(tagContent));
                    
                };
            } else {
                /**
                 * Stray content
                 */
                compiledContent += content;
            }
            return compiledContent;
        };
        var compiled = doScan(localRaw);
        

		// var compiled = raw.replace(pInstance.regexps('extractBlobFull'), function(_, tag, inner) {

		// 	/**
		// 	 * Recurse
		// 	 */
		// 	if (inner.match(pInstance.regexps('extractBlobFull'))) {
		// 		return pInstance.wrapTags(tag, pInstance.compile(inner));
		// 	} else {
		// 		return pInstance.wrapTags(tag, inner);
		// 	}
		// });
		return compiled;
	},

	/**
	 * Return content wrapped in tag
	 * @param  {String} tag     The tag to wrap
	 * @param  {String} content The innerHTML
	 * @return {String}         The final HTML for the tag
	 */
	wrapTags: function(tag, content, attribs) {
		var pInstance = this;
		
		//get indent
		var attribs = attribs ? ' ' + attribs : '';
		tag = tag.trim();
		return "<" + tag + attribs + ">\n" + content + "\n</" + tag + ">\n";
	},
	regexps: function(str) {
		var re = {
			extractIndent: '^(\\t|\\s)*(?!\\t\\s)',
			extractTag: '^.+?(?!\\w)', //matches all alphanumeric till non-alphanumeric found
			extractAttribs: '\\[([^{}?]+?)\\]',
			extractBlob: '\{([^{}]+)\}',
			//extractBlobFull: '(.+?\{([^{}]+)\})'
			extractBlobFull: '(.+?)\{([\\S\\s]*)\}'
		}
		return new RegExp(re[str], 'g');
	},
	/**
	 * Compile a single line
	 * @param  {String} line Raw line
	 * @return {String}      Compiled line
	 */
	compileLine: function(line) {
		var pInstance = this;

		//ignore just whitespace
		if (!line.trim().length)
			return line;

		//get indent
		var indentMatch = line.match(pInstance.regexps('extractIndent'));
		var indent = indentMatch ? indentMatch.pop() : '';

		var tagMatch = line.trim().match(pInstance.regexps('extractTag'));

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
		var compiled = pInstance.compile(raw);
		
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