import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/FooterDiv/Footer'

function FeasibilityCalculator() {
  const [formData, setFormData] = useState({
    campaignStart: '',
    campaignEnd: '',
    buyers: '',
    impressions: '',
    frequency: ''
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://127.0.0.1:5000/feasibilityCalculate/', {
        params: formData
      });
      setResult(response.data); // Set the result state to the response data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [array, setArray] = useState(0);

  const fetchApi = async () => {
    const response = await axios.get("http://127.0.0.1:5000/feasibilityCalculate");
    console.log(response.data);
    setArray(response.data)
  }

  return (
    <div className='w-[85%] m-auto bg-white'>
      <Navbar />
      <div className="container flex gap-10 justify-center flex-wrap items-center py-10"> 
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
              Flight Start Date
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" name="campaignStart" type="date" placeholder="09-12-2023" required onChange={handleChange} />
            <p className="text-red-500 text-xs italic">Please fill out this field.</p>
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
            Flight End Date
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" name="campaignEnd" type="date" placeholder="23-12-2023" required onChange={handleChange} />
          </div>
        </div>
        
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
            Total Buyers in Six Months
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="number" name="buyers" placeholder="100" required onChange={handleChange} />
            <p className="text-red-500 text-xs italic">Please fill out this field.</p>
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
            Total Number of Impressions
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" name="impressions" type="number" placeholder="1000000" required onChange={handleChange}/>
            <p className="text-red-500 text-xs italic">Please fill out this field.</p>
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
            Average of Frequency
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" name="frequency" type="number" placeholder="7" required onChange={handleChange} />
            <p className="text-gray-600 text-xs italic">We recommend to keep it in an average 7 of frequency </p>
          </div>
        </div>
        <div className="md:flex md:items-center">
      <div className="md:w-1/3"></div>
      <div className="md:w-2/3">
        <button className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
          Check
        </button>
      </div>
      </div>
      </form>
      
    </div>
    <>
     {result && (
<div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-white uppercase bg-blue-500 dark:bg-blue-500 dark:text-white">
            <tr>
                <th scope="col" className="px-6 py-3 rounded-s-lg">
                    Time
                </th>
                <th scope="col" className="px-6 py-3">
                    Estimated Buyers
                </th>
                <th scope="col" className="px-6 py-3">
                    Estimated Exposed Buyers
                </th>
                <th scope="col" className="px-6 py-3">
                    Penetration
                </th>
                <th scope="col" className="px-6 py-3">
                    Reach
                </th>
                <th scope="col" className="px-6 py-3 rounded-e-lg">
                    Reach (%) HH
                </th>
                
            </tr>
        </thead>
        <tbody>
            <tr className="bg-white dark:bg-gray-800">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Monthly
                </th>
                <td className="px-6 py-4">
                    {result["Estimated Buyers"]}
                </td>
                <td className="px-6 py-4">
                    {result["Estimated Exposed Buyers (Monthly)"]}
                </td>
                <td className="px-6 py-4">
                {result["Penetration (Monthly)"]}
                </td>
                <td className="px-6 py-4">
                {result["Reach"]}
                </td>
                <td className="px-6 py-4">
                {result["Reach (%) Households"]}
                </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Quarterly
                </th>
                <td className="px-6 py-4">
                    
                </td>
                <td className="px-6 py-4">
                {result["Estimated Exposed Buyers (Quarterly)"]}
                </td>
                <td className="px-6 py-4">
                {result["Penetration (Monthly)"]*3}
                </td>
                <td className="px-6 py-4">
                </td>
                <td className="px-6 py-4">
                </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Campaign Duration
                </th>
                <td className="px-6 py-4">
                    
                </td>
                <td className="px-6 py-4">
                {result["Estimated Exposed Buyers (During Campaign)"]}
                </td>
                <td className="px-6 py-4">
                    
                </td>
                <td className="px-6 py-4">

                </td>
                <td className="px-6 py-4">

                </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Six Months
                </th>
                <td className="px-6 py-4">
                    
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4">
                {result["Penetration"]}
                </td>
                <td className="px-6 py-4">
                </td>
                <td className="px-6 py-4">
                </td>
            </tr>
        </tbody>
       
        <tfoot>
            <tr className="font-semibold text-gray-900 dark:text-blue">
                <th scope="row" className="px-6 py-3 text-base">Status</th>
                <td className="px-3 py-3">
                {result["Campaign Feasibility"] === "Feasible" ? (
                    <span className="text-green-700 text-base">Feasible</span>
                  ) : (
                    <span className="text-red-700 text-base">Not Feasible</span> // Or any other fallback UI
                  )}
                  </td>
            </tr>
        </tfoot>
    </table>
    <div className='py-2 flex gap-2 flex-wrap items-center'>
          <p className='font-semibold text-gray-900 dark:text-blue text-base'>Status</p>
          <p className="font-semibold">
            {result["Campaign Feasibility"] === "Feasible" ? (
                    <span className="text-green-700 text-base">Feasible</span>
                  ) : (
                    <span className="text-red-700 text-base">Not Feasible</span>
                  )}
          </p>
    </div>
</div>
   )}
    </>
    
      <Footer />
    
    </div>
  )
}

export default FeasibilityCalculator;