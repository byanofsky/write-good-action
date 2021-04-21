/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 417:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(478);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 193:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(417);
const file_command_1 = __nccwpck_require__(616);
const utils_1 = __nccwpck_require__(478);
const os = __importStar(__nccwpck_require__(87));
const path = __importStar(__nccwpck_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 616:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(747));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(478);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 478:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 687:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const internal_globber_1 = __nccwpck_require__(174);
/**
 * Constructs a globber
 *
 * @param patterns  Patterns separated by newlines
 * @param options   Glob options
 */
function create(patterns, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield internal_globber_1.DefaultGlobber.create(patterns, options);
    });
}
exports.create = create;
//# sourceMappingURL=glob.js.map

/***/ }),

/***/ 349:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(193));
/**
 * Returns a copy with defaults filled in.
 */
function getOptions(copy) {
    const result = {
        followSymbolicLinks: true,
        implicitDescendants: true,
        omitBrokenSymbolicLinks: true
    };
    if (copy) {
        if (typeof copy.followSymbolicLinks === 'boolean') {
            result.followSymbolicLinks = copy.followSymbolicLinks;
            core.debug(`followSymbolicLinks '${result.followSymbolicLinks}'`);
        }
        if (typeof copy.implicitDescendants === 'boolean') {
            result.implicitDescendants = copy.implicitDescendants;
            core.debug(`implicitDescendants '${result.implicitDescendants}'`);
        }
        if (typeof copy.omitBrokenSymbolicLinks === 'boolean') {
            result.omitBrokenSymbolicLinks = copy.omitBrokenSymbolicLinks;
            core.debug(`omitBrokenSymbolicLinks '${result.omitBrokenSymbolicLinks}'`);
        }
    }
    return result;
}
exports.getOptions = getOptions;
//# sourceMappingURL=internal-glob-options-helper.js.map

/***/ }),

/***/ 174:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(193));
const fs = __importStar(__nccwpck_require__(747));
const globOptionsHelper = __importStar(__nccwpck_require__(349));
const path = __importStar(__nccwpck_require__(622));
const patternHelper = __importStar(__nccwpck_require__(758));
const internal_match_kind_1 = __nccwpck_require__(105);
const internal_pattern_1 = __nccwpck_require__(309);
const internal_search_state_1 = __nccwpck_require__(371);
const IS_WINDOWS = process.platform === 'win32';
class DefaultGlobber {
    constructor(options) {
        this.patterns = [];
        this.searchPaths = [];
        this.options = globOptionsHelper.getOptions(options);
    }
    getSearchPaths() {
        // Return a copy
        return this.searchPaths.slice();
    }
    glob() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            try {
                for (var _b = __asyncValues(this.globGenerator()), _c; _c = yield _b.next(), !_c.done;) {
                    const itemPath = _c.value;
                    result.push(itemPath);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return result;
        });
    }
    globGenerator() {
        return __asyncGenerator(this, arguments, function* globGenerator_1() {
            // Fill in defaults options
            const options = globOptionsHelper.getOptions(this.options);
            // Implicit descendants?
            const patterns = [];
            for (const pattern of this.patterns) {
                patterns.push(pattern);
                if (options.implicitDescendants &&
                    (pattern.trailingSeparator ||
                        pattern.segments[pattern.segments.length - 1] !== '**')) {
                    patterns.push(new internal_pattern_1.Pattern(pattern.negate, pattern.segments.concat('**')));
                }
            }
            // Push the search paths
            const stack = [];
            for (const searchPath of patternHelper.getSearchPaths(patterns)) {
                core.debug(`Search path '${searchPath}'`);
                // Exists?
                try {
                    // Intentionally using lstat. Detection for broken symlink
                    // will be performed later (if following symlinks).
                    yield __await(fs.promises.lstat(searchPath));
                }
                catch (err) {
                    if (err.code === 'ENOENT') {
                        continue;
                    }
                    throw err;
                }
                stack.unshift(new internal_search_state_1.SearchState(searchPath, 1));
            }
            // Search
            const traversalChain = []; // used to detect cycles
            while (stack.length) {
                // Pop
                const item = stack.pop();
                // Match?
                const match = patternHelper.match(patterns, item.path);
                const partialMatch = !!match || patternHelper.partialMatch(patterns, item.path);
                if (!match && !partialMatch) {
                    continue;
                }
                // Stat
                const stats = yield __await(DefaultGlobber.stat(item, options, traversalChain)
                // Broken symlink, or symlink cycle detected, or no longer exists
                );
                // Broken symlink, or symlink cycle detected, or no longer exists
                if (!stats) {
                    continue;
                }
                // Directory
                if (stats.isDirectory()) {
                    // Matched
                    if (match & internal_match_kind_1.MatchKind.Directory) {
                        yield yield __await(item.path);
                    }
                    // Descend?
                    else if (!partialMatch) {
                        continue;
                    }
                    // Push the child items in reverse
                    const childLevel = item.level + 1;
                    const childItems = (yield __await(fs.promises.readdir(item.path))).map(x => new internal_search_state_1.SearchState(path.join(item.path, x), childLevel));
                    stack.push(...childItems.reverse());
                }
                // File
                else if (match & internal_match_kind_1.MatchKind.File) {
                    yield yield __await(item.path);
                }
            }
        });
    }
    /**
     * Constructs a DefaultGlobber
     */
    static create(patterns, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = new DefaultGlobber(options);
            if (IS_WINDOWS) {
                patterns = patterns.replace(/\r\n/g, '\n');
                patterns = patterns.replace(/\r/g, '\n');
            }
            const lines = patterns.split('\n').map(x => x.trim());
            for (const line of lines) {
                // Empty or comment
                if (!line || line.startsWith('#')) {
                    continue;
                }
                // Pattern
                else {
                    result.patterns.push(new internal_pattern_1.Pattern(line));
                }
            }
            result.searchPaths.push(...patternHelper.getSearchPaths(result.patterns));
            return result;
        });
    }
    static stat(item, options, traversalChain) {
        return __awaiter(this, void 0, void 0, function* () {
            // Note:
            // `stat` returns info about the target of a symlink (or symlink chain)
            // `lstat` returns info about a symlink itself
            let stats;
            if (options.followSymbolicLinks) {
                try {
                    // Use `stat` (following symlinks)
                    stats = yield fs.promises.stat(item.path);
                }
                catch (err) {
                    if (err.code === 'ENOENT') {
                        if (options.omitBrokenSymbolicLinks) {
                            core.debug(`Broken symlink '${item.path}'`);
                            return undefined;
                        }
                        throw new Error(`No information found for the path '${item.path}'. This may indicate a broken symbolic link.`);
                    }
                    throw err;
                }
            }
            else {
                // Use `lstat` (not following symlinks)
                stats = yield fs.promises.lstat(item.path);
            }
            // Note, isDirectory() returns false for the lstat of a symlink
            if (stats.isDirectory() && options.followSymbolicLinks) {
                // Get the realpath
                const realPath = yield fs.promises.realpath(item.path);
                // Fixup the traversal chain to match the item level
                while (traversalChain.length >= item.level) {
                    traversalChain.pop();
                }
                // Test for a cycle
                if (traversalChain.some((x) => x === realPath)) {
                    core.debug(`Symlink cycle detected for path '${item.path}' and realpath '${realPath}'`);
                    return undefined;
                }
                // Update the traversal chain
                traversalChain.push(realPath);
            }
            return stats;
        });
    }
}
exports.DefaultGlobber = DefaultGlobber;
//# sourceMappingURL=internal-globber.js.map

/***/ }),

/***/ 105:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Indicates whether a pattern matches a path
 */
var MatchKind;
(function (MatchKind) {
    /** Not matched */
    MatchKind[MatchKind["None"] = 0] = "None";
    /** Matched if the path is a directory */
    MatchKind[MatchKind["Directory"] = 1] = "Directory";
    /** Matched if the path is a regular file */
    MatchKind[MatchKind["File"] = 2] = "File";
    /** Matched */
    MatchKind[MatchKind["All"] = 3] = "All";
})(MatchKind = exports.MatchKind || (exports.MatchKind = {}));
//# sourceMappingURL=internal-match-kind.js.map

/***/ }),

/***/ 20:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const path = __importStar(__nccwpck_require__(622));
const assert_1 = __importDefault(__nccwpck_require__(357));
const IS_WINDOWS = process.platform === 'win32';
/**
 * Similar to path.dirname except normalizes the path separators and slightly better handling for Windows UNC paths.
 *
 * For example, on Linux/macOS:
 * - `/               => /`
 * - `/hello          => /`
 *
 * For example, on Windows:
 * - `C:\             => C:\`
 * - `C:\hello        => C:\`
 * - `C:              => C:`
 * - `C:hello         => C:`
 * - `\               => \`
 * - `\hello          => \`
 * - `\\hello         => \\hello`
 * - `\\hello\world   => \\hello\world`
 */
