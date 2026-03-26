import React, { useEffect, useRef, useState } from "react";
import transIcon from "../assets/images/transactions-icon.png";
import supportIcon from "../assets/images/support-icon.png";
import walletIcon from "../assets/images/wallets-icon.png";
import countryIcon from "../assets/images/countries-icon.png";

/* ✅ Custom Hook for Counter */
const useCount = (end, started, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;

    let start = 0;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [started, end, duration]);

  return count;
};

export const Counter = () => {
  const counterRef = useRef(null);
  const [started, setStarted] = useState(false);

  /* ✅ Scroll pe start hone ke liye */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [started]);

  /* ✅ Counts */
  const count1 = useCount(1594, started);
  const count2 = useCount(649, started);
  const count3 = useCount(852, started);
  const count4 = useCount(198, started);

  return (
    <div
      id="counter"
      ref={counterRef}
      className="milestone-section p-tb c-l"
    >
      <div className="container">
        <div className="row">

          <CounterBox icon={transIcon} value={count1} text="Transactions" />
          <CounterBox icon={supportIcon} value={count2} text="Operator" />
          <CounterBox icon={walletIcon} value={count3} text="Bitcoin Wallets" />
          <CounterBox icon={countryIcon} value={count4} text="Countries" />

        </div>
      </div>
    </div>
  );
};

/* ✅ Counter Box Component */
const CounterBox = ({ icon, value, text }) => (
  <div className="col">
    <div className="counter text-center">
      <div className="counter-icon">
        <img src={icon} alt={text} />
      </div>
      <div className="counter-value">{value}</div>
      <h4 className="count-text">{text}</h4>
    </div>
  </div>
);