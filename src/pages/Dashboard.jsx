import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";

import { AiOutlineInfoCircle } from "react-icons/ai";
// import expensestable from "./expensestable";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
// import { BarChart } from "recharts";
import BarChart from "./BarChart";

function MainDashboard() {
  // Define state to manage the date selected by the user
  const [date, setDate] = useState(new Date());

  // Define a function to handle date changes
  const onChange = (newDate) => {
    setDate(newDate);
  };
  const [cards] = useState([
    {
      title: "Height",
      text: "190cm",
      bottom: "Your Height",
    },
    {
      title: "Weight",
      text: "50kg",
      bottom: "Your Weight",
    },
    {
      title: "Age",
      text: "19",
      bottom: "Your Age",
    },
  ]);

  return (
    <>
      <div>
        <div>
          <section className="card-container">
            <div className="container">
              <div className="cards">
                {cards.map((card, i) => (
                  <div key={i} className="card">
                    <h5 className="title">
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          alignItems: "center",
                        }}
                      >
                        {card.title}
                        <AiOutlineInfoCircle className="info-icon" />
                      </div>
                    </h5>
                    <h3 className="text">{card.text}</h3>
                    <h6 className="bottom">{card.bottom}</h6>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <div style={{ display: "flex", marginTop: "-12vh" }}>
            <Calendar className="mycalendar" onChange={onChange} value={date} />
            <BarChart />
          </div>
        </div>
      </div>
    </>
  );
}

export default MainDashboard;