function dirname(p) {
    // Normalize slashes and trim unnecessary trailing slash
    p = safeTrimTrailingSeparator(p);
    // Windows UNC root, e.g. \\hello or \\hello\world
    if (IS_WINDOWS && /^\\\\[^\\]+(\\[^\\]+)?$/.test(p)) {
        return p;
    }
    // Get dirname
    let result = path.dirname(p);
    // Trim trailing slash for Windows UNC root, e.g. \\hello\world\
    if (IS_WINDOWS && /^\\\\[^\\]+\\[^\\]+\\$/.test(result)) {
        result = safeTrimTrailingSeparator(result);
    }
    return result;
}
exports.dirname = dirname;
/**
 * Roots the path if not already rooted. On Windows, relative roots like `\`
 * or `C:` are expanded based on the current working directory.
 */
function ensureAbsoluteRoot(root, itemPath) {
    assert_1.default(root, `ensureAbsoluteRoot parameter 'root' must not be empty`);
    assert_1.default(itemPath, `ensureAbsoluteRoot parameter 'itemPath' must not be empty`);
    // Already rooted
    if (hasAbsoluteRoot(itemPath)) {
        return itemPath;
    }
    // Windows
    if (IS_WINDOWS) {
        // Check for itemPath like C: or C:foo
        if (itemPath.match(/^[A-Z]:[^\\/]|^[A-Z]:$/i)) {
            let cwd = process.cwd();
            assert_1.default(cwd.match(/^[A-Z]:\\/i), `Expected current directory to start with an absolute drive root. Actual '${cwd}'`);
            // Drive letter matches cwd? Expand to cwd
            if (itemPath[0].toUpperCase() === cwd[0].toUpperCase()) {
                // Drive only, e.g. C:
                if (itemPath.length === 2) {
                    // Preserve specified drive letter case (upper or lower)
                    return `${itemPath[0]}:\\${cwd.substr(3)}`;
                }
                // Drive + path, e.g. C:foo
                else {
                    if (!cwd.endsWith('\\')) {
                        cwd += '\\';
                    }
                    // Preserve specified drive letter case (upper or lower)
                    return `${itemPath[0]}:\\${cwd.substr(3)}${itemPath.substr(2)}`;
                }
            }
            // Different drive
            else {
                return `${itemPath[0]}:\\${itemPath.substr(2)}`;
            }
        }
        // Check for itemPath like \ or \foo
        else if (normalizeSeparators(itemPath).match(/^\\$|^\\[^\\]/)) {
            const cwd = process.cwd();
            assert_1.default(cwd.match(/^[A-Z]:\\/i), `Expected current directory to start with an absolute drive root. Actual '${cwd}'`);
            return `${cwd[0]}:\\${itemPath.substr(1)}`;
        }
    }
    assert_1.default(hasAbsoluteRoot(root), `ensureAbsoluteRoot parameter 'root' must have an absolute root`);
    // Otherwise ensure root ends with a separator
    if (root.endsWith('/') || (IS_WINDOWS && root.endsWith('\\'))) {
        // Intentionally empty
    }
    else {
        // Append separator
        root += path.sep;
    }
    return root + itemPath;
}
exports.ensureAbsoluteRoot = ensureAbsoluteRoot;
/**
 * On Linux/macOS, true if path starts with `/`. On Windows, true for paths like:
 * `\\hello\share` and `C:\hello` (and using alternate separator).
 */
function hasAbsoluteRoot(itemPath) {
    assert_1.default(itemPath, `hasAbsoluteRoot parameter 'itemPath' must not be empty`);
    // Normalize separators
    itemPath = normalizeSeparators(itemPath);
    // Windows
    if (IS_WINDOWS) {
        // E.g. \\hello\share or C:\hello
        return itemPath.startsWith('\\\\') || /^[A-Z]:\\/i.test(itemPath);
    }
    // E.g. /hello
    return itemPath.startsWith('/');
}
exports.hasAbsoluteRoot = hasAbsoluteRoot;
/**
 * On Linux/macOS, true if path starts with `/`. On Windows, true for paths like:
 * `\`, `\hello`, `\\hello\share`, `C:`, and `C:\hello` (and using alternate separator).
 */
function hasRoot(itemPath) {
    assert_1.default(itemPath, `isRooted parameter 'itemPath' must not be empty`);
    // Normalize separators
    itemPath = normalizeSeparators(itemPath);
    // Windows
    if (IS_WINDOWS) {
        // E.g. \ or \hello or \\hello
        // E.g. C: or C:\hello
        return itemPath.startsWith('\\') || /^[A-Z]:/i.test(itemPath);
    }
    // E.g. /hello
    return itemPath.startsWith('/');
}
exports.hasRoot = hasRoot;
/**
 * Removes redundant slashes and converts `/` to `\` on Windows
 */
function normalizeSeparators(p) {
    p = p || '';
    // Windows
    if (IS_WINDOWS) {
        // Convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // Remove redundant slashes
        const isUnc = /^\\\\+[^\\]/.test(p); // e.g. \\hello
        return (isUnc ? '\\' : '') + p.replace(/\\\\+/g, '\\'); // preserve leading \\ for UNC
    }
    // Remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
exports.normalizeSeparators = normalizeSeparators;
/**
 * Normalizes the path separators and trims the trailing separator (when safe).
 * For example, `/foo/ => /foo` but `/ => /`
 */
function safeTrimTrailingSeparator(p) {
    // Short-circuit if empty
    if (!p) {
        return '';
    }
    // Normalize separators
    p = normalizeSeparators(p);
    // No trailing slash
    if (!p.endsWith(path.sep)) {
        return p;
    }
    // Check '/' on Linux/macOS and '\' on Windows
    if (p === path.sep) {
        return p;
    }
    // On Windows check if drive root. E.g. C:\
    if (IS_WINDOWS && /^[A-Z]:\\$/i.test(p)) {
        return p;
    }
    // Otherwise trim trailing slash
    return p.substr(0, p.length - 1);
}
exports.safeTrimTrailingSeparator = safeTrimTrailingSeparator;
//# sourceMappingURL=internal-path-helper.js.map

/***/ }),

/***/ 845:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const path = __importStar(__nccwpck_require__(622));
const pathHelper = __importStar(__nccwpck_require__(20));
const assert_1 = __importDefault(__nccwpck_require__(357));
const IS_WINDOWS = process.platform === 'win32';
/**
 * Helper class for parsing paths into segments
 */
class Path {
    /**
     * Constructs a Path
     * @param itemPath Path or array of segments
     */
    constructor(itemPath) {
        this.segments = [];
        // String
        if (typeof itemPath === 'string') {
            assert_1.default(itemPath, `Parameter 'itemPath' must not be empty`);
            // Normalize slashes and trim unnecessary trailing slash
            itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
            // Not rooted
            if (!pathHelper.hasRoot(itemPath)) {
                this.segments = itemPath.split(path.sep);
            }
            // Rooted
            else {
                // Add all segments, while not at the root
                let remaining = itemPath;
                let dir = pathHelper.dirname(remaining);
                while (dir !== remaining) {
                    // Add the segment
                    const basename = path.basename(remaining);
                    this.segments.unshift(basename);
                    // Truncate the last segment
                    remaining = dir;
                    dir = pathHelper.dirname(remaining);
                }
                // Remainder is the root
                this.segments.unshift(remaining);
            }
        }
        // Array
        else {
            // Must not be empty
            assert_1.default(itemPath.length > 0, `Parameter 'itemPath' must not be an empty array`);
            // Each segment
            for (let i = 0; i < itemPath.length; i++) {
                let segment = itemPath[i];
                // Must not be empty
                assert_1.default(segment, `Parameter 'itemPath' must not contain any empty segments`);
                // Normalize slashes
                segment = pathHelper.normalizeSeparators(itemPath[i]);
                // Root segment
                if (i === 0 && pathHelper.hasRoot(segment)) {
                    segment = pathHelper.safeTrimTrailingSeparator(segment);
                    assert_1.default(segment === pathHelper.dirname(segment), `Parameter 'itemPath' root segment contains information for multiple segments`);
                    this.segments.push(segment);
                }
                // All other segments
                else {
                    // Must not contain slash
                    assert_1.default(!segment.includes(path.sep), `Parameter 'itemPath' contains unexpected path separators`);
                    this.segments.push(segment);
                }
            }
        }
    }
    /**
     * Converts the path to it's string representation
     */
    toString() {
        // First segment
        let result = this.segments[0];
        // All others
        let skipSlash = result.endsWith(path.sep) || (IS_WINDOWS && /^[A-Z]:$/i.test(result));
        for (let i = 1; i < this.segments.length; i++) {
            if (skipSlash) {
                skipSlash = false;
            }
            else {
                result += path.sep;
            }
            result += this.segments[i];
        }
        return result;
    }
}
exports.Path = Path;
//# sourceMappingURL=internal-path.js.map

/***/ }),

/***/ 758:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const pathHelper = __importStar(__nccwpck_require__(20));
const internal_match_kind_1 = __nccwpck_require__(105);
const IS_WINDOWS = process.platform === 'win32';
/**
 * Given an array of patterns, returns an array of paths to search.
 * Duplicates and paths under other included paths are filtered out.
 */
