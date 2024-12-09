import * as React from 'react';
import '@mui/material';
import { useUserPlant } from '../context/UserPlantContext/UserPlantContext';
import { useActiveTab } from '../context/ActiveTab/ActiveTab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader';
import MobNavBar from './MobileNavBar';
import { div } from 'framer-motion/client';
export default function DataGridDemo({  showMobNavBar }) {
 const { activeTab } = useActiveTab();
 console.log('activeTab:', activeTab);
  const { plantData, loading,currentPage, totalPages, handlePageChange } = useUserPlant();

 const [isPlantDataFetched,setIsPlantDataFetched] = React.useState(false);

 React.useEffect(() => {
 if(!loading && plantData.length > 0) {
  setIsPlantDataFetched(true);
 }
 }, [loading, plantData.length]);


  // Show loader if data is still loading and activeTab is not 'dashboard'
  if (loading === true && activeTab !== 'dashboard' && !isPlantDataFetched) {
    return <Loader />;
  }

 // If no data is available after fetching, show a "No data" message
 if (!loading && plantData.length === 0 && isPlantDataFetched) {
    return (
      <div className="mx-auto px-4 py-8">
        {showMobNavBar && <MobNavBar />}
        <div className="flex justify-center items-center py-8 text-gray-500 w-full">
          No data available
        </div>
      </div>
    );
  }


if(plantData.length > 0) {
     // Render table
  return (
    <div>
          {showMobNavBar && (
            <MobNavBar />
          )}
        <div className=" mx-auto px-4 py-8">
            
            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                  <table className="min-w-full table-auto">
                      <thead>
                          <tr className="bg-gray-100 border-b">
                              
                              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Plant Name</th>
                              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Plant ID</th>
                              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Capacity (KW)</th>
                              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Location</th>
                              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Customer Name</th>
                              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Installation Date</th>
                          </tr>
                      </thead>
                      <tbody>
                  
                        
                       
                          {plantData.map((user) => (
                              user.plant_details.map((plant) => (
                                  <tr key={plant._id} className="border-b">
                                      
                                      <td className="px-6 py-4 text-sm text-gray-900">{plant.plant_name}</td>
                                      <td className="px-6 py-4 text-sm text-gray-900">{plant.plant_id}</td>
                                      <td className="px-6 py-4 text-sm text-gray-900">{plant.capacity_kw}</td>
                                      <td className="px-6 py-4 text-sm text-gray-900">{plant.location}</td>
                                      <td className="px-6 py-4 text-sm text-gray-900">{user.first_name} {user.last_name}</td>
                                      <td className="px-6 py-4 text-sm text-gray-900">
                                          <span className={`px-2 py-1 rounded-full text-xs ${plant.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-800'}`}>
                                              {plant.status}
                                          </span>
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-900">{new Date(plant.installation_date).toLocaleDateString()}</td>
                                  </tr>
                              ))
                          ))}
                      </tbody>
                  </table>
              </div>
    
                     {/* Conditionally render pagination controls */}
                     {activeTab !== 'dashboard' && (
                    <div className="flex gap-4 justify-center items-center mt-4">
                       <span className='mr-2' onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}><FontAwesomeIcon icon={faArrowLeft} className='text-xl text-gray-600'/></span>
              
              <span className="text-xs text-semibold">Page {currentPage} of {totalPages}</span>
              <span 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                
              >
                <FontAwesomeIcon icon={faArrowRight} className='text-xl text-gray-600'/>
              </span>
                    </div>
                )}
          </div>
          </div>
      );
}
 return null;
};

