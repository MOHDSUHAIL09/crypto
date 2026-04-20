import React from 'react'
import Header from './components/ui/Header/Header'
import Hero from './components/Hero'
import Brand from './components/BrandName'
import About from './components/AboutInvest'
import Investmentopportunities from './components/Investmentopportunities'
import Investmentadvantages from './components/Investmentadvantages'
import Choosehelthcare from './components/Choosehelthcare'
import Newsletter from './components/Newsletter'
import Fotter from './components/ui/fotter/Fotter'
import AiPowered from './components/AiPowered'
// import Investmentprocess from './components/Investmentprocess'


const Index = () => {
  return (
    <>  
      <Header />
      <div className="midd-container">
        <Hero />
        <Brand/>
        <About/>
        <Investmentopportunities/>
        <Investmentadvantages/>
        <Choosehelthcare/>
        <AiPowered/>
        {/* <Investmentprocess/> */}
        <Newsletter/>

      </div>
      <Fotter/>
    </>
  )
}

export default Index