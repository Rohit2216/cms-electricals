import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Card, Col, Row } from "react-bootstrap";
import { BsBoxArrowInLeft, BsBoxArrowInRight } from "react-icons/bs";
import moment from "moment";
import { useTranslation } from "react-i18next";

const TimeBar = ({ MyCard }) => {
  const { t } = useTranslation();
  const [chartData2] = useState({
    series: [76],
    options: {
      chart: {
        offsetY: -20,
        sparkline: {
          enabled: true,
        },
      },
      colors: ["#5200ff"],
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e2e2fc",
            strokeWidth: "97%",
            margin: 5, // margin is in pixels
            dropShadow: {
              enabled: true,
              offsetY: -1,
              offsetX: -1,
              top: 0,
              left: -1,
              color: "#fff",
              opacity: 1,
              blur: 3,
            },
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              offsetY: -2,
              fontSize: "22px",
            },
          },
        },
      },
      grid: {
        padding: {
          top: -10,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91],
        },
      },
      labels: ["Average Results"],
    },
  });

  function MyCard({ children, className }) {
    return (
      <Card className={className}>
        <Card.Body>{children}</Card.Body>
      </Card>
    );
  }

  const [clockIn, setClockIn] = useState();
  const [currentTime, setCurrentTime] = useState(moment().format("hh:mm:ss a"));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format("hh:mm:ss a"));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  const toggleClass = () => {
    setClockIn(!clockIn);
  };
  return (
    <Row className="g-4">
      <Col md={4} className="text-center text-secondary text-shadow-1">
        <MyCard className={"bg-new h-100"}>
          <MyCard className={"card-bg py-4"}>
            <p className="fw-bold mb-0 fs-3">{currentTime}</p>
          </MyCard>
        </MyCard>
      </Col>
      <Col md={4} className="text-center text-secondary text-shadow-1">
        <MyCard className={"bg-new h-100"}>
          <MyCard className={"card-bg py-3 "}>
            {/* <p className="fw-bold mb-2 fs-3">{moment().format("Do MMMM")}</p> */}
            {/* <p className='fw-bold mb-2 fs-3'>{moment().format("MMM Do YY")}30 November</p> */}
            <p className="fw-bold mb-0 fs-3">{moment().format("dddd")}</p>
          </MyCard>
        </MyCard>
      </Col>
      <Col md={4} className="text-center text-secondary text-shadow-1">
        <MyCard className={"bg-new h-100"}>
          <MyCard className={"card-bg py-3 "}>
            <p className="fw-bold mb-2 fs-3">
              {moment().format("Do MMMM YYYY")}
            </p>
            {/* <p className='fw-bold mb-2 fs-3'>{moment().format("MMM Do YY")}30 November</p> */}
            {/* <p className="mb-0">{moment().format("dddd")}</p> */}
          </MyCard>
        </MyCard>
      </Col>
      {/* <Col md={6} className="text-center">
      <MyCard className={"bg-new py-4 mb-4"}>
          <p className="mb-2">{t("Total Working hours")}</p>
          <p className="fw-bold fs-1 text-secondary text-shadow-1">
            05:20:50 hours
          </p>
          <p className="mb-0">{t("Clock In At")} : 10:00:50 AM</p>
        </MyCard>
      <p
          className="fw-bold shadow text-shadow-1 mb-0 cursor-pointer rounded-pill border d-inline-block py-md-3 py-2 px-md-5 px-3 fs-3 text-green"
          onClick={toggleClass}
        >
          {clockIn ? (
            <>
              <BsBoxArrowInRight className="align-text-bottom me-2" />{" "}
              {t("Clock In")}
            </>
          ) : (
            <span className="text-danger">
              <BsBoxArrowInLeft className="align-text-bottom me-2" />{" "}
              {t("Clock Out")}
            </span>
          )}
        </p>
      </Col> */}
      {/* <Col md={3}>
        <MyCard className={"bg-new h-100"}>
          <p className="mb-4 social-btn-re danger-combo lh-1 w-auto h-auto">
            {t("Working Progress")}
          </p>
          <p className="mb-4">{moment().format("Do MMMM YYYY")}</p>
          <Chart
            options={chartData2.options}
            series={chartData2.series}
            type="radialBar"
            height={280}
          />
        </MyCard>
      </Col> */}
    </Row>
  );
};

export default TimeBar;