function getSearchPaths(patterns) {
    // Ignore negate patterns
    patterns = patterns.filter(x => !x.negate);
    // Create a map of all search paths
    const searchPathMap = {};
    for (const pattern of patterns) {
        const key = IS_WINDOWS
            ? pattern.searchPath.toUpperCase()
            : pattern.searchPath;
        searchPathMap[key] = 'candidate';
    }
    const result = [];
    for (const pattern of patterns) {
        // Check if already included
        const key = IS_WINDOWS
            ? pattern.searchPath.toUpperCase()
            : pattern.searchPath;
        if (searchPathMap[key] === 'included') {
            continue;
        }
        // Check for an ancestor search path
        let foundAncestor = false;
        let tempKey = key;
        let parent = pathHelper.dirname(tempKey);
        while (parent !== tempKey) {
            if (searchPathMap[parent]) {
                foundAncestor = true;
                break;
            }
            tempKey = parent;
            parent = pathHelper.dirname(tempKey);
        }
        // Include the search pattern in the result
        if (!foundAncestor) {
            result.push(pattern.searchPath);
            searchPathMap[key] = 'included';
        }
    }
    return result;
}
exports.getSearchPaths = getSearchPaths;
/**
 * Matches the patterns against the path
 */
function match(patterns, itemPath) {
    let result = internal_match_kind_1.MatchKind.None;
    for (const pattern of patterns) {
        if (pattern.negate) {
            result &= ~pattern.match(itemPath);
        }
        else {
            result |= pattern.match(itemPath);
        }
    }
    return result;
}
exports.match = match;
/**
 * Checks whether to descend further into the directory
 */
function partialMatch(patterns, itemPath) {
    return patterns.some(x => !x.negate && x.partialMatch(itemPath));
}
exports.partialMatch = partialMatch;
//# sourceMappingURL=internal-pattern-helper.js.map

/***/ }),

/***/ 309:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(87));
const path = __importStar(__nccwpck_require__(622));
const pathHelper = __importStar(__nccwpck_require__(20));
const assert_1 = __importDefault(__nccwpck_require__(357));
const minimatch_1 = __nccwpck_require__(297);
const internal_match_kind_1 = __nccwpck_require__(105);
const internal_path_1 = __nccwpck_require__(845);
const IS_WINDOWS = process.platform === 'win32';
class Pattern {
    constructor(patternOrNegate, segments, homedir) {
        /**
         * Indicates whether matches should be excluded from the result set
         */
        this.negate = false;
        // Pattern overload
        let pattern;
        if (typeof patternOrNegate === 'string') {
            pattern = patternOrNegate.trim();
        }
        // Segments overload
        else {
            // Convert to pattern
            segments = segments || [];
            assert_1.default(segments.length, `Parameter 'segments' must not empty`);
            const root = Pattern.getLiteral(segments[0]);
            assert_1.default(root && pathHelper.hasAbsoluteRoot(root), `Parameter 'segments' first element must be a root path`);
            pattern = new internal_path_1.Path(segments).toString().trim();
            if (patternOrNegate) {
                pattern = `!${pattern}`;
            }
        }
        // Negate
        while (pattern.startsWith('!')) {
            this.negate = !this.negate;
            pattern = pattern.substr(1).trim();
        }
        // Normalize slashes and ensures absolute root
        pattern = Pattern.fixupPattern(pattern, homedir);
        // Segments
        this.segments = new internal_path_1.Path(pattern).segments;
        // Trailing slash indicates the pattern should only match directories, not regular files
        this.trailingSeparator = pathHelper
            .normalizeSeparators(pattern)
            .endsWith(path.sep);
        pattern = pathHelper.safeTrimTrailingSeparator(pattern);
        // Search path (literal path prior to the first glob segment)
        let foundGlob = false;
        const searchSegments = this.segments
            .map(x => Pattern.getLiteral(x))
            .filter(x => !foundGlob && !(foundGlob = x === ''));
        this.searchPath = new internal_path_1.Path(searchSegments).toString();
        // Root RegExp (required when determining partial match)
        this.rootRegExp = new RegExp(Pattern.regExpEscape(searchSegments[0]), IS_WINDOWS ? 'i' : '');
        // Create minimatch
        const minimatchOptions = {
            dot: true,
            nobrace: true,
            nocase: IS_WINDOWS,
            nocomment: true,
            noext: true,
            nonegate: true
        };
        pattern = IS_WINDOWS ? pattern.replace(/\\/g, '/') : pattern;
        this.minimatch = new minimatch_1.Minimatch(pattern, minimatchOptions);
    }
    /**
     * Matches the pattern against the specified path
     */
    match(itemPath) {
        // Last segment is globstar?
        if (this.segments[this.segments.length - 1] === '**') {
            // Normalize slashes
            itemPath = pathHelper.normalizeSeparators(itemPath);
            // Append a trailing slash. Otherwise Minimatch will not match the directory immediately
            // preceding the globstar. For example, given the pattern `/foo/**`, Minimatch returns
            // false for `/foo` but returns true for `/foo/`. Append a trailing slash to handle that quirk.
            if (!itemPath.endsWith(path.sep)) {
                // Note, this is safe because the constructor ensures the pattern has an absolute root.
                // For example, formats like C: and C:foo on Windows are resolved to an absolute root.
                itemPath = `${itemPath}${path.sep}`;
            }
        }
        else {
            // Normalize slashes and trim unnecessary trailing slash
            itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
        }
        // Match
        if (this.minimatch.match(itemPath)) {
            return this.trailingSeparator ? internal_match_kind_1.MatchKind.Directory : internal_match_kind_1.MatchKind.All;
        }
        return internal_match_kind_1.MatchKind.None;
    }
    /**
     * Indicates whether the pattern may match descendants of the specified path
     */
    partialMatch(itemPath) {
        // Normalize slashes and trim unnecessary trailing slash
        itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
        // matchOne does not handle root path correctly
        if (pathHelper.dirname(itemPath) === itemPath) {
            return this.rootRegExp.test(itemPath);
        }
        return this.minimatch.matchOne(itemPath.split(IS_WINDOWS ? /\\+/ : /\/+/), this.minimatch.set[0], true);
    }
    /**
     * Escapes glob patterns within a path
     */
    static globEscape(s) {
        return (IS_WINDOWS ? s : s.replace(/\\/g, '\\\\')) // escape '\' on Linux/macOS
            .replace(/(\[)(?=[^/]+\])/g, '[[]') // escape '[' when ']' follows within the path segment
            .replace(/\?/g, '[?]') // escape '?'
            .replace(/\*/g, '[*]'); // escape '*'
    }
    /**
     * Normalizes slashes and ensures absolute root
     */
    static fixupPattern(pattern, homedir) {
        // Empty
        assert_1.default(pattern, 'pattern cannot be empty');
        // Must not contain `.` segment, unless first segment
        // Must not contain `..` segment
        const literalSegments = new internal_path_1.Path(pattern).segments.map(x => Pattern.getLiteral(x));
        assert_1.default(literalSegments.every((x, i) => (x !== '.' || i === 0) && x !== '..'), `Invalid pattern '${pattern}'. Relative pathing '.' and '..' is not allowed.`);
        // Must not contain globs in root, e.g. Windows UNC path \\foo\b*r
        assert_1.default(!pathHelper.hasRoot(pattern) || literalSegments[0], `Invalid pattern '${pattern}'. Root segment must not contain globs.`);
        // Normalize slashes
        pattern = pathHelper.normalizeSeparators(pattern);
        // Replace leading `.` segment
        if (pattern === '.' || pattern.startsWith(`.${path.sep}`)) {
            pattern = Pattern.globEscape(process.cwd()) + pattern.substr(1);
        }
        // Replace leading `~` segment
        else if (pattern === '~' || pattern.startsWith(`~${path.sep}`)) {
            homedir = homedir || os.homedir();
            assert_1.default(homedir, 'Unable to determine HOME directory');
            assert_1.default(pathHelper.hasAbsoluteRoot(homedir), `Expected HOME directory to be a rooted path. Actual '${homedir}'`);
            pattern = Pattern.globEscape(homedir) + pattern.substr(1);
        }
        // Replace relative drive root, e.g. pattern is C: or C:foo
        else if (IS_WINDOWS &&
            (pattern.match(/^[A-Z]:$/i) || pattern.match(/^[A-Z]:[^\\]/i))) {
            let root = pathHelper.ensureAbsoluteRoot('C:\\dummy-root', pattern.substr(0, 2));
            if (pattern.length > 2 && !root.endsWith('\\')) {
                root += '\\';
            }
            pattern = Pattern.globEscape(root) + pattern.substr(2);
        }
        // Replace relative root, e.g. pattern is \ or \foo
        else if (IS_WINDOWS && (pattern === '\\' || pattern.match(/^\\[^\\]/))) {
            let root = pathHelper.ensureAbsoluteRoot('C:\\dummy-root', '\\');
            if (!root.endsWith('\\')) {
                root += '\\';
            }
            pattern = Pattern.globEscape(root) + pattern.substr(1);
        }
        // Otherwise ensure absolute root
        else {
            pattern = pathHelper.ensureAbsoluteRoot(Pattern.globEscape(process.cwd()), pattern);
        }
        return pathHelper.normalizeSeparators(pattern);
    }
    /**
     * Attempts to unescape a pattern segment to create a literal path segment.
     * Otherwise returns empty string.
     */
    static getLiteral(segment) {
        let literal = '';
        for (let i = 0; i < segment.length; i++) {
            const c = segment[i];
            // Escape
            if (c === '\\' && !IS_WINDOWS && i + 1 < segment.length) {
                literal += segment[++i];
                continue;
            }
            // Wildcard
            else if (c === '*' || c === '?') {
                return '';
            }
            // Character set
            else if (c === '[' && i + 1 < segment.length) {
                let set = '';
                let closed = -1;
                for (let i2 = i + 1; i2 < segment.length; i2++) {
                    const c2 = segment[i2];
                    // Escape
                    if (c2 === '\\' && !IS_WINDOWS && i2 + 1 < segment.length) {
                        set += segment[++i2];
                        continue;
                    }
                    // Closed
                    else if (c2 === ']') {
                        closed = i2;
                        break;
                    }
                    // Otherwise
                    else {
                        set += c2;
                    }
                }
                // Closed?
                if (closed >= 0) {
                    // Cannot convert
                    if (set.length > 1) {
                        return '';
                    }
                    // Convert to literal
                    if (set) {
                        literal += set;
                        i = closed;
                        continue;
                    }
                }
                // Otherwise fall thru
            }
            // Append
            literal += c;
        }
        return literal;
    }
    /**
     * Escapes regexp special characters
     * https://javascript.info/regexp-escaping
     */
    static regExpEscape(s) {
        return s.replace(/[[\\^$.|?*+()]/g, '\\$&');
    }
}
exports.Pattern = Pattern;
//# sourceMappingURL=internal-pattern.js.map

/***/ }),

