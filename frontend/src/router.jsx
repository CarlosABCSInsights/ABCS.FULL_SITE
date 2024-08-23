/*
    File with the routes of the application
*/
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import FeasibilityCalculator from './apps/FeasibilityCalculator.jsx'
import ProductDefinitionApp from './apps/ProductDefinitionApp.jsx'
import ProductFinderApp from './apps/ProductFinder.jsx'



export const Router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/feasibilityCalculator', element: <FeasibilityCalculator /> },
  { path: '/productDefinitionApp', element: <ProductDefinitionApp />},
  { path: '/productFinder', element: <ProductFinderApp />}
])