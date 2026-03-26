import React, { useState } from "react";


const faqData = [
  {
    question: "When would I be able to see my token balance?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus tincidunt ultrices. Ut quis blandit dolor.",
  },
  {
    question:
      "Is it possible for the citizens or residents of the US to participate?",
    answer:
      "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.",
  },
  {
    question: "Is there a KYC process involved?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut laoreet sagittis arcu eu tristique.",
  },
  {
    question: "What will happen to the unsold tokens?",
    answer:
      "Aenean cursus tincidunt ultrices. Ut quis blandit dolor. Ut laoreet sagittis arcu eu tristique.",
  },
  {
    question:
      "Which cryptocurrencies can I use to participate in the Token Sale?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus tincidunt ultrices.",
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-section p-tb white-bg diamond-layout" id="faq">
      <div className="container">
        <div className="text-center">
          <h2 className="section-heading1">Frequently Asked Questions</h2>
        </div>

        <div className="accordion style-2">
          {faqData.map((item, index) => (
            <div className="card" key={index}>
              <div className="card-header">
                <button
                  className={`faq-btn ${
                    activeIndex === index ? "active" : ""
                  }`}
                  onClick={() => toggleFaq(index)}
                >
                  <h5>{item.question}</h5>
                  <i className="fas fa-caret-down rotate-icon"></i>
                </button>
              </div>

              <div
                className={`faq-collapse ${
                  activeIndex === index ? "show" : ""
                }`}
              >
                <div className="card-body">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