/***/ 371:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class SearchState {
    constructor(path, level) {
        this.path = path;
        this.level = level;
    }
}
exports.SearchState = SearchState;
//# sourceMappingURL=internal-search-state.js.map

/***/ }),

/***/ 67:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const adverbs = [
  'absolutel',
  'accidentall',
  'additionall',
  'allegedl',
  'alternativel',
  'angril',
  'anxiousl',
  'approximatel',
  'awkwardl',
  'badl',
  'barel',
  'beautifull',
  'blindl',
  'boldl',
  'bravel',
  'brightl',
  'briskl',
  'bristl',
  'bubbl',
  'busil',
  'calml',
  'carefull',
  'carelessl',
  'cautiousl',
  'cheerfull',
  'clearl',
  'closel',
  'coldl',
  'completel',
  'consequentl',
  'correctl',
  'courageousl',
  'crinkl',
  'cruell',
  'crumbl',
  'cuddl',
  'currentl',
  'daringl',
  'deadl',
  'definitel',
  'deliberatel',
  'doubtfull',
  'dumbl',
  'eagerl',
  'earl',
  'easil',
  'elegantl',
  'enormousl',
  'enthusiasticall',
  'equall',
  'especiall',
  'eventuall',
  'exactl',
  'exceedingl',
  'exclusivel',
  'extremel',
  'fairl',
  'faithfull',
  'fatall',
  'fiercel',
  'finall',
  'fondl',
  'foolishl',
  'fortunatel',
  'frankl',
  'franticall',
  'generousl',
  'gentl',
  'giggl',
  'gladl',
  'gracefull',
  'greedil',
  'happil',
  'hardl',
  'hastil',
  'healthil',
  'heartil',
  'helpfull',
  'honestl',
  'hourl',
  'hungril',
  'hurriedl',
  'immediatel',
  'impatientl',
  'inadequatel',
  'ingeniousl',
  'innocentl',
  'inquisitivel',
  'interestingl',
  'irritabl',
  'jiggl',
  'joyousl',
  'justl',
  'kindl',
  'largel',
  'latel',
  'lazil',
  'likel',
  'literall',
  'lonel',
  'loosel',
  'loudl',
  'loudl',
  'luckil',
  'madl',
  'man',
  'mentall',
  'mildl',
  'mortall',
  'mostl',
  'mysteriousl',
  'neatl',
  'nervousl',
  'noisil',
  'normall',
  'obedientl',
  'occasionall',
  'onl',
  'openl',
  'painfull',
  'particularl',
  'patientl',
  'perfectl',
  'politel',
  'poorl',
  'powerfull',
  'presumabl',
  'previousl',
  'promptl',
  'punctuall',
  'quarterl',
  'quickl',
  'quietl',
  'rapidl',
  'rarel',
  'reall',
  'recentl',
  'recklessl',
  'regularl',
  'relativel',
  'reluctantl',
  'remarkabl',
  'repeatedl',
  'rightfull',
  'roughl',
  'rudel',
  'sadl',
  'safel',
  'selfishl',
  'sensibl',
  'seriousl',
  'sharpl',
  'shortl',
  'shyl',
  'significantl',
  'silentl',
  'simpl',
  'sleepil',
  'slowl',
  'smartl',
  'smell',
  'smoothl',
  'softl',
  'solemnl',
  'sparkl',
  'speedil',
  'stealthil',
  'sternl',
  'stupidl',
  'substantiall',
  'successfull',
  'suddenl',
  'surprisingl',
  'suspiciousl',
  'swiftl',
  'tenderl',
  'tensel',
  'thoughtfull',
  'tightl',
  'timel',
  'truthfull',
  'unexpectedl',
  'unfortunatel',
  'usuall',
  'ver',
  'victoriousl',
  'violentl',
  'vivaciousl',
  'warml',
  'waverl',
  'weakl',
  'wearil',
  'wildl',
  'wisel',
  'worldl',
  'wrinkl'
];

const weakens = [
  'just',
  'maybe',
  'stuff',
  'things'
];

const adverbRegex = new RegExp(
  `${'\\b('
  + '('}${adverbs.join('|')})(y)`
  + `|(${weakens.join('|')}))\\b`, 'gi'
);
const matcher = __nccwpck_require__(146);

module.exports = function matchAdverbs(text) {
  return matcher(adverbRegex, text);
};


/***/ }),

/***/ 146:
/***/ ((module) => {

function matcher(regex, text) {
  const results = [];
  let result = regex.exec(text);

  while (result) {
    results.push({ index: result.index, offset: result[0].length });
    result = regex.exec(text);
  }

  return results;
}

module.exports = matcher;


/***/ }),

/***/ 927:
/***/ ((module) => {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    if(a===b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ 761:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var concatMap = __nccwpck_require__(126);
var balanced = __nccwpck_require__(927);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),

/***/ 126:
/***/ ((module) => {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 939:
/***/ ((module) => {

var toBe = [
    'am',
    'are',
    'aren\'t',
    'be',
    'been',
    'being',
    'he\'s',
    'here\'s',
    'here\'s',
    'how\'s',
    'i\'m',
    'is',
    'isn\'t',
    'it\'s',
    'she\'s',
    'that\'s',
    'there\'s',
    'they\'re',
    'was',
    'wasn\'t',
    'we\'re',
    'were',
    'weren\'t',
    'what\'s',
    'where\'s',
    'who\'s',
    'you\'re'
];

var re = new RegExp('\\b(' + toBe.join('|') + ')\\b', 'gi');

module.exports = function (text) {
    var suggestions = [];
    if (!text || text.length === 0) return suggestions;
    text = text.replace(/[\u2018\u2019]/g, "'"); // convert smart quotes
    while (match = re.exec(text)) {
        var be = match[0].toLowerCase();
        suggestions.push({
            index: match.index,
            offset: be.length
        });
    }

    return suggestions;
};

/***/ }),

/***/ 297:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = { sep: '/' }
try {
  path = __nccwpck_require__(622)
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __nccwpck_require__(761)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === '') return p === ''

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern')
  }

  if (options.nobrace ||
    !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long')
  }

  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === '**') return GLOBSTAR
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i)
          try {
            RegExp('[' + cs + ']')
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE)
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
            hasMagic = hasMagic || sp[1]
            inClass = false
            continue
          }
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),

/***/ 739:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

