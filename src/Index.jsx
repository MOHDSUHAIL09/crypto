import React from 'react'
import Home from './components/Home'
import About from './components/About'
import { Benefits } from './components/Benefits'
import { Currency } from './components/Currency-convertor'
import { Token } from './components/Token Allocation'
import { Counter } from './components/Counter'
import Faq from './components/Faq'
import { Team } from './components/Team'
import { MediaSlider } from './components/MediaSlider'
import Partners from './components/Partners'
import Header from './components/ui/Header/Header'
import Fotter from './components/ui/fotter/Fotter'
import Road from './components/RoadMap'


const Index = () => {
  return (
    <>
      <Header/>
      <div className="midd-container">
      <Home/>
      <About />
      <Benefits/>
      <Currency />
      <Token/>
      <Road/> 
      <Counter /> 
      <Faq />
      <Team/>
      <MediaSlider />
      <Partners />
    </div>
    <Fotter/>
    </>
  )
}

export default Index