var fs = require('fs');

/**
 * The parse object responsible for reading and parsing
 * @type {Object}
 */
var Parser = {
	/**
	 * Initialize source content
	 * @type {String}
	 */
	source: '',

	/**
	 * Initialize compiled content
	 * @type {String}
	 */
	compiled: '',

	/**
	 * Function to read the source file
	 * @param  {String} path Path to the source file
	 * @return {String}      Content of the source file
	 */
	readSource: function(path) {

	},

	/**
	 * Compile tshirt source content to HTML
	 * @param  {String} source Content in tshirt format
	 * @return {String}        Content in HTML format
	 */
	doCompile: function(source) {

	}
}

module.exports = function(program) {

	fs.readFile(program.source, function(err, data) {
		console.log(data.toString());
	});
}