let cliches = [
  'a chip off the old block',
  'a clean slate',
  'a dark and stormy night',
  'a far cry',
  'a fine kettle of fish',
  'a loose cannon',
  'a penny saved is a penny earned',
  'a tough row to hoe',
  'a word to the wise',
  'ace in the hole',
  'acid test',
  'add insult to injury',
  'against all odds',
  'air your dirty laundry',
  'all fun and games',
  'all in a day\'s work',
  'all talk, no action',
  'all thumbs',
  'all your eggs in one basket',
  'all\'s fair in love and war',
  'all\'s well that ends well',
  'almighty dollar',
  'American as apple pie',
  'an axe to grind',
  'another day, another dollar',
  'armed to the teeth',
  'as luck would have it',
  'as old as time',
  'as the crow flies',
  'at loose ends',
  'at my wits end',
  'avoid like the plague',
  'babe in the woods',
  'back against the wall',
  'back in the saddle',
  'back to square one',
  'back to the drawing board',
  'bad to the bone',
  'badge of honor',
  'bald faced liar',
  'ballpark figure',
  'banging your head against a brick wall',
  'baptism by fire',
  'barking up the wrong tree',
  'bat out of hell',
  'be all and end all',
  'beat a dead horse',
  'beat around the bush',
  'been there, done that',
  'beggars can\'t be choosers',
  'behind the eight ball',
  'bend over backwards',
  'benefit of the doubt',
  'bent out of shape',
  'best thing since sliced bread',
  'bet your bottom dollar',
  'better half',
  'better late than never',
  'better mousetrap',
  'better safe than sorry',
  'between a rock and a hard place',
  'beyond the pale',
  'bide your time',
  'big as life',
  'big cheese',
  'big fish in a small pond',
  'big man on campus',
  'bigger they are the harder they fall',
  'bird in the hand',
  'bird\'s eye view',
  'birds and the bees',
  'birds of a feather flock together',
  'bit the hand that feeds you',
  'bite the bullet',
  'bite the dust',
  'bitten off more than he can chew',
  'black as coal',
  'black as pitch',
  'black as the ace of spades',
  'blast from the past',
  'bleeding heart',
  'blessing in disguise',
  'blind ambition',
  'blind as a bat',
  'blind leading the blind',
  'blood is thicker than water',
  'blood sweat and tears',
  'blow off steam',
  'blow your own horn',
  'blushing bride',
  'boils down to',
  'bolt from the blue',
  'bone to pick',
  'bored stiff',
  'bored to tears',
  'bottomless pit',
  'boys will be boys',
  'bright and early',
  'brings home the bacon',
  'broad across the beam',
  'broken record',
  'brought back to reality',
  'bull by the horns',
  'bull in a china shop',
  'burn the midnight oil',
  'burning question',
  'burning the candle at both ends',
  'burst your bubble',
  'bury the hatchet',
  'busy as a bee',
  'by hook or by crook',
  'call a spade a spade',
  'called onto the carpet',
  'calm before the storm',
  'can of worms',
  'can\'t cut the mustard',
  'can\'t hold a candle to',
  'case of mistaken identity',
  'cat got your tongue',
  'cat\'s meow',
  'caught in the crossfire',
  'caught red-handed',
  'checkered past',
  'chomping at the bit',
  'cleanliness is next to godliness',
  'clear as a bell',
  'clear as mud',
  'close to the vest',
  'cock and bull story',
  'cold shoulder',
  'come hell or high water',
  'cool as a cucumber',
  'cool, calm, and collected',
  'cost a king\'s ransom',
  'count your blessings',
  'crack of dawn',
  'crash course',
  'creature comforts',
  'cross that bridge when you come to it',
  'crushing blow',
  'cry like a baby',
  'cry me a river',
  'cry over spilt milk',
  'crystal clear',
  'curiosity killed the cat',
  'cut and dried',
  'cut through the red tape',
  'cut to the chase',
  'cute as a bugs ear',
  'cute as a button',
  'cute as a puppy',
  'cuts to the quick',
  'dark before the dawn',
  'day in, day out',
  'dead as a doornail',
  'devil is in the details',
  'dime a dozen',
  'divide and conquer',
  'dog and pony show',
  'dog days',
  'dog eat dog',
  'dog tired',
  'don\'t burn your bridges',
  'don\'t count your chickens',
  'don\'t look a gift horse in the mouth',
  'don\'t rock the boat',
  'don\'t step on anyone\'s toes',
  'don\'t take any wooden nickels',
  'down and out',
  'down at the heels',
  'down in the dumps',
  'down the hatch',
  'down to earth',
  'draw the line',
  'dressed to kill',
  'dressed to the nines',
  'drives me up the wall',
  'dull as dishwater',
  'dyed in the wool',
  'eagle eye',
  'ear to the ground',
  'early bird catches the worm',
  'easier said than done',
  'easy as pie',
  'eat your heart out',
  'eat your words',
  'eleventh hour',
  'even the playing field',
  'every dog has its day',
  'every fiber of my being',
  'everything but the kitchen sink',
  'eye for an eye',
  'face the music',
  'facts of life',
  'fair weather friend',
  'fall by the wayside',
  'fan the flames',
  'feast or famine',
  'feather your nest',
  'feathered friends',
  'few and far between',
  'fifteen minutes of fame',
  'filthy vermin',
  'fine kettle of fish',
  'fish out of water',
  'fishing for a compliment',
  'fit as a fiddle',
  'fit the bill',
  'fit to be tied',
  'flash in the pan',
  'flat as a pancake',
  'flip your lid',
  'flog a dead horse',
  'fly by night',
  'fly the coop',
  'follow your heart',
  'for all intents and purposes',
  'for the birds',
  'for what it\'s worth',
  'force of nature',
  'force to be reckoned with',
  'forgive and forget',
  'fox in the henhouse',
  'free and easy',
  'free as a bird',
  'fresh as a daisy',
  'full steam ahead',
  'fun in the sun',
  'garbage in, garbage out',
  'gentle as a lamb',
  'get a kick out of',
  'get a leg up',
  'get down and dirty',
  'get the lead out',
  'get to the bottom of',
  'get your feet wet',
  'gets my goat',
  'gilding the lily',
  'give and take',
  'go against the grain',
  'go at it tooth and nail',
  'go for broke',
  'go him one better',
  'go the extra mile',
  'go with the flow',
  'goes without saying',
  'good as gold',
  'good deed for the day',
  'good things come to those who wait',
  'good time was had by all',
  'good times were had by all',
  'greased lightning',
  'greek to me',
  'green thumb',
  'green-eyed monster',
  'grist for the mill',
  'growing like a weed',
  'hair of the dog',
  'hand to mouth',
  'happy as a clam',
  'happy as a lark',
  'hasn\'t a clue',
  'have a nice day',
  'have high hopes',
  'have the last laugh',
  'haven\'t got a row to hoe',
  'head honcho',
  'head over heels',
  'hear a pin drop',
  'heard it through the grapevine',
  'heart\'s content',
  'heavy as lead',
  'hem and haw',
  'high and dry',
  'high and mighty',
  'high as a kite',
  'hit paydirt',
  'hold your head up high',
  'hold your horses',
  'hold your own',
  'hold your tongue',
  'honest as the day is long',
  'horns of a dilemma',
  'horse of a different color',
  'hot under the collar',
  'hour of need',
  'I beg to differ',
  'icing on the cake',
  'if the shoe fits',
  'if the shoe were on the other foot',
  'in a jam',
  'in a jiffy',
  'in a nutshell',
  'in a pig\'s eye',
  'in a pinch',
  'in a word',
  'in hot water',
  'in the gutter',
  'in the nick of time',
  'in the thick of it',
  'in your dreams',
  'it ain\'t over till the fat lady sings',
  'it goes without saying',
  'it takes all kinds',
  'it takes one to know one',
  'it\'s a small world',
  'it\'s only a matter of time',
  'ivory tower',
  'Jack of all trades',
  'jockey for position',
  'jog your memory',
  'joined at the hip',
  'judge a book by its cover',
  'jump down your throat',
  'jump in with both feet',
  'jump on the bandwagon',
  'jump the gun',
  'jump to conclusions',
  'just a hop, skip, and a jump',
  'just the ticket',
  'justice is blind',
  'keep a stiff upper lip',
  'keep an eye on',
  'keep it simple, stupid',
  'keep the home fires burning',
  'keep up with the Joneses',
  'keep your chin up',
  'keep your fingers crossed',
  'kick the bucket',
  'kick up your heels',
  'kick your feet up',
  'kid in a candy store',
  'kill two birds with one stone',
  'kiss of death',
  'knock it out of the park',
  'knock on wood',
  'knock your socks off',
  'know him from Adam',
  'know the ropes',
  'know the score',
  'knuckle down',
  'knuckle sandwich',
  'knuckle under',
  'labor of love',
  'ladder of success',
  'land on your feet',
  'lap of luxury',
  'last but not least',
  'last hurrah',
  'last-ditch effort',
  'law of the jungle',
  'law of the land',
  'lay down the law',
  'leaps and bounds',
  'let sleeping dogs lie',
  'let the cat out of the bag',
  'let the good times roll',
  'let your hair down',
  'let\'s talk turkey',
  'letter perfect',
  'lick your wounds',
  'lies like a rug',
  'life\'s a bitch',
  'life\'s a grind',
  'light at the end of the tunnel',
  'lighter than a feather',
  'lighter than air',
  'like clockwork',
  'like father like son',
  'like taking candy from a baby',
  'like the plague',
  'like there\'s no tomorrow',
  'lion\'s share',
  'live and learn',
  'live and let live',
  'long and short of it',
  'long lost love',
  'look before you leap',
  'look down your nose',
  'look what the cat dragged in',
  'looking a gift horse in the mouth',
  'looks like death warmed over',
  'loose cannon',
  'lose your head',
  'lose your temper',
  'loud as a horn',
  'lounge lizard',
  'loved and lost',
  'low man on the totem pole',
  'luck of the draw',
  'luck of the Irish',
  'make hay while the sun shines',
  'make money hand over fist',
  'make my day',
  'make the best of a bad situation',
  'make the best of it',
  'make your blood boil',
  'man of few words',
  'man\'s best friend',
  'mark my words',
  'meaningful dialogue',
  'missed the boat on that one',
  'moment in the sun',
  'moment of glory',
  'moment of truth',
  'money to burn',
  'more power to you',
  'more than one way to skin a cat',
  'movers and shakers',
  'moving experience',
  'naked as a jaybird',
  'naked truth',
  'neat as a pin',
  'needle in a haystack',
  'needless to say',
  'neither here nor there',
  'never look back',
  'never say never',
  'nip and tuck',
  'nip it in the bud',
  'no guts, no glory',
  'no love lost',
  'no pain, no gain',
  'no skin off my back',
  'no stone unturned',
  'no time like the present',
  'no use crying over spilled milk',
  'nose to the grindstone',
  'not a hope in hell',
  'not a minute\'s peace',
  'not in my backyard',
  'not playing with a full deck',
  'not the end of the world',
  'not written in stone',
  'nothing to sneeze at',
  'nothing ventured nothing gained',
  'now we\'re cooking',
  'off the top of my head',
  'off the wagon',
  'off the wall',
  'old hat',
  'older and wiser',
  'older than dirt',
  'older than Methuselah',
  'on a roll',
  'on cloud nine',
  'on pins and needles',
  'on the bandwagon',
  'on the money',
  'on the nose',
  'on the rocks',
  'on the spot',
  'on the tip of my tongue',
  'on the wagon',
  'on thin ice',
  'once bitten, twice shy',
  'one bad apple doesn\'t spoil the bushel',
  'one born every minute',
  'one brick short',
  'one foot in the grave',
  'one in a million',
  'one red cent',
  'only game in town',
  'open a can of worms',
  'open and shut case',
  'open the flood gates',
  'opportunity doesn\'t knock twice',
  'out of pocket',
  'out of sight, out of mind',
  'out of the frying pan into the fire',
  'out of the woods',
  'out on a limb',
  'over a barrel',
  'over the hump',
  'pain and suffering',
  'pain in the',
  'panic button',
  'par for the course',
  'part and parcel',
  'party pooper',
  'pass the buck',
  'patience is a virtue',
  'pay through the nose',
  'penny pincher',
  'perfect storm',
  'pig in a poke',
  'pile it on',
  'pillar of the community',
  'pin your hopes on',
  'pitter patter of little feet',
  'plain as day',
  'plain as the nose on your face',
  'play by the rules',
  'play your cards right',
  'playing the field',
  'playing with fire',
  'pleased as punch',
  'plenty of fish in the sea',
  'point with pride',
  'poor as a church mouse',
  'pot calling the kettle black',
  'pretty as a picture',
  'pull a fast one',
  'pull your punches',
  'pulling your leg',
  'pure as the driven snow',
  'put it in a nutshell',
  'put one over on you',
  'put the cart before the horse',
  'put the pedal to the metal',
  'put your best foot forward',
  'put your foot down',
  'quick as a bunny',
  'quick as a lick',
  'quick as a wink',
  'quick as lightning',
  'quiet as a dormouse',
  'rags to riches',
  'raining buckets',
  'raining cats and dogs',
  'rank and file',
  'rat race',
  'reap what you sow',
  'red as a beet',
  'red herring',
  'reinvent the wheel',
  'rich and famous',
  'rings a bell',
  'ripe old age',
  'ripped me off',
  'rise and shine',
  'road to hell is paved with good intentions',
  'rob Peter to pay Paul',
  'roll over in the grave',
  'rub the wrong way',
  'ruled the roost',
  'running in circles',
  'sad but true',
  'sadder but wiser',
  'salt of the earth',
  'scared stiff',
  'scared to death',
  'sealed with a kiss',
  'second to none',
  'see eye to eye',
  'seen the light',
  'seize the day',
  'set the record straight',
  'set the world on fire',
  'set your teeth on edge',
  'sharp as a tack',
  'shoot for the moon',
  'shoot the breeze',
  'shot in the dark',
  'shoulder to the wheel',
  'sick as a dog',
  'sigh of relief',
  'signed, sealed, and delivered',
  'sink or swim',
  'six of one, half a dozen of another',
  'skating on thin ice',
  'slept like a log',
  'slinging mud',
  'slippery as an eel',
  'slow as molasses',
  'smart as a whip',
  'smooth as a baby\'s bottom',
  'sneaking suspicion',
  'snug as a bug in a rug',
  'sow wild oats',
  'spare the rod, spoil the child',
  'speak of the devil',
  'spilled the beans',
  'spinning your wheels',
  'spitting image of',
  'spoke with relish',
  'spread like wildfire',
  'spring to life',
  'squeaky wheel gets the grease',
  'stands out like a sore thumb',
  'start from scratch',
  'stick in the mud',
  'still waters run deep',
  'stitch in time',
  'stop and smell the roses',
  'straight as an arrow',
  'straw that broke the camel\'s back',
  'strong as an ox',
  'stubborn as a mule',
  'stuff that dreams are made of',
  'stuffed shirt',
  'sweating blood',
  'sweating bullets',
  'take a load off',
  'take one for the team',
  'take the bait',
  'take the bull by the horns',
  'take the plunge',
  'takes one to know one',
  'takes two to tango',
  'the more the merrier',
  'the real deal',
  'the real McCoy',
  'the red carpet treatment',
  'the same old story',
  'there is no accounting for taste',
  'thick as a brick',
  'thick as thieves',
  'thin as a rail',
  'think outside of the box',
  'third time\'s the charm',
  'this day and age',
  'this hurts me worse than it hurts you',
  'this point in time',
  'three sheets to the wind',
  'through thick and thin',
  'throw in the towel',
  'tie one on',
  'tighter than a drum',
  'time and time again',
  'time is of the essence',
  'tip of the iceberg',
  'tired but happy',
  'to coin a phrase',
  'to each his own',
  'to make a long story short',
  'to the best of my knowledge',
  'toe the line',
  'tongue in cheek',
  'too good to be true',
  'too hot to handle',
  'too numerous to mention',
  'touch with a ten foot pole',
  'tough as nails',
  'trial and error',
  'trials and tribulations',
  'tried and true',
  'trip down memory lane',
  'twist of fate',
  'two cents worth',
  'two peas in a pod',
  'ugly as sin',
  'under the counter',
  'under the gun',
  'under the same roof',
  'under the weather',
  'until the cows come home',
  'unvarnished truth',
  'up the creek',
  'uphill battle',
  'upper crust',
  'upset the applecart',
  'vain attempt',
  'vain effort',
  'vanquish the enemy',
  'vested interest',
  'waiting for the other shoe to drop',
  'wakeup call',
  'warm welcome',
  'watch your p\'s and q\'s',
  'watch your tongue',
  'watching the clock',
  'water under the bridge',
  'weather the storm',
  'weed them out',
  'week of Sundays',
  'went belly up',
  'wet behind the ears',
  'what goes around comes around',
  'what you see is what you get',
  'when it rains, it pours',
  'when push comes to shove',
  'when the cat\'s away',
  'when the going gets tough, the tough get going',
  'white as a sheet',
  'whole ball of wax',
  'whole hog',
  'whole nine yards',
  'wild goose chase',
  'will wonders never cease?',
  'wisdom of the ages',
  'wise as an owl',
  'wolf at the door',
  'words fail me',
  'work like a dog',
  'world weary',
  'worst nightmare',
  'worth its weight in gold',
  'wrong side of the bed',
  'yanking your chain',
  'yappy as a dog',
  'years young',
  'you are what you eat',
  'you can run but you can\'t hide',
  'you only live once',
  'you\'re the boss ',
  'young and foolish',
  'young and vibrant',
];

