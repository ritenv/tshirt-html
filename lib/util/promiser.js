/**
 * Simple promise-dealing object
 * @type {Void}
 */
module.exports = function(instance) {
	var Promiser = {
		/**
		 * The parser instance that the promise will use
		 * @type {Object}
		 */
		instance: instance,

		/**
		 * Init function to set the parser instance to be used
		 * @param  {Parser} instance Instance of the parser
		 * @return {Void}                
		 */
		init: function(instance) {
			this.instance = instance;
		},

		/**
		 * Next function to use the next in stack
		 * @param  {Array}   stack Stack of callbacks
		 * @param  {Array}   args  Arguments to be passed [optional]
		 * @return {Void}       
		 */
		next: function(stack, args) {
			if (stack.length) {
				stack.shift().apply(this.instance, [stack, args]);
			} else {
				console.log('Stack processed.');
			}
		}
	};
	return Promiser;
};