const dotenv = require('dotenv');
dotenv.config({path : '../config/config'});
const ES = process.env.ES;

// Function to calculate width of footing
function calculateWidthOfFooting(serviceLoad, safeBearingCapacity) {
    // Calculate Weight
    const weight = 1.1 * serviceLoad;

    // Calculate Base Area of footing
    const baseArea = weight / safeBearingCapacity;

    // Calculate Width of footing (rounded to the nearest upper number)
    const widthOfFooting = Math.ceil(Math.sqrt(baseArea) * 10) / 10; // Rounded to 1 decimal place

    return widthOfFooting;
}

// Function to calculate net soil pressure
function calculateNetSoilPressure(factoredLoad, widthOfFooting) {
    // Calculate Net soil pressure
    const netSoilPressure = factoredLoad / (widthOfFooting * widthOfFooting * 1000); // Convert to kN/m^2

    return netSoilPressure;
}

// Function to calculate effective depth for one-way shear
function calculateEffectiveDepthOneWayShear(netSoilPressure, shearStress, intermediateValue) {
    // Calculate effective depth for one-way shear
    const effectiveDepthOneWayShear = (netSoilPressure * intermediateValue) / (netSoilPressure + shearStress);

    return effectiveDepthOneWayShear;
}

module.exports = {
    calculateWidthOfFooting,
    calculateNetSoilPressure,
    calculateEffectiveDepthOneWayShear
};