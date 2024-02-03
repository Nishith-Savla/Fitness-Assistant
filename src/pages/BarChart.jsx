import React from "react";
import Chart from "react-apexcharts";

function Barchart() {
  return (
    <React.Fragment>
      <div>
        <Chart
          style={{ marginTop: "18vh" }}
          type="bar"
          width={800}
          height={400}
          series={[
            {
              name: "Calories Burnt",
              data: [6578, 6787, 3245, 9876, 2324, 5123, 2435],
            },
          ]}
          options={{
            colors: ["#0080FE"],
            theme: { mode: "light" },

            xaxis: {
              tickPlacement: "on",
              categories: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              title: {
                text: "Week Days",
                style: { color: "#0080FE", fontSize: 30 },
              },
            },

            yaxis: {
              labels: {
                formatter: (val) => {
                  return val;
                },
                style: { fontSize: "15", colors: ["#0080FE"] },
              },
              title: {
                text: "Calories Burnt",
                style: { color: "#0080FE", fontSize: 15 },
              },
            },

            legend: {
              show: true,
              position: "right",
            },

            dataLabels: {
              formatter: (val) => {
                return val;
              },
              style: {
                colors: ["white"],
                fontSize: 15,
              },
            },
          }}
        ></Chart>
      </div>
    </React.Fragment>
  );
}

export default Barchart;
