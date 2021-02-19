// const getAlarms = () => {
//      return new Promise((resolve, reject) => {
//           db.all('SELECT * FROM Alarms', (err, rows) => {
//                if (err) reject(err);

//                rows.forEach( row => {
//                     row.repeat = JSON.parse(row.repeat);
//                });

//                resolve(rows)
//           })
//      })
// }