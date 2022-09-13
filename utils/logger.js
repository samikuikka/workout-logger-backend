// logs to console only if not in test environment
module.exports.info = (...params) => {
    if(process.env.NODE_ENV !== 'test') {
        console.log(...params);
    }
}