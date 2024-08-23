import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
//import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/FooterDiv/Footer'
import LeftNavbar from '../components/Navbar/ProductDefinitionApp/Leftbar'
import {BiTimeFive} from 'react-icons/bi';
import CreatableSelect from 'react-select/creatable';
import { colourOptions } from './docs/data';
import DataTable from 'react-data-table-component';

const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

const columns = [
	{
		name: 'USER ID',
		selector: row => row.user_id,
	},
	{
		name: 'ITEM DESCRIPTION',
		selector: row => row.item_description,
	},
  {
		name: 'ITEM DESCRIPTION RAW',
		selector: row => row.item_description_raw,
	},
  {
		name: 'BARCODE BRAND',
		selector: row => row.barcode_brand,
	},
  {
		name: 'CAPTURE BRAND',
		selector: row => row.capture_brand,
	},
  {
		name: 'ITEM BARCODE',
		selector: row => row.item_barcode,
	},
  {
		name: 'ITEM BARCODE RAW',
		selector: row => row.product_number_raw,
	},
  {
		name: 'RETAILER BANNER',
		selector: row => row.retailer_banner,
	},
  {
		name: 'REAL COMPANY',
		selector: row => row.real_company,
	},
  {
		name: 'STORE NAME',
		selector: row => row.store_name,
	},
  {
		name: 'CATEGORY 1',
		selector: row => row.barcode_category_1,
	},
  {
		name: 'CATEGORY 2',
		selector: row => row.barcode_category_2,
	},
  {
		name: 'CATEGORY 3',
		selector: row => row.barcode_category_3,
	},
];

function FeasibilityCalculator() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };
  const handleChange = async (e) => {
    e.preventDefault();
    console.log("Handle Change");
  };
/*
  const [data, setData] = useState([]);
   
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/EmbeddingsDB/')
      .then(res => {
        setData(res.data.embeddings);
      })
  }, []);
  console.log(axios.get('http://127.0.0.1:5000/EmbeddingsDB/'))
  console.log(data);
*/
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/EmbeddingsDB/')
      .then(res => {
        setData(res.data.embeddings);
      })
  }, []);
  console.log(data);
    
  

  return (
    <div>
      <LeftNavbar />
      <div className="h-screen">
        <div className="flex h-full">
          <nav className="flex w-72 h-full">
            <div className="w-full flex mx-auto px-6 py-8">
              <div className="w-full h-full flex items-center justify-center text-gray-900 text-xl">
                
              </div>
            </div>
          </nav>
          
          <main className="flex flex-col w-[210rem] bg-white overflow-x-hidden overflow-y-auto mb-14">
            
            <div className="flex w-full mx-auto px-6 py-8">
              
              <div className="flex flex-col overflow-x-auto">
                <div className="sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={data} 
                        pagination
                        className="min-w-full text-start text-sm font-light text-surface dark:text-black"
                        expandableRows
			                  expandableRowsComponent={ExpandedComponent}
                        selectableRows
                        responsive
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <nav className="flex w-full h-full bg-yellow-400">
            <div className="container flex gap-10 justify-center flex-wrap items-center py-2">
              <form className="w-full max-w-lg" onSubmit={handleSubmit}>
                <div className="flex flex-col w-full h-full flex-wrap ">
                  <div className="w-full px-3 mb-6 md:mb-0 py-2">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Item Description
                    </label>
                    <CreatableSelect
                      name="ItemDescription"
                      isMulti
                      options={colourOptions}
                    />
                  </div>
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Item Description Raw
                    </label>
                    <CreatableSelect
                      name="ItemDescriptionRaw"
                      isMulti
                      options={colourOptions}
                    />
                  </div>
                  <div className="w-full px-3 mb-6 md:mb-0 py-2">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Barcode Brand
                    </label>
                    <CreatableSelect
                      name="ItemDescription"
                      isMulti
                      options={colourOptions}
                    />
                  </div>
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Capture Brand
                    </label>
                    <CreatableSelect
                      name="ItemDescriptionRaw"
                      isMulti
                      options={colourOptions}
                    />
                  </div>
                  <div className="w-full px-3 mb-6 md:mb-0 py-2">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Retailer Banner
                    </label>
                    <CreatableSelect
                      name="ItemDescription"
                      isMulti
                      options={colourOptions}
                    />
                  </div>
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Store Name
                    </label>
                    <CreatableSelect
                      name="ItemDescriptionRaw"
                      isMulti
                      options={colourOptions}
                    />
                  </div>
                  <div className="w-full px-3 mb-6 md:mb-0 py-2">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Store State
                    </label>
                    <CreatableSelect
                      name="ItemDescription"
                      isMulti
                      options={colourOptions}
                    />
                  </div>
                  <div className="w-full px-3 py-2">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Store City
                    </label>
                    <CreatableSelect
                      name="ItemDescriptionRaw"
                      isMulti
                      options={colourOptions}
                    />
                  </div>
                </div>
              </form>
            </div>
          </nav>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FeasibilityCalculator;