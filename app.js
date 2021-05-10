const {express} = require('./variables/variables.js');
const {app} = require('./variables/variables.js');
const {http} = require('./variables/variables.js');
const {cors} = require('./variables/variables.js');
const index_router = require('./routes/index');

app.use(cors())
app.use(express.json());
app.use('/', index_router);

http.listen(3000, () => {
    console.log('listening on *:3000');
});
app.listen(4000, () => {
    console.log('listening on port 4000');
})