// Replace a basic white-space with more-robust white-space matching for new lines, half-space etc.
cliches = cliches.map((w) => w.replace(/ /g, '[\\b\\s\\u200C]*'));
const clicheRegex = new RegExp(`\\b(${cliches.join('|')})\\b`, 'gi');
const matcher = __nccwpck_require__(986);

module.exports = function clichesMatcher(text) {
  return matcher(clicheRegex, text);
};


/***/ }),

/***/ 986:
/***/ ((module) => {

function matcher(regex, text) {
  const results = [];
  let result = regex.exec(text);

  while (result) {
    results.push({ index: result.index, offset: result[0].length });
    result = regex.exec(text);
  }

  return results;
}

module.exports = matcher;


/***/ }),

/***/ 541:
/***/ ((module) => {

var irregulars = [
  'awoken',
  'been',
  'born',
  'beat',
  'become',
  'begun',
  'bent',
  'beset',
  'bet',
  'bid',
  'bidden',
  'bound',
  'bitten',
  'bled',
  'blown',
  'broken',
  'bred',
  'brought',
  'broadcast',
  'built',
  'burnt',
  'burst',
  'bought',
  'cast',
  'caught',
  'chosen',
  'clung',
  'come',
  'cost',
  'crept',
  'cut',
  'dealt',
  'dug',
  'dived',
  'done',
  'drawn',
  'dreamt',
  'driven',
  'drunk',
  'eaten',
  'fallen',
  'fed',
  'felt',
  'fought',
  'found',
  'fit',
  'fled',
  'flung',
  'flown',
  'forbidden',
  'forgotten',
  'foregone',
  'forgiven',
  'forsaken',
  'frozen',
  'gotten',
  'given',
  'gone',
  'ground',
  'grown',
  'hung',
  'heard',
  'hidden',
  'hit',
  'held',
  'hurt',
  'kept',
  'knelt',
  'knit',
  'known',
  'laid',
  'led',
  'leapt',
  'learnt',
  'left',
  'lent',
  'let',
  'lain',
  'lighted',
  'lost',
  'made',
  'meant',
  'met',
  'misspelt',
  'mistaken',
  'mown',
  'overcome',
  'overdone',
  'overtaken',
  'overthrown',
  'paid',
  'pled',
  'proven',
  'put',
  'quit',
  'read',
  'rid',
  'ridden',
  'rung',
  'risen',
  'run',
  'sawn',
  'said',
  'seen',
  'sought',
  'sold',
  'sent',
  'set',
  'sewn',
  'shaken',
  'shaven',
  'shorn',
  'shed',
  'shone',
  'shod',
  'shot',
  'shown',
  'shrunk',
  'shut',
  'sung',
  'sunk',
  'sat',
  'slept',
  'slain',
  'slid',
  'slung',
  'slit',
  'smitten',
  'sown',
  'spoken',
  'sped',
  'spent',
  'spilt',
  'spun',
  'spit',
  'split',
  'spread',
  'sprung',
  'stood',
  'stolen',
  'stuck',
  'stung',
  'stunk',
  'stridden',
  'struck',
  'strung',
  'striven',
  'sworn',
  'swept',
  'swollen',
  'swum',
  'swung',
  'taken',
  'taught',
  'torn',
  'told',
  'thought',
  'thrived',
  'thrown',
  'thrust',
  'trodden',
  'understood',
  'upheld',
  'upset',
  'woken',
  'worn',
  'woven',
  'wed',
  'wept',
  'wound',
  'won',
  'withheld',
  'withstood',
  'wrung',
  'written'
];

var exceptions = [
  'indeed',
];

var re = new RegExp('\\b(am|are|were|being|is|been|was|be)\\b\\s*([\\w]+ed|' + irregulars.join('|') + ')\\b', 'gi');
var byRe; // lazly construct

module.exports = function (text, options) {
  var r = (options && options.by) ?
          (byRe || constructByRe()) : re; // not sorry

  var suggestions = [];
  while (match = r.exec(text)) {
    if (exceptions.indexOf(match[2].toLowerCase()) === -1) {
      suggestions.push({
        index: match.index,
        offset: match[0].length
      });
    }
  }
  return suggestions;
}

// lol
function constructByRe () {
  return byRe = new RegExp(re.toString().slice(1, -3) + '\\s*by\\b', 'gi');
}


/***/ }),

