var fs = require('fs');

/**
 * The parse component responsible for reading and parsing
 * @type {Function}
 */
var Parser = function(sPath, dPath) {
	//this.perform(sPath, dPath);
}

Parser.prototype = {
	/**
	 * Initialize source path
	 * @type {String}
	 */
	source: '',

	/**
	 * Initialize dest path
	 * @type {String}
	 */
	dest: '',

	/**
	 * Initialize source content
	 * @type {String}
	 */
	sourceContent: '',

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
	readSource: function(then) {
		var pInstance = this;
		fs.readFile(pInstance.get('source'), function(err, data) {
			if (err) {
				throw err;
			}
			pInstance.set('sourceContent', data.toString());
			Promiser.next(then);
		});
	},

	/**
	 * Compile tshirt source content to HTML
	 * @param  {String} source Content in tshirt format
	 * @return {String}        Content in HTML format
	 */
	doCompile: function(then) {
		var pInstance = this;

		//STUB (TODO)
		var compiled = pInstance.get('sourceContent');

		pInstance.set('compiled', compiled);
		Promiser.next(then);
	},

	/**
	 * Post compilation routine for cleanups
	 * @return {Void}
	 */
	postCompile: function(then) {
		var pInstance = this;

		if (pInstance.get('compiled').length) {
			fs.writeFile(pInstance.get('dest'), pInstance.compiled, function(err) {
				if (err) {
					throw err;
				}
				Promiser.next(then);
			});
		}
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

	/**
	 * Perform the various steps in the compilation routine
	 * @param  {String} source Source file path
	 * @param  {String} dest   Destination file path
	 * @return {String}        Compiled HTML
	 */
	perform: function(source, dest) {
		var pInstance = this;

		pInstance.set('source', source);
		pInstance.set('dest', dest);

		var then = [pInstance.doCompile, pInstance.postCompile, function(then) {
			Promiser.next(then);
		}];
		pInstance.readSource(then);
	}
}

/**
 * Simple promise-dealing object
 * @type {Void}
 */
var Promiser = {
	/**
	 * The parser instance that the promise will use
	 * @type {Parser}
	 */
	parserInstance: undefined,

	/**
	 * Init function to set the parser instance to be used
	 * @param  {Parser} parserInstance Instance of the parser
	 * @return {Void}                
	 */
	init: function(parserInstance) {
		this.parserInstance = parserInstance;
	},

	/**
	 * Next function to use the next in stack
	 * @param  {Array}   stack Stack of callbacks
	 * @param  {Array}   args  Arguments to be passed [optional]
	 * @return {Void}       
	 */
	next: function(stack, args) {
		if (stack.length) {
			stack.shift().apply(this.parserInstance, [stack, args]);
		} else {
			console.log('Stack processed.');
		}
	}
}

module.exports = function(program) {
	/**
	 * Get the source from the args
	 * @type {String}
	 */
	var sPath = program.source;
	
	/**
	 * Get the dest from the args
	 * @type {String}
	 */
	var dPath = program.dest;



	/**
	 * Create an instance of the parser
	 * @type {String}
	 */
	var P = new Parser(sPath, dPath);

	/**
	 * Initialize the promiser object
	 */
	Promiser.init(P);
	
	/**
	 * Perform the parsing routine
	 */
	P.perform(sPath, dPath)
}