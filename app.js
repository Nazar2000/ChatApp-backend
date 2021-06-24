const {express} = require('./variables/variables.js');
const {app} = require('./variables/variables.js');
const {http} = require('./variables/variables.js');
const {cors} = require('./variables/variables.js');
const index_router = require('./routes/index');
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors())
app.use(express.json());
app.use('/', index_router);
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
http.listen(3000, () => {
    console.log('listening on *:3000');
});
app.listen(4000, () => {
    console.log('listening on port 4000');
})
