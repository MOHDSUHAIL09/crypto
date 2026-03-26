import React from 'react'
// import Countdown from './Countdown'


export const Token = () => {
  return (
    <>


      <div className    ="token-sale p-tb light-gray-bg diamond-layout" id="token">
                <div className  ="container">
                    <div className  ="text-center"><h2 className  ="section-heading1">Token Allocation</h2></div>
                    <div className  ="sub-txt mw-650 text-center">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus tincidunt ultrices. Ut quis blandit dolor. Ut laoreet sagittis arcu eu tristique.</p>
                    </div>
                    <div className  ="row">
                        <div className  ="col-lg-5 col-md-12">
                            <div className  ="token-allocation-box style-3">
                                <div className  ="token-sale-left">
                                    <h3>Pre-Sale <span>will end in</span></h3>


                                    

                                    {/* <Countdown
  targetDate="2026-03-01T00:00:00"
  onFinish={() => console.log("Countdown Finished 🚀")}
/> */}






                                    <div className  ="hero-right-btn"><a className ="secoundry-btn" href="#">Register & Buy Tokens Now</a></div>
                                </div>
                                <div className  ="token-sale-right">
                                    <div className  ="row">
                                        <div className  ="sale-list col">
                                            <h4>PRIVATE SALE</h4>
                                            <div className  ="price-tag">
                                                <span>1 BCT = $32.21</span>
                                                Bonus 65%(0.068)
                                            </div>
                                        </div>
                                        <div className  ="sale-list col">
                                            <h4>PRIVATE SALE</h4>
                                            <div className  ="price-tag">
                                                <span>1 BCT = $25.09</span>
                                                Bonus 65%(0.068)
                                            </div>
                                        </div>
                                    </div>
                                    <div className  ="row">
                                        <div className  ="sale-list col">
                                            <h4>PRIVATE SALE</h4>
                                            <div className  ="price-tag">
                                                <span>1 BCT = $25.09</span>
                                                Bonus 65%(0.068)
                                            </div>
                                        </div>
                                        <div className  ="sale-list col">
                                            <h4>PRIVATE (S)</h4>
                                            <div className  ="price-tag">
                                                <span>$1.32548</span>
                                                Completion: 35%
                                            </div>
                                        </div>
                                    </div>
                                    <div className  ="row">
                                        <div className  ="sale-list">
                                            <h4>LIVE FEED</h4>
                                            <ul className   ="livefeed-list">
                                                <li><span>USA</span> 1500 BCT sold in</li>
                                                <li><span>UK</span> 1225 BCT sold in</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className  ="button-wrapper">
                                <a className   =" secoundry-btn" href="#">WhitePaper</a>
                                <a className  ="secoundry-btn" href="#">Privacy Policy</a>
                            </div>
                        </div>
                        <div className  ="col-lg-7 col-md-12">
                            
                            <div className  ="sale-chart-view">
                                <div className  ="doughnut">
                                    <div className  ="doughnutChartContainer">
                                        <canvas id="doughnutChart" height="270"></canvas>
                                    </div>
                                    <div id="legend" className  ="chart-legend"></div>
                                 </div>
                            </div>
                            <div className  ="sale-chart-view">
                                <div className  ="doughnut">    
                                    <div className  ="doughnutChartContainer">
                                        <canvas id="layout2doughnutChart1" height="270"></canvas>
                                    </div>
                                    <div id="layout2legend1" className  ="chart-legend"></div>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </>
  )
}
