import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import './App.css'
import Search from './components/SearchDiv/Search'
import Apps from './components/AppsCards/Apps'
import Value from './components/ValueDiv/Value'
import Footer from './components/FooterDiv/Footer'

function App() {
  return (
    <div className='w-[85%] m-auto bg-white'>
      <Navbar />
      <Search />
      <Apps />
      <Value />
      <Footer />
    </div>
  )
}

export default App
