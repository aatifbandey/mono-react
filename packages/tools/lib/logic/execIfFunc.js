const execIfFunc = x => (typeof x === 'function' ? x() : x);

module.exports = execIfFunc;
