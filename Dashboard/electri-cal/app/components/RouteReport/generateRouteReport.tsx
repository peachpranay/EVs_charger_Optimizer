import React, { useState } from "react";

const vehicleModel = (selectedCar) => {
  return selectedCar.replace(/ /g, "_");
};

const GenerateRouteReport = ({
  selectedCar,
  startLat,
  startLng,
  destinationLat,
  destinationLng,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleGenerateReport = async () => {
    const model_name = vehicleModel(selectedCar);
    const payload = {
      origin_lat: startLat,
      origin_lon: startLng,
      destination_lat: destinationLat,
      destination_lon: destinationLng,
      model_name: model_name,
      start_time: "09:00:00",
      start_weekday: "monday",
      vehicle_rates: {},
      weights: {
        distance: 1,
        energy_electric: 1,
        energy_liquid: 0,
        time: 1,
      },
    };

    try {
      const response = await fetch('https://cors-anywhere.herokuapp.com/https://developer.nrel.gov/api/routee/v3/compass/route?api_key=zppFQFGuTodoNmMaOOcKWWcGUdKyP4fZivqY2uSB', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const routeData = data.route || {};
      const traversalSummary = routeData.traversal_summary || {};
      
  
      setModalContent(`
        Traversal Summary:
        Battery State: ${traversalSummary.battery_state || 'N/A'} %
        Distance: ${traversalSummary.distance || 'N/A'} km
        Energy Electric: ${traversalSummary.energy_electric || 'N/A'} kWh
        Time: ${traversalSummary.time || 'N/A'} minutes
      `);

    } catch (error) {
      setModalContent("Error calculating compass route: " + error.message);
    }

  
    setIsModalOpen(true);
  };

  return (
    <div>
      <button
        className="mt-4 text-primary shadow-sm shadow-primary-content border-primary-content btn w-full bg-base-300 font-bold text-sm size-10 
        hover:bg-base-300 hover:opacity-80 hover:border-primary-content"
        onClick={handleGenerateReport}
      >
        Generate Route Report
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <div className="text-black">
              <h2 className="text-xl font-bold mb-4">Route Report</h2>
              <pre>{modalContent}</pre>
            <button onClick={() => setIsModalOpen(false)} className="mt-4 bg-primary text-white px-4 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateRouteReport;