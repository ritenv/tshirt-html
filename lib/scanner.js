var Scanner = function(content) {

}
Scanner.prototype = {
    raw: null,

    /**
     * Scan raw text for outermost curly braces and tag
     * @param  {String} raw Raw content format
     * @return {Array}      Array of content and tag
     */
    scanCurly: function(raw) {
        var str = raw;
        var startIndex = -1;
        var currPos = 0;
        var curl = 0;
        var stillSearching = true;
        var ignoreUntil = false;
        var blocks = [];
        var lastNewLine = -1;
        var lastCurlEnd = -1;
        while (stillSearching && currPos <= str.length) {
            var currChar = str.charAt(currPos);
            // console.log("Looking at: " + currPos + currChar);
            if (!ignoreUntil) {
                switch (currChar) {
                    case '{':
                        if (startIndex === -1) {
                            startIndex = currPos;
                            continue;
                        } else
                            curl++;
                        break;
                    case '}':
                        curl--;
                        break;
                    case '"':
                    case '\'':
                        ignoreUntil = currChar;
                        break;
                    case '/':
                        var nextChar = str.charAt(currPos + 1);
                        if (nextChar === '/') {
                            ignoreUntil = '\n';
                        } else if (nextChar === '*') {
                            ignoreUntil = '*/';
                        }
                        break;
                    case '\n':
                        lastNewLine = currPos;
                        break;
                }
            } else {
                if (currChar === ignoreUntil) {
                    ignoreUntil = false;
                }
            }
            if (curl === 0 && startIndex > 0) {
                var block = str.substring(startIndex + 1, currPos - 1);
                var tag = str.substring((lastCurlEnd === -1 ? 0 : lastCurlEnd + 1), startIndex).trim();

                if (block.trim()) {
                    blocks.push({
                        tag: tag,
                        block: block
                    });
                    startIndex = -1;
                }
                lastCurlEnd = currPos;
            }
            currPos++;
        }
        if (curl > 0) {
            throw new Error("Did you miss a curly?");
        }
        return blocks;
    },

    /**
     * Scan raw text for attributes and content before attributes
     * @param  {String} raw Raw content format
     * @return {Array}      Array of attribs and content before attributes
     */
    scanAttribs: function(raw) {
        var str = raw;
        var startIndex = -1;
        var currPos = 0;
        var curl = 0;
        var stillSearching = true;
        var ignoreUntil = false;
        var blocks = [];
        var lastNewLine = -1;
        var lastCurlEnd = -1;
        var firstSquare = -1;
        while (stillSearching && currPos <= str.length) {
            if (!str.length)
                break;
            var currChar = str.charAt(currPos);
            // console.log("Looking at: " + currPos + currChar);
            if (!ignoreUntil) {
                switch (currChar) {
                    case '[':
                        if (startIndex === -1) {
                            startIndex = currPos;
                            if (firstSquare === -1) {
                                firstSquare = currPos;
                            }
                            continue;
                        } else
                            curl++;
                        break;
                    case ']':
                        curl--;
                        break;
                    case '"':
                    case '\'':
                        ignoreUntil = currChar;
                        break;
                    case '/':
                        var nextChar = str.charAt(currPos + 1);
                        if (nextChar === '/') {
                            ignoreUntil = '\n';
                        } else if (nextChar === '*') {
                            ignoreUntil = '*/';
                        }
                        break;
                    case '\n':
                        lastNewLine = currPos;
                        break;
                }
            } else {
                if (currChar === ignoreUntil) {
                    ignoreUntil = false;
                }
            }
            if (curl === 0 && startIndex > 0) {
                var block = str.substring(startIndex + 1, currPos);
                var tag = str.substring((lastCurlEnd === -1 ? 0 : lastCurlEnd + 1), startIndex).trim();

                if (block.trim()) {
                    blocks.push(block);
                    startIndex = -1;
                }
                lastCurlEnd = currPos;
            }
            currPos++;
        }
        if (curl > 0) {
            throw new Error("Did you miss a square bracket?");
        }
        return {
            blocks: blocks,
            meta: str.substring(0, firstSquare)
        }
    },

    /**
     * Get lines from the raw content
     * @return {Array} the lines array
     */
    getLines: function(raw) {
        var pInstance = this;
        var content = raw;

        if (!content.length) {
            return [];
        }

        /**
         * Check which newline 
         */
        //TODO: Improve this to ignore semicolon within strings
        var lines;
        if (content.match(/;/)) {
            lines = content.split(';');
        }
        return lines;
    },

    /**
     * Scan raw text and fetch only the tag
     * @param  {String} raw Raw content format
     * @return {String}     The mined tag
     */
    scanTag: function(raw) {
        //TODO: convert to manual scan
        return raw.match(/^[a-zA-Z0-9_]*/g);
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
    }
}
module.exports = new Scanner();