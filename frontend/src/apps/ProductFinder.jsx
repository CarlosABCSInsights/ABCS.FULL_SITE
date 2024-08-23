import React, { useState } from 'react';
import axios from 'axios'
import CreatableSelect from 'react-select/creatable';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/FooterDiv/Footer';
import DataTable from 'react-data-table-component';

// ICONS
import { BsArrowsVertical } from "react-icons/bs";


const ExpandedComponent = ({ result }) => <pre>{JSON.stringify(result, null, 2)}</pre>;

const columns = [
  { name: 'RECEIPT ID', selector: row => row.receipt_id },
  { name: 'USER ID', selector: row => row.user_id },
  { name: 'ITEM DESCRIPTION', selector: row => row.item_description },
  { name: 'ITEM DESCRIPTION RAW', selector: row => row.item_description_raw },
  { name: 'ITEM BARCODE', selector: row => row.item_barcode },
  { name: 'ITEM BARCODE RAW', selector: row => row.product_number_raw },
];

const ProductFinderApp = () => {
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState([]);
  const [formData, setFormData] = useState({ itemDescriptionValue: '' });
  const [result, setResult] = useState(null);
  const [inputBarcode, setInputBarcode] = useState('');
  const [valueBarcode, setValueBarcode] = useState([]);
  const [formDataBarcode, setFormDataBarcode] = useState({ itemBarcodeValue: '' });
  const [resultBarcode, setResultBarcode] = useState(null);

  const components = { DropdownIndicator: null };

  const createOption = (label) => ({
    label: String(label),
    value: String(label),
  });

  const handleChange = (newValue) => {
    setValue(newValue);
    const selectedDescriptions = newValue.map(option => option.value);
    setFormData({ itemDescriptionValue: selectedDescriptions });

  };
  const handleChangeBarcode = (newValue) => {
    setValueBarcode(newValue);
    const selectedBarcodes = newValue.map(option => option.value);
    setFormDataBarcode({ itemBarcodeValue: selectedBarcodes });

  };

  const handleInputChange = (newInputValue) => {
    setInputValue(newInputValue);
  };
  const handleInputChangeBarcodes = (newInputValue) => {
    setInputBarcode(newInputValue);
  };

  const handleKeyDown = (event) => {
    if (!inputValue) return;

    switch (event.key) {
      case 'Enter':
      case 'Tab':
        //const values = inputValue.trim().split(/[\s,]+/);
        const values = inputValue.trim().split(',');

        const newOptions = values
          .filter(val => val && !value.map(v => v.label).includes(val.trim()))
          .map(val => createOption(val.trim()));

        setValue(oldValue => [...oldValue, ...newOptions]);
        setInputValue('');
        event.preventDefault();
        break;
      default:
        break;
    }
  };
  const handleKeyDownBarcodes = (event) => {
    if (!inputBarcode) return;

    switch (event.key) {
      case 'Enter':
      case 'Tab':
        const values = inputBarcode.trim().split(/[\s,]+/);
        //const values = inputBarcode.trim().split(',');

        const newOptions = values
          .filter(val => val && !value.map(v => v.label).includes(val.trim()))
          .map(val => createOption(val.trim()));

        setValueBarcode(oldValue => [...oldValue, ...newOptions]);
        setInputBarcode('');
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    let pastedText = event.clipboardData.getData('Text');
    pastedText = pastedText.replace(/-/g, '');
    //const splitValues = pastedText.split(/[\s,]+/).filter(Boolean);
    const splitValues = pastedText.split(',').filter(Boolean);

    const newOptions = splitValues
      .filter(val => val && !value.map(v => v.label).includes(val.trim()))
      .map(val => createOption(val.trim()));

    setValue(prevValue => [...prevValue, ...newOptions]);
    setInputValue('');
  };
  const handlePasteBarcodes = (event) => {
    event.preventDefault();

    let pastedText = event.clipboardData.getData('Text');
    pastedText = pastedText.replace(/-/g, '');
    const splitValues = pastedText.split(/[\s,]+/).filter(Boolean);
    //const splitValues = pastedText.split(',').filter(Boolean);

    const newOptions = splitValues
      .filter(val => val && !value.map(v => v.label).includes(val.trim()))
      .map(val => createOption(val.trim()));

    setValueBarcode(prevValue => [...prevValue, ...newOptions]);
    setInputBarcode('');
  };

  const [isChecked, setIsChecked] = useState(false)
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
    console.log('Checkbox is checked:', isChecked)
    // false = OR, true = AND
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form with data (Item Description):', formData);
    console.log('Submitting form with data (Item Barcodes):', formDataBarcode);

    try {
      // Pass `itemDescriptionValue` as an array
      const response = await axios.get('http://127.0.0.1:5000/productQueryFinder/', {
        params: {
          itemDescriptionValue: value.map(option => option.value),
          itemBarcodeValue: valueBarcode.map(option => option.value),
          firstIsChecked: isChecked  // Send as an array
        }
      });
      console.log('API Response:', response.data);
      setResult(response.data.query_product_embedded_results);
    } catch (error) {
      console.error('Error fetching data:', error);
      //alert('Error fetching data. Please try again later.');
    }
  };

  

  return (
    <div className='w-[85%] m-auto bg-white'>
      <Navbar />
      <div className="container flex gap-10 justify-center flex-wrap items-center py-10 px-5">
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        <p className="text-gray-600 text-xm italic py-3">Insert Item Description </p>
        <CreatableSelect
            id="itemDescription"
            name="itemDescriptionValue"
            instanceId="itemDescription"
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            components={components}
            inputValue={inputValue}
            isClearable
            isMulti
            menuIsOpen={false}
            onChange={handleChange}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Enter values..."
            value={value}
          />
        < BsArrowsVertical size="25px"/>  
          <label className='themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center mx-3'>
        <input
          type='checkbox'
          checked={isChecked}
          onChange={handleCheckboxChange}
          className='sr-only'
        />
        <span className='label flex items-center text-sm font-medium text-black'>
          OR
        </span>
        <span
          className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
            isChecked ? 'bg-[#212b36]' : 'bg-[#CCCCCE]'
          }`}
        >
          <span
            className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
              isChecked ? 'translate-x-[28px]' : ''
            }`}
          ></span>
        </span>
        <span className='label flex items-center text-sm font-medium text-black'>
          AND
        </span>
      </label>
      < BsArrowsVertical size="25px"/> 
          <p className="text-gray-600 text-xm italic py-3">Insert Item Barcode</p>
          <CreatableSelect
            id="itemBarcode"
            name="itemBarcodeValue"
            instanceId="itemBarcode"
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            components={components}
            inputValue={inputBarcode}
            isClearable
            isMulti
            menuIsOpen={false}
            onChange={handleChangeBarcode}
            onInputChange={handleInputChangeBarcodes}
            onKeyDown={handleKeyDownBarcodes}
            onPaste={handlePasteBarcodes}
            placeholder="Enter values..."
            value={valueBarcode}
          />

          <div className="md:flex md:items-center">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <button className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                Check
              </button>
            </div>
          </div>
        </form>
        {result && (
          <main className="flex flex-col w-[210rem] bg-white overflow-x-hidden overflow-y-auto mb-14">
            
            <div className="flex w-full mx-auto px-6 py-8">
              
              <div className="flex flex-col overflow-x-auto">
              
                <div className="sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  
                    <div className="overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={result} 
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
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductFinderApp;
