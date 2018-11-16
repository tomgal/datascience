let csv =require('csvtojson')
let fs =require('fs')

let methods={
    
    getStatsPopulationByYear:function(file)
    {
        return new Promise(resolve => {
            const csv1='csv/population'+file+'.csv'
            const csv2='csv/diplome'+file+'.csv'
            let jsonRsult = []
            Promise.all([
                csv({delimiter:";"}).fromFile(csv1),
                csv({delimiter:";"}).fromFile(csv1)
            ]).then(([jsonPopulation, jsonDiplome])=> {
                for(let i = 0; i < jsonPopulation.length; i++)
                {
                    let nomQuartier = jsonPopulation[i].Libell___des_grands_quartiers
                    let nbPop = jsonPopulation[i].Population
                    let pop02 = jsonPopulation[i].P11_POP0002     
                    let pop0310 =   Number(jsonPopulation[i].P11_POP0305) + Number(jsonPopulation[i].P11_POP0610)     
                    let jeuneMn20 = jsonPopulation[i].P11_POP0019
                    let actif2064 = jsonPopulation[i].P11_POP2064
                    let plus65 = jsonPopulation[i].P11_POP65P
                    let stat02 = Math.round(((pop02/nbPop)*100)*100)/100
                    let stat0310 = Math.round(((pop0310/nbPop)*100)*100)/100
                    let stat2064 = Math.round(((actif2064/nbPop)*100)*100)/100
                    let statMoins20 = Math.round(((jeuneMn20/nbPop)*100)*100)/100
                    let statPlus65 = Math.round(((plus65/nbPop)*100)*100)/100
                    let populationChomage =  Number(jsonPopulation[i].C11_POP15P_CS5)+Number(jsonPopulation[i].C11_POP15P_CS6)+Number(jsonPopulation[i].C11_POP15P_CS7)+Number(jsonPopulation[i].C11_POP15P_CS8)
                    let sansActivite = Math.round(((Number(jsonPopulation[i].C11_POP15P_CS8)/populationChomage)*100)*100)/100
                    let result = {"Geo_Point": jsonPopulation[i].Geo_Point , "Geo_Shape" : jsonPopulation[i].Geo_Shape,"quartier" : nomQuartier, "population" : Number(nbPop) ,"jeunemn20" : statMoins20, "entre2064" : stat2064, "plus65" : statPlus65, "sansActivite" : sansActivite, "pop02" : stat02, "pop0310" : stat0310}
                    jsonRsult.push(result)
                }
                resolve(jsonRsult)
            })
        })
    },
    getStatsPopulationGlobal:async function()
    {
        let globalResult = []
        let populationAvg = 0
        let tendance = 0
        let population02Tendance = 0
        let population02Avg = 0
        let population0310Tendance = 0
        let population0310Avg = 0
        let populationMn20Avg = 0
        let populationMn20Tendance = 0
        let population2064Avg = 0
        let population2064Tendance = 0
        let populationPlus65Tendance = 0
        let populationPlus65Avg = 0
        let sansActiviteTendance = 0
        let sansActiviteAvg = 0
        let value2012, value2013, value2014;
        try
        {
            let json2011 = await this.getStatsPopulationByYear("2011")
            let json2012 = await this.getStatsPopulationByYear("2012")
            let json2013 = await this.getStatsPopulationByYear("2013")
            let json2014 = await this.getStatsPopulationByYear("2014")
            for(let i = 0; i < json2011.length; i++)
            {
                value2012 = getElementFromJson(json2012, "quartier", json2011[i].quartier)
                value2013 = getElementFromJson(json2013, "quartier", json2011[i].quartier)
                value2014 = getElementFromJson(json2014, "quartier", json2011[i].quartier)
                tendance = Math.round((value2014.population/json2011[i].population)*100) / 100
                populationAvg = Math.round(((value2014.population + json2011[i].population + value2013.population + value2012.population) / 4)*100) / 100
                populationMn20Tendance = Math.round((value2014.jeunemn20/json2011[i].jeunemn20)*100) / 100
                populationMn20Avg = Math.round((((value2014.population * (value2014.jeunemn20/100)) + (json2011[i].population * (json2011[i].jeunemn20/100)) + (value2013.population * (value2013.jeunemn20/100)) + (value2012.population * (value2012.jeunemn20/100))) / 4)*100) / 100
                population2064Tendance = populationMn20Tendance = Math.round((value2014.entre2064/json2011[i].entre2064)*100) / 100
                population2064Avg = Math.round((((value2014.population * (value2014.entre2064/100)) + (json2011[i].population * (json2011[i].entre2064/100)) + (value2013.population * (value2013.entre2064/100)) + (value2012.population * (value2012.entre2064/100))) / 4)*100) / 100
                populationPlus65Tendance = Math.round((value2014.plus65/json2011[i].plus65)*100) / 100
                populationPlus65Avg = Math.round((((value2014.population * (value2014.plus65/100)) + (json2011[i].population * (json2011[i].plus65/100)) + (value2013.population * (value2013.plus65/100)) + (value2012.population * (value2012.plus65/100))) / 4)*100) / 100
                sansActiviteTendance = Math.round((value2014.sansActivite/json2011[i].sansActivite)*100) / 100
                sansActiviteAvg = Math.round((((value2014.population * (value2014.sansActivite/100)) + (json2011[i].population * (json2011[i].sansActivite/100)) + (value2013.population * (value2013.sansActivite/100)) + (value2012.population * (value2012.sansActivite/100))) / 4)*100) / 100
                population02Tendance = Math.round((value2014.pop02/json2011[i].pop02)*100) / 100
                population02Avg = Math.round((((value2014.population * (value2014.pop02/100)) + (json2011[i].population * (json2011[i].pop02/100)) + (value2013.population * (value2013.pop02/100)) + (value2012.population * (value2012.pop02/100))) / 4)*100) / 100
                population0310Tendance = Math.round((value2014.pop0310/json2011[i].pop0310)*100) / 100
                population0310Avg = Math.round((((value2014.population * (value2014.pop0310/100)) + (json2011[i].population * (json2011[i].pop0310/100)) + (value2013.population * (value2013.pop0310/100)) + (value2012.population * (value2012.pop0310/100))) / 4)*100) / 100

                globalResult.push({
                    "Quartier" : json2011[i].quartier,
                    "TendancePop" : tendance, 
                    "MoyennePop" : populationAvg, 
                    "MoyenneMoins20" : populationMn20Avg,
                    "TendanceMoins20" : populationMn20Tendance,
                    "TendanceEntre2064" : population2064Tendance,
                    "Moyenne2064" : population2064Avg,
                    "TendancePlus65" : populationPlus65Tendance,
                    "MoyennePlus65" : populationPlus65Avg,
                    "TendanceSansActivite" : sansActiviteTendance,
                    "MoyenneSansActivite" : sansActiviteAvg,
                    "Tendance02" : population02Tendance,
                    "Moyenne02" : population02Avg,
                    "Tendance0310" : population0310Tendance,
                    "Moyenne0310" : population0310Avg,
                    "Geo_Point" : json2011[i].Geo_Point,
                    "Geo_Shape" : json2011[i].Geo_Shape
                })
            }
            return globalResult;
        }
        catch(e)
        {
            console.log(e)
        }
    }


};
module.exports=methods

function getElementFromJson(json, key, value)
{
    let bool = true
    for(let i = 0; i < json.length; i++)
    {
        if(json[i][key] == value)
        {
            bool = false
            return json[i]
        }
    }
    if(bool)
    {
        return null
    }
}