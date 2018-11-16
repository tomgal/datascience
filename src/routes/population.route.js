const population = require('../methods/population')

async function getInfoPopulationByYear(req,res,next){
    try
    {
        let json = await population.getStatsPopulationByYear(req.query.year)
        res.json(json)
    }
    catch(e)
    {
        res.json(e)
    }
}

async function getInfoPopulation(req, res, next){
    try
    {
        let json = await population.getStatsPopulationGlobal()
        res.json(json)
    }
    catch(e)
    {
        res.json(e)
    }
}

module.exports = {
    getInfoPopulationByYear,
    getInfoPopulation
}
