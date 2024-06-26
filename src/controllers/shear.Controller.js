const { calculateBeta, calculateShearStress } = require('../utils/shearFunctions');
const dotenv = require('dotenv');
dotenv.config({path : '../config/config'});

// Route to calculate and return shear stress
const shearstress = (req, res, next) => {
    const concreteGrades = [15, 20, 25, 30, 35, 40];
    const ptValues = Array.from({ length: 57 }, (_, i) => 0.15 + 0.05 * i);
    const results = [];

    concreteGrades.forEach((fck) => {
        ptValues.forEach((pt) => {
            const beta = calculateBeta(fck, pt);
            const shearStress = calculateShearStress(fck, pt, beta);
            results.push({
                concreteGrade: `M${fck}`,
                pt: parseFloat(pt.toFixed(2)),
                beta: parseFloat(beta.toFixed(5)),
                shearStress: parseFloat(shearStress.toFixed(3)),
            });
        });
    });

    res.json(results);
};


module.exports = {shearstress};