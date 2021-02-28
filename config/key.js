if (process.env.NODE_ENV === 'produnction') {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}