/***/ 433:
/***/ ((module) => {

function matcher(regex, text) {
  const results = [];
  let result = regex.exec(text);

  while (result) {
    results.push({ index: result.index, offset: result[0].length });
    result = regex.exec(text);
  }

  return results;
}

module.exports = matcher;


/***/ }),

/***/ 435:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const matcher = __nccwpck_require__(433);

let wordyWords = [
  'a number of',
  'abundance',
  'accede to',
  'accelerate',
  'accentuate',
  'accompany',
  'accomplish',
  'accorded',
  'accrue',
  'acquiesce',
  'acquire',
  'additional',
  'adjacent to',
  'adjustment',
  'admissible',
  'advantageous',
  'adversely impact',
  'advise',
  'aforementioned',
  'aggregate',
  'aircraft',
  'all of',
  'all things considered',
  'alleviate',
  'allocate',
  'along the lines of',
  'already existing',
  'alternatively',
  'amazing',
  'ameliorate',
  'anticipate',
  'apparent',
  'appreciable',
  'as a matter of fact',
  'as a means of',
  'as far as I\'m concerned',
  'as of yet',
  'as per',
  'as to',
  'as yet',
  'ascertain',
  'assistance',
  'at the present time',
  'at this time',
  'attain',
  'attributable to',
  'authorize',
  'because of the fact that',
  'belated',
  'benefit from',
  'bestow',
  'by means of',
  'by virtue of the fact that',
  'by virtue of',
  'cease',
  'close proximity',
  'commence',
  'comply with',
  'concerning',
  'consequently',
  'consolidate',
  'constitutes',
  'demonstrate',
  'depart',
  'designate',
  'discontinue',
  'do damage to',
  'do harm to',
  'due to the fact that',
  'during the course of',
  'each and every',
  'economical',
  'eliminate',
  'elucidate',
  'employ',
  'endeavor',
  'enumerate',
  'equitable',
  'equivalent',
  'evaluate',
  'evidenced',
  'exclusively',
  'expedite',
  'expend',
  'expiration',
  'facilitate',
  'factual evidence',
  'feasible',
  'finalize',
  'first and foremost',
  'for all intents and purposes',
  'for the duration of',
  'for the most part',
  'for the purpose of',
  'forfeit',
  'formulate',
  'have a tendency to',
  'honest truth',
  'however',
  'if and when',
  'impacted',
  'implement',
  'in a manner of speaking',
  'in a timely manner',
  'in a very real sense',
  'in accordance with',
  'in addition',
  'in all likelihood',
  'in an effort to',
  'in between',
  'in excess of',
  'in lieu of',
  'in light of the fact that',
  'in many cases',
  'in my opinion',
  'in need of',
  'in order to',
  'in regard to',
  'in some instances',
  'in terms of',
  'in the affirmative',
  'in the case of',
  'in the course of',
  'in the event that',
  'in the final analysis',
  'in the midst of',
  'in the nature of',
  'in the near future',
  'in the negative',
  'in the process of',
  'inception',
  'incumbent upon',
  'indicate',
  'indication',
  'initiate',
  'irregardless',
  'is applicable to',
  'is authorized to',
  'is responsible for',
  'it is essential',
  'it is',
  'it seems that',
  'it was',
  'magnitude',
  'majority of',
  'make an effort',
  'maximum',
  'methodology',
  'minimize',
  'minimum',
  'modify',
  'monitor',
  'multiple',
  'myriad of',
  'necessitate',
  'nevertheless',
  'not certain',
  'not many',
  'not often',
  'not unless',
  'not unlike',
  'notwithstanding',
  'null and void',
  'numerous',
  'objective',
  'obligate',
  'obtain',
  'of late',
  'of the fact that',
  'off of',
  'on the contrary',
  'on the other hand',
  'one particular',
  'optimum',
  'outside of',
  'overall',
  'owing to the fact that',
  'participate',
  'particulars',
  'pass away',
  'pertaining to',
  'point in time',
  'portion',
  'possess',
  'preclude',
  'previous to',
  'previously',
  'prior to',
  'prioritize',
  'procure',
  'proficiency',
  'provided that',
  'purchase',
  'put simply',
  'readily apparent',
  'refer back',
  'regarding',
  'relocate',
  'remainder',
  'remuneration',
  'requirement',
  'reside',
  'residence',
  'retain',
  'satisfy',
  'shall',
  'should you wish',
  'similar to',
  'solicit',
  'sooner rather than later',
  'span across',
  'strategize',
  'subsequent',
  'substantial',
  'successfully complete',
  'sufficient',
  'terminate',
  'that which',
  'the month of',
  'the point I am trying to make',
  'therefore',
  'time period',
  'took advantage of',
  'transmit',
  'transpire',
  'type of',
  'until such time as',
  'utilization',
  'utilize',
  'validate',
  'various different',
  'what I mean to say is',
  'whether or not',
  'with respect to',
  'with the exception of',
  'witnessed'
];

// Replace a basic white-space with more-robust white-space matching for new lines, half-space etc.
wordyWords = wordyWords.map(w => w.replace(/ /g, '[\\b\\s\\u200C]*'));
const wordyRegex = new RegExp(`\\b(?<!-)(${wordyWords.join('|')})\\b`, 'gi');

module.exports = function isTextWordy(text) {
  return matcher(wordyRegex, text);
};


/***/ }),

/***/ 14:
/***/ ((module) => {

var weasels = [
  'are a number',
  'clearly',
  'completely',
  'exceedingly',
  'excellent',
  'extremely',
  'fairly',
  'few',
  'huge',
  'interestingly',
  'is a number',
  'largely',
  'many',
  'mostly',
  'obviously',
  'quite',
  'relatively',
  'remarkably',
  'several',
  'significantly',
  'substantially',
  'surprisingly',
  'tiny',
  'various',
  'vast',
  'very'
];

// Allow "too many" and "too few"
var exceptions = [
  'many',
  'few'
]

var re = new RegExp('\\b(' + weasels.join('|') + ')\\b', 'gi');

module.exports = function (text, opts) {
  var suggestions = [];
  while (match = re.exec(text)) {
    var weasel = match[0].toLowerCase();
    if (exceptions.indexOf(weasel) === -1 ||
        text.substr(match.index-4, 4) !== 'too ') {
      suggestions.push({
        index: match.index,
        offset: weasel.length,
      });
    }
  }
  return suggestions;
};


/***/ }),

