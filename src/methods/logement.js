let csv =require('csvtojson')
let fs =require('fs')

let methods={
    getStatsLogementByYear:function(file)
    {
        return new Promise(resolve => {
            const csv1='csv/logement'+file+'.csv'
            let jsonRsult = []
            Promise.all([
                csv({delimiter:";"}).fromFile(csv1)
            ]).then(([jsonLogement])=> {
                for(let i = 0; i < jsonLogement.length; i++)
                {
                    let Geo_Point = jsonLogement[i].Geo_Point
                    let Geo_Shape = jsonLogement[i].Geo_Shape
                    let Quartier = jsonLogement[i].LIBELLE_DU_GRAND_QUARTIER
                    let NbLogement = Math.round((jsonLogement[i].Nombre_de_logements)*100)/100
                    let NbMaison = Math.round((jsonLogement[i].P11_MAISON)*100)/100
                    let NbAppart = Math.round((jsonLogement[i].P11_APPART)*100)/100
                    let StatAppart = Math.round(((NbAppart / NbLogement) * 100)*100)/100
                    let StatMaison = Math.round(((NbMaison / NbLogement) * 100)*100)/100
                    let result = {
                        "Geo_Point" : Geo_Point,
                        "Geo_Shape" : Geo_Shape,
                        "Quartier" : Quartier,
                        "NbLogement" : NbLogement,
                        "NbMaison" : NbMaison,
                        "NbAppart" : NbAppart,
                        "StatAppart" : StatAppart,
                        "StatMaison" : StatMaison
                    }
                    jsonRsult.push(result)
                }
                resolve(jsonRsult)
            })
        })
    },
    getStatsLogementGlobal:async function()
    {
        let globalResult = []
        let value2012, value2013, value2014;
        let TendanceLogement = 0
        let MoyenneLogement = 0
        let TendanceAppart = 0
        let MoyenneAppart = 0
        let TendanceMaison = 0
        let MoyenneMaison = 0
        try
        {
            let json2011 = await this.getStatsLogementByYear("2011")
            let json2012 = await this.getStatsLogementByYear("2012")
            let json2013 = await this.getStatsLogementByYear("2013")
            let json2014 = await this.getStatsLogementByYear("2014")
            for(let i = 0; i < json2011.length; i++)
            {
                value2012 = getElementFromJson(json2012, "Quartier", json2011[i].Quartier)
                value2013 = getElementFromJson(json2013, "Quartier", json2011[i].Quartier)
                value2014 = getElementFromJson(json2014, "Quartier", json2011[i].Quartier)
                TendanceLogement = Math.round((value2014.NbLogement/json2011[i].NbLogement)*100) / 100
                MoyenneLogement = Math.round(((value2014.NbLogement + json2011[i].NbLogement + value2013.NbLogement + value2012.NbLogement) / 4)*100) / 100
                TendanceAppart = Math.round((value2014.NbAppart/json2011[i].NbAppart)*100) / 100
                MoyenneAppart = Math.round(((value2014.NbAppart + json2011[i].NbAppart + value2013.NbAppart + value2012.NbAppart) / 4)*100) / 100
                TendanceMaison = Math.round((value2014.NbMaison/json2011[i].NbMaison)*100) / 100
                MoyenneMaison = Math.round(((value2014.NbMaison + json2011[i].NbMaison + value2013.NbMaison + value2012.NbMaison) / 4)*100) / 100

                globalResult.push({
                    "Geo_Point" : json2011[i].Geo_Point,
                    "Geo_Shape" : json2011[i].Geo_Shape,
                    "Quartier" : json2011[i].Quartier,   
                    "TendanceLogement" : TendanceLogement,
                    "MoyenneLogement" : MoyenneLogement,
                    "TendanceAppart" : TendanceAppart,
                    "MoyenneAppart" : MoyenneAppart,
                    "TendanceMaison" : TendanceMaison,
                    "MoyenneMaison" : MoyenneMaison
                })
            }
            return globalResult;
        }
        catch(e)
        {
            console.log(e)
        }
    }
}
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