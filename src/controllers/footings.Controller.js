const { calculateWidthOfFooting, calculateNetSoilPressure, calculateEffectiveDepthOneWayShear } = require('../utils/footingFunctions');
const { calculateBeta, calculateShearStress } = require('../utils/shearFunctions');
const dotenv = require('dotenv');
dotenv.config({path : '../config/config'});

// Route to calculate and return shear stress
const footingDesign = (req, res, next) => {
    const columnWidth = 450; // Column Width (mm)
    const columnLength = 450; // Column Length (mm)
    const concreteGrade = 20; // Concrete Grade
    const steelGrade = 415; // Steel Grade
    const safeBearingCapacity = 300; // Safe bearing capacity (kN/m^2)
    const loadFactor = 1.5; // Load factor
    const assumedPercentageTensionSteel = 0.25;  // Assumed Percentage of Tension Steel
    const concreteGrades = [20, 25, 30, 35, 40]; // Concrete grades

    // Define ranges for service load and safe bearing capacity
    const serviceLoadRange = { min: 2000, max: 3000, increment: 100 };
    const safeBearingCapacityRange = { min: 100, max: 400, increment: 50 };


    // Initialize array to store results
    const results = [];

    // Iterate over the concrete grades
    concreteGrades.forEach(concreteGrade => {

        const beta = calculateBeta(concreteGrade, assumedPercentageTensionSteel);
        const shearStress = parseFloat(calculateShearStress(concreteGrade, assumedPercentageTensionSteel, beta).toFixed(3));

        // Iterate over the range of safe bearing capacities
        for (let safeBearingCapacity = safeBearingCapacityRange.min; safeBearingCapacity <= safeBearingCapacityRange.max; safeBearingCapacity += safeBearingCapacityRange.increment) {
            // Iterate over the range of service loads
            for (let serviceLoad = serviceLoadRange.min; serviceLoad <= serviceLoadRange.max; serviceLoad += serviceLoadRange.increment) {

                    // Calculate Factored Load
                    const factoredLoad = loadFactor * serviceLoad;

                    // Calculate Width of footing
                    const widthOfFooting = calculateWidthOfFooting(serviceLoad, safeBearingCapacity);

                    // Intermediate value for calculating one way shear at critical section
                    const intermediateValue = (widthOfFooting * 1000 - columnWidth) / 2;

                    // Calculate Weight
                    const weight = 1.1 * serviceLoad;

                    // Calculate Base Area of footing
                    const baseArea = weight / safeBearingCapacity;

                    // Calculate Net soil pressure
                    const netSoilPressure = calculateNetSoilPressure(factoredLoad, widthOfFooting);

                    // Calculate effective Depth  for One Way Shear
                    const effectiveDepthOneWayShear = calculateEffectiveDepthOneWayShear(netSoilPressure, shearStress, intermediateValue);

                    // Construct JSON object for current load
                    const result = {
                        columnWidth,
                        columnLength,
                        serviceLoad,
                        loadFactor,
                        factoredLoad,
                        concreteGrade,
                        steelGrade,
                        safeBearingCapacity,
                        weight,
                        baseArea,
                        widthOfFooting,
                        netSoilPressure,
                        shearStress,
                        intermediateValue,
                        effectiveDepthOneWayShear
                    };

                    // Add result to array
                    results.push(result);
            }
        }
    });

    // Send JSON response
    res.json(results);
};


module.exports = {footingDesign};