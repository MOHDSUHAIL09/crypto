import React from 'react'
import btcIcon from "../assets/images/bitcoin-icon.png";
import ethIcon from "../assets/images/ethereum-icon.png";
import ltcIcon from "../assets/images/litecoin-icon.png";
import convertIcon from "../assets/images/convert-icon.png";

export const Currency = () => {
  return (
    <>
      <div id="convertor" className="currency-convertor p-t p-tb c-l">
                <div className="container">
                    <div className="text-center"><h2 className="section-heading1">Currency Convertor</h2></div>
                    <div className="sub-txt text-center">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus tincidunt ultrices. Ut quis blandit dolor. Ut  Vestibulum ante ipsum primis in fauc</p>
                    </div>
                    <div className="convertor-content">
                        <div className="current-prices">
                            <div className="item">
                                <div className="current-ico"><img src={btcIcon} alt="" /></div>
                                <div className="currency-price">
                                    <h4>Bitcoin (BTC)</h4>
                                    <span>$9,360.41 (0.32%)</span>
                                </div>
                            </div>
                            <div className="item">
                                <div className="current-ico"><img src={ethIcon} alt="" /></div>
                                <div className="currency-price">
                                    <h4>Ethereum (ETH)</h4>
                                    <span>$182.53 (4.32%)</span>
                                </div>
                            </div>
                            <div className="item">
                                <div className="current-ico"><img src={ltcIcon} alt="" /></div>
                                <div className="currency-price">
                                    <h4>Litecoin (LTC)</h4>
                                    <span>$68.48 (11.64%)</span>
                                </div>
                            </div>
                        </div>
                        <div className="convertor-widget">
                            <div className="current-ico"><img src={convertIcon} alt="" /></div>
                            <div className="currency-calulator">
                                <script type="text/javascript">crypt_calc_border_width = 0;crypt_calc_border_color = "#ffffff";crypt_calc_border_corners = "square";crypt_calc_font_family = "Open sans";</script>
                                <script type="text/javascript" src="../www.cryptonator.com/ui/js/widget/calc_widget.html"></script>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </>
  )
}