/***/ 414:
/***/ ((module) => {

function repeatChar(ch, times) {
  let str = '';
  for (let i = times; i > 0; i--) {
    str += ch;
  }
  return str;
}

function generateStartOfLineIndex(line, lines) {
  const x = lines.slice(0);
  x.splice(line - 1);
  return x.join('\n').length + (x.length > 0);
}

function findLineColumn(contents, lines, index) {
  const line = contents.substr(0, index).split('\n').length;
  const startOfLineIndex = generateStartOfLineIndex(line, lines);
  const col = index - startOfLineIndex;

  return { line, col };
}

// annotate file contents with suggestions
module.exports = function annotate(contents, suggestions, parse) {
  const lines = contents.split('\n');

  return suggestions.map((suggestion) => {
    const lineColumn = findLineColumn(contents, lines, suggestion.index);

    let fix = 0;

    if (lineColumn.col > 25) {
      fix = lineColumn.col - 25;
    }

    if (parse) {
      return {
        reason: suggestion.reason,
        line: lineColumn.line,
        col: lineColumn.col,
      };
    }
    const lineSegment = lines[lineColumn.line - 1].substr(fix, 80);

    return [
      lineSegment,
      repeatChar(' ', lineColumn.col - fix) + repeatChar('^', suggestion.offset),
      `${suggestion.reason} on line ${lineColumn.line} at column ${lineColumn.col}`
    ].join('\n');
  });
};


/***/ }),

/***/ 335:
/***/ ((module) => {

// via http://matt.might.net/articles/shell-scripts-for-passive-voice-weasel-words-duplicates/

// Example:
// Many readers are not aware that the
// the brain will automatically ignore
// a second instance of the word "the"
// when it starts a new line.
const re = new RegExp('(\\s*)([^\\s]+)', 'gi');
const word = /\w+/;

module.exports = function lexicalIllusions(text) {
  const suggestions = [];
  let lastMatch = '';
  let match;

  // eslint-disable-next-line no-cond-assign
  while (match = re.exec(text)) {
    if (word.test(match[2]) && match[2].toLowerCase() === lastMatch) {
      suggestions.push({
        index: match.index + match[1].length,
        offset: match[2].length
      });
    }
    lastMatch = match[2].toLowerCase();
  }

  return suggestions;
};


/***/ }),

/***/ 803:
/***/ ((module) => {

/* eslint-disable no-cond-assign */

// Opinion: I think it's gross to start written English independent clauses with "so"
//          most of the time. Maybe it's okay in spoken English.
//
// More on "so:"
// * http://www.nytimes.com/2010/05/22/us/22iht-currents.html?_r=0
// * http://comminfo.rutgers.edu/images/comprofiler/plug_profilegallery/84/pg_2103855866.pdf

// this implementation is really naive
// eslint-disable-next-line no-control-regex
const re = new RegExp('([^\n\\.;!?]+)([\\.;!?]+)', 'gi');
const startsWithSoRegex = new RegExp('^(\\s)*so\\b[\\s\\S]', 'i');

module.exports = function startsWithSo(text) {
  const suggestions = [];
  let match;
  let innerMatch;

  while (match = re.exec(text)) {
    if (innerMatch = startsWithSoRegex.exec(match[1])) {
      suggestions.push({
        index: match.index + (innerMatch[1] || '').length,
        offset: 2
      });
    }
  }
  return suggestions;
};


/***/ }),

/***/ 327:
/***/ ((module) => {

/* eslint-disable no-cond-assign */

// Opinion: I think it's gross to start written English sentences with "there (is|are)"
//          (most of the time)

// this implementation is really naive
// eslint-disable-next-line no-control-regex
const re = new RegExp('([^\n\\.;!?]+)([\\.;!?]+)', 'gi');
const startsWithThereIsRegex = new RegExp('^(\\s)*there\\b\\s(is|are)\\b', 'i');

module.exports = function startsWithThereIs(text) {
  const suggestions = [];
  let match;
  let innerMatch;

  while (match = re.exec(text)) {
    if (innerMatch = startsWithThereIsRegex.exec(match[1])) {
      suggestions.push({
        index: match.index + (innerMatch[1] || '').length,
        offset: innerMatch[0].length - (innerMatch[1] || '').length
      });
    }
  }
  return suggestions;
};


/***/ }),

/***/ 282:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const weaselWords = __nccwpck_require__(14);
const passiveVoice = __nccwpck_require__(541);
const adverbWhere = __nccwpck_require__(67);
const tooWordy = __nccwpck_require__(435);
const noCliches = __nccwpck_require__(739);
const ePrime = __nccwpck_require__(939);

const lexicalIllusions = __nccwpck_require__(335);
const startsWithSo = __nccwpck_require__(803);
const thereIs = __nccwpck_require__(327);

const defaultChecks = {
  weasel: { fn: weaselWords, explanation: 'is a weasel word' },
  illusion: { fn: lexicalIllusions, explanation: 'is repeated' },
  so: { fn: startsWithSo, explanation: 'adds no meaning' },
  thereIs: { fn: thereIs, explanation: 'is unnecessary verbiage' },
  passive: { fn: passiveVoice, explanation: 'may be passive voice' },
  adverb: { fn: adverbWhere, explanation: 'can weaken meaning' },
  tooWordy: { fn: tooWordy, explanation: 'is wordy or unneeded' },
  cliches: { fn: noCliches, explanation: 'is a cliche' },
  eprime: { fn: ePrime, explanation: 'is a form of \'to be\'' }
};

// User must explicitly opt-in
const disabledChecks = {
  eprime: false
};

function filter(text, suggestions, whitelistTerms = []) {
  const whitelistSlices = whitelistTerms.reduce((memo, term) => {
    let index = text.indexOf(term);
    while (index > 0) {
      memo.push({ from: index, to: index + term.length });
      index = text.indexOf(term, index + 1);
    }
    return memo;
  }, []);

  return suggestions.reduce((memo, suggestion) => {
    if (!whitelistSlices.find((slice) => {
      const suggestionFrom = suggestion.index;
      const suggestionTo = suggestion.index + suggestion.offset;
      return (
        // suggestion covers entire whitelist term
        suggestionFrom <= slice.from && suggestionTo >= slice.to
      ) || (
        // suggestion starts within whitelist term
        suggestionFrom >= slice.from && suggestionFrom <= slice.to
      ) || (
        // suggestion ends within whitelist term
        suggestionTo >= slice.from && suggestionTo <= slice.to
      );
    })) {
      memo.push(suggestion);
    }
    return memo;
  }, []);
}

function dedup(suggestions) {
  const dupsHash = {};

  return suggestions.reduce((memo, suggestion) => {
    const key = `${suggestion.index}:${suggestion.offset}`;
    if (!dupsHash[key]) {
      dupsHash[key] = suggestion;
      memo.push(suggestion);
    } else {
      dupsHash[key].reason += ` and ${suggestion.reason.substring(suggestion.offset + 3)}`;
    }
    return memo;
  }, []);
}

function reasonable(text, reason) {
  return function reasonableSuggestion(suggestion) {
    // eslint-disable-next-line no-param-reassign
    suggestion.reason = `"${
      text.substr(suggestion.index, suggestion.offset)
    }" ${reason}`;
    return suggestion;
  };
}

module.exports = function writeGood(text, opts = {}) {
  const finalOpts = {};
  const defaultOpts = Object.assign({}, disabledChecks, opts);
  Object.keys(defaultOpts).forEach((optKey) => {
    if (optKey !== 'checks') {
      finalOpts[optKey] = defaultOpts[optKey];
    }
  });

  const finalChecks = opts.checks || defaultChecks;

  let suggestions = [];
  Object.keys(finalChecks).forEach((checkName) => {
    if (finalOpts[checkName] !== false) {
      suggestions = suggestions.concat(
        finalChecks[checkName]
          .fn(text)
          .map(reasonable(text, finalChecks[checkName].explanation))
      );
    }
  });

  const filtered = filter(text, suggestions, opts.whitelist);

  return dedup(filtered).sort((a, b) => (a.index < b.index ? -1 : 1));
};

module.exports.annotate = __nccwpck_require__(414);


/***/ }),

/***/ 357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");;

/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 87:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const glob = __nccwpck_require__(687);
const writeGood = __nccwpck_require__(282);
const core = __nccwpck_require__(193);
const fs = __nccwpck_require__(747);

/**
 * TODO: Add JSDoc
 */
async function run() {
  try {
    core.info("Starting Write-Good action.");
    let error = false;

    // TODO: Allow input to override glob pattern.
    const globber = await glob.create("**/*.md");

    for await (const file of globber.globGenerator()) {
      const data = fs.readFileSync(file, "utf-8");
      const suggestions = writeGood(data);
      if (suggestions.length > 0) {
        core.error(`File: ${file}`);
        core.error(JSON.stringify(suggestions));
        error = true;
      }
    }

    if (error) {
      core.setFailed("One or more markdown files had an error.");
    } else {
      core.info("Completed successfully.");
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

})();

module.exports = __webpack_exports__;
/******/ })()
;