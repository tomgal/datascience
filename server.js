//--------------------------------------------------
//	Server.js
//	Galibert thomas - Developpeur
//	Script node datascience
//--------------------------------------------------

var express = require('express')
var bodyParser = require('body-parser')
var population = require('./src/methods/population')
var logement = require('./src/methods/logement')
var diplome = require('./src/methods/diplome')
var routes = require('./src/routes/index.route');
var app = express()
port = process.env.PORT || 3000

var cors = require('cors')
app.use(cors())
app.use(bodyParser.json())
app.use("/",routes);
app.use(bodyParser.urlencoded({ extended: false }))

app.use(function(req, res, next) {
	var err = new Error('Not Found')
	err.status = 404
	next(err)
});

population.getStatsPopulationGlobal()
logement.getStatsLogementGlobal()
diplome.GetStatDiplomeGlobal()

app.listen(port)
console.log('Script node js for datascience running on port:' + port)
