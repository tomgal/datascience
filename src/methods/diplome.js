let csv =require('csvtojson')
let fs =require('fs')

let methods={
    GetStatDiplomeByYear:function(file)
    {
        return new Promise(resolve => {
            const csv1='csv/diplome'+file+'.csv'
            let jsonRsult = []
            Promise.all([
                csv({delimiter:";"}).fromFile(csv1)
            ]).then(([jsonDiplome])=> {
                for(let i = 0; i < jsonDiplome.length; i++)
                {
                    let Geo_Point = jsonDiplome[i].Geo_Point
                    let Geo_Shape = jsonDiplome[i].Geo_Shape
                    let Quartier = jsonDiplome[i].Libelle_des_grands_quartiers
                    let PopScol0205 = Math.round(Number(jsonDiplome[i].nbScol0205)*100)/100
                    let PopScol0610 = Math.round(Number(jsonDiplome[i].P11_SCOL0610)*100)/100
                    let PopScol1114 = Math.round(Number(jsonDiplome[i].P11_SCOL1114)*100)/100
                    let PopScol1517 = Math.round(Number(jsonDiplome[i].P11_SCOL1517)*100)/100
                    let PopScol18P = Math.round((Number(jsonDiplome[i].P11_SCOL1824) + Number(jsonDiplome[i].P11_SCOL2529) + Number(jsonDiplome[i].P11_SCOL30P))*100)/100
                    let PopScol = Math.round((PopScol0205 + PopScol0610 + PopScol1114 + PopScol1517 + PopScol18P)*100)/100
                    let PopNScol = Math.round((Number(jsonDiplome[i].P11_NSCOL15P)*100)/100)
                    let PopNScol0D = Math.round((Number(jsonDiplome[i].P11_NSCOL15P_DIPL0)*100)/100)
                    let StatNScol0D =  Math.round(((PopNScol0D / PopNScol) * 100)*100)/100
                    let PopNScolD = PopNScol - PopNScol0D
                    let StatNScolD = Math.round(((PopNScolD/PopNScol)*100)*100)/100
                    let result = {
                        "Geo_Point" : Geo_Point,
                        "Geo_Shape" : Geo_Shape,
                        "Quartier" : Quartier,
                        "PopScol0205" : PopScol0205,
                        "PopScol0610" : PopScol0610,
                        "PopScol1114" : PopScol1114,
                        "PopScol1517" : PopScol1517,
                        "PopScol18P" : PopScol18P,
                        "PopScol" : PopScol,
                        "PopNScol15" : PopNScol,
                        "PopNScol0D" : PopNScol0D,
                        "StatNScol0D" : StatNScol0D,
                        "PopNScolD" : PopNScolD,
                        "StatNScolD" : StatNScolD
                        
                    }
                    jsonRsult.push(result)
                }
                resolve(jsonRsult)
            })
        })
    },
    GetStatDiplomeGlobal:async function()
    {
        let globalResult = []
        let TendancePopScol = 0
        let MoyennePopScol = 0
        let TendancePopScol0205 = 0
        let MoyennePopScol0205 = 0
        let TendancePopScol1114 = 0
        let MoyennePopScol1114 = 0
        let TendancePopScol1517 = 0
        let MoyennePopScol1517 = 0
        let TendancePopScol18P = 0
        let MoyennePopScol18P = 0
        let TendancePopNScol15 = 0
        let MoyennePopNScol15 = 0
        let TendancePopNScol0D = 0
        let MoyennePopNScol0D = 0
        let TendancePopNScolD = 0
        let MoyennePopNScolD = 0

        let value2012, value2013, value2014;
        try
        {
            let json2011 = await this.GetStatDiplomeByYear("2011")
            let json2012 = await this.GetStatDiplomeByYear("2012")
            let json2013 = await this.GetStatDiplomeByYear("2013")
            let json2014 = await this.GetStatDiplomeByYear("2014")
            for(let i = 0; i < json2011.length; i++)
            {
                value2012 = getElementFromJson(json2012, "Quartier", json2011[i].Quartier)
                value2013 = getElementFromJson(json2013, "Quartier", json2011[i].Quartier)
                value2014 = getElementFromJson(json2014, "Quartier", json2011[i].Quartier)
                TendancePopScol = Math.round((value2014.PopScol/json2011[i].PopScol)*100) / 100
                MoyennePopScol = Math.round(((value2014.PopScol + json2011[i].PopScol + value2013.PopScol + value2012.PopScol) / 4)*100) / 100
                TendancePopScol0210 = Math.round(((value2014.PopScol0205 + value2014.PopScol0610)/(json2011[i].PopScol0205 + json2011[i].PopScol0610))*100) / 100
                MoyennePopScol0210 = Math.round(((value2014.PopScol0205 + value2014.PopScol0610 + json2011[i].PopScol0205 + json2011[i].PopScol0610 + value2013.PopScol0205 + value2013.PopScol0610 + value2012.PopScol0205 + value2012.PopScol0610) / 4)*100) / 100
                TendancePopScol1114 = Math.round((value2014.PopScol1114/json2011[i].PopScol1114)*100) / 100
                MoyennePopScol1114 = Math.round(((value2014.PopScol1114 + json2011[i].PopScol1114 + value2013.PopScol1114 + value2012.PopScol1114) / 4)*100) / 100
                TendancePopScol1517 = Math.round((value2014.PopScol1517/json2011[i].PopScol1517)*100) / 100
                MoyennePopScol1517 = Math.round(((value2014.PopScol1517 + json2011[i].PopScol1517 + value2013.PopScol1517 + value2012.PopScol1517) / 4)*100) / 100
                TendancePopScol18P = Math.round((value2014.PopScol18P/json2011[i].PopScol18P)*100) / 100
                MoyennePopScol18P = Math.round(((value2014.PopScol18P + json2011[i].PopScol18P + value2013.PopScol18P + value2012.PopScol18P) / 4)*100) / 100
                TendancePopNScol15 = Math.round((value2014.PopNScol15/json2011[i].PopNScol15)*100) / 100
                MoyennePopNScol15 = Math.round(((value2014.PopNScol15 + json2011[i].PopNScol15 + value2013.PopNScol15 + value2012.PopNScol15) / 4)*100) / 100
                TendancePopNScol0D = Math.round((value2014.PopNScol0D/json2011[i].PopNScol0D)*100) / 100
                MoyennePopNScol0D = Math.round(((value2014.PopNScol0D + json2011[i].PopNScol0D + value2013.PopNScol0D + value2012.PopNScol0D) / 4)*100) / 100
                TendancePopNScolD = Math.round((value2014.PopNScolD/json2011[i].PopNScolD)*100) / 100
                MoyennePopNScolD = Math.round(((value2014.PopNScolD + json2011[i].PopNScolD + value2013.PopNScolD + value2012.PopNScolD) / 4)*100) / 100

                globalResult.push({
                    "Geo_Point" : json2011[i].Geo_Point,
                    "Geo_Shape" : json2011[i].Geo_Shape,
                    "Quartier" : json2011[i].Quartier,   
                    "TendancePopScol" : TendancePopScol,
                    "MoyennePopScol" : MoyennePopScol,
                    "TendancePopScol0205" : TendancePopScol0210,
                    "MoyennePopScol0210" : MoyennePopScol0210,
                    "TendancePopScol1114" : TendancePopScol1114,
                    "MoyennePopScol1114" : MoyennePopScol1114,
                    "TendancePopScol1517" : TendancePopScol1517,
                    "MoyennePopScol1517" : MoyennePopScol1517,
                    "TendancePopScol18P" : TendancePopScol18P,
                    "MoyennePopScol18P" : MoyennePopScol18P,
                    "TendancePopNScol15" : TendancePopNScol15,
                    "MoyennePopNScol15" : MoyennePopNScol15,
                    "TendancePopNScol0D" : TendancePopNScol0D,
                    "MoyennePopNScol0D" : MoyennePopNScol0D,
                    "TendancePopNScolD" : TendancePopNScolD,
                    "MoyennePopNScolD" : MoyennePopNScolD
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