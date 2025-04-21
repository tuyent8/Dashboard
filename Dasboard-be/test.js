const db = require('./src/config/database');

db.then(pool => {
    return pool.request().query('SELECT TOP 1 * FROM [YourTable]');
}).then(result => {
    console.log(result.recordset);
}).catch(err => {
    console.error('SQL error', err);
});
