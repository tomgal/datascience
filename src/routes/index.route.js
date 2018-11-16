const express = require('express');
const router = express.Router();
const population=require('./population.route');

router.get('/',function(req,res,next){
    res.json({message: "Bienvenue sur notre API du projet datascience. Pour toute question relative, veuillez me contactez à thomas.galibert@ynov.com"});
});

router.use("/population-year", population.getInfoPopulationByYear);
router.use("/population", population.getInfoPopulation);

module.exports=router;