// const hostname = '127.0.0.1';
// const port = 3000;
// const cors = require('cors')
// const express = require("express");
// const app = express()
// const database = require('./database');
// const bodyParser = require('body-parser')
//
// var allowedOrigins = ['http://localhost:3000', 'http://localhost:8101', 'http://localhost:8100'];
//
// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.indexOf(origin) === -1) {
//             var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//             return callback(new Error(msg), false);
//         }
//         return callback(null, true);
//     }
// }))
//
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
//
// app.use(bodyParser.json())
//
// app.post('/login', function (req, res) {
//     console.log(req.body);
//     database.loginData(req.body)
//     res.send('POST request to the homepage');
// });
//
// app.listen(port)
const express = require('express');
var index_router = require('./routes/index');
var cors = require('cors');
const app = express();
app.use(cors())
app.use(express.json());
app.use('/', index_router);
app.listen(4000, () => {
    console.log('listening on port 4000');
})
