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
			lines = content.split('\r\n');
		} else if (content.match(/\n/)) {
			lines = content.split('\n');
		} else {
			lines = [content]; //only 1 line
		}

		pInstance.set('lines', lines);

		return lines;
	},

	/**
	 * Function to do the final compile
	 * @param  {String} raw Raw content format
	 * @return {String}     Compiled HTML content
	 */
	perform: function(raw) {
		var pInstance = this;
		pInstance.set('raw', raw);
		
		pInstance.getLines();

		//The compilation STUD
		pInstance.set('compiled', pInstance.get('lines'));

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