import React, { useEffect, useState } from "react";
import { Card, Col, Form, Table } from "react-bootstrap";
import ReactPagination from "../../../components/ReactPagination";
import {
  getAllOutletForFundInOffice,
  getAllRegionalForFundInOffice,
  getAllSalesForFundInOffice,
  getOfficePendingFundRequest,
} from "../../../services/contractorApi";
import { Helmet } from "react-helmet";
import ActionButton from "../../../components/ActionButton";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import PartialExpense from "./PartialFund";
import ApprovedExpense from "./ApprovedFund";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PendingFund = () => {
  const [expenseRequest, setExpenseRequest] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const [allSalesArea, setAllSalesArea] = useState([]);
  const [allOutletArea, setAllOutletArea] = useState([]);
  const [allRoOffice, setAllRoOffice] = useState([]);
  const [salesAreaId, setSalesAreaId] = useState("");
  const [RegionalId, setRegionalId] = useState("");
  const [outletId, setOutletId] = useState("");
  const { t } = useTranslation();

  const fetchFundRequestData = async () => {
    const res = await getOfficePendingFundRequest(
      salesAreaId,
      RegionalId,
      outletId,
      pageSize,
      pageNo
    );

    if (res.status) {
      setExpenseRequest(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setExpenseRequest([]);
      setPageDetail({});
    }
  };

  const navigate = useNavigate();

  const fetchSalesArea = async () => {
    const res = await getAllSalesForFundInOffice(0);
    if (res.status) {
      setAllSalesArea(res.data);
    } else {
      setAllSalesArea([]);
    }
  };
  const fetchOutletArea = async () => {
    const res = await getAllOutletForFundInOffice(0);
    if (res.status) {
      setAllOutletArea(res.data);
    } else {
      setAllOutletArea([]);
    }
  };
  const fetchRoOffice = async () => {
    const res = await getAllRegionalForFundInOffice(0);
    if (res.status) {
      setAllRoOffice(res.data);
    } else {
      setAllRoOffice([]);
    }
  };

  useEffect(() => {
    fetchSalesArea();
    fetchOutletArea();
    fetchRoOffice();
  }, []);

  useEffect(() => {
    fetchFundRequestData();
  }, [pageNo, pageSize, outletId, RegionalId, salesAreaId]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleClick = (e, tab) => {
    localStorage.setItem("last_tab", tab);
    setActiveTab(tab);
  };

  return (
    <>
      <Helmet>
        <title>Office Fund Inspection· CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg">
          <Tabs
            onClick={(e, tab) => handleClick(e, tab)}
            activeTab={activeTab}
            ulClassName="border-primary p-2 border-bottom"
            activityClassName="bg-secondary"
          >
            <Tab
              className="pe-none fs-15 fw-bold"
              title={t("office fund inspection")}
            />
            <Tab className="ms-auto" title={t("Pending Fund")}>
              {activeTab == "2" && (
                <>
                  <div className="m-3 d-flex">
                    <Form.Group as={Col} md="3" className="m-1">
                      <Form.Label className="small">
                        {t("Regional Office")}
                      </Form.Label>
                      <Select
                        placeholder={t("Regional Office")}
                        menuPortalTarget={document.body}
                        isClearable={true}
                        options={allRoOffice?.map((user) => ({
                          label: user.regional_office_name,
                          value: user.id,
                        }))}
                        onChange={(e) => {
                          setRegionalId(e?.value);
                        }}
                      />
                    </Form.Group>

                    <Form.Group as={Col} md="3" className="m-1">
                      <Form.Label className="small">
                        {t("Sales Area")}
                      </Form.Label>
                      <Select
                        placeholder={t("Sales Area")}
                        menuPortalTarget={document.body}
                        isClearable={true}
                        options={allSalesArea?.map((user) => ({
                          label: user.sales_area_name,
                          value: user.id,
                        }))}
                        onChange={(e) => setSalesAreaId(e?.value)}
                      />
                    </Form.Group>

                    <Form.Group as={Col} md="3" className="m-1">
                      <Form.Label className="small">
                        {t("Outlet Name")}{" "}
                      </Form.Label>
                      <Select
                        placeholder={t("Outlet")}
                        menuPortalTarget={document.body}
                        isClearable={true}
                        options={allOutletArea?.map((user) => ({
                          label: user.outlet_name,
                          value: user.id,
                        }))}
                        onChange={(e) => setOutletId(e?.value)}
                      />
                    </Form.Group>
                  </div>

                  <div className="p-3">
                    <div className="table-scroll">
                      <Table className="text-body bg-new Roles">
                        <thead className="text-truncate">
                          <tr>
                            <th>{t("Outlet Id")}</th>
                            <th>{t("Outlet Name")}</th>
                            <th>{t("Regional Office")}</th>
                            <th>{t("Sales Area")}</th>
                            <th>{t("Total Amount")}</th>
                            <th>{t("Total Complaints")}</th>
                            <th>{t("status")}</th>
                            <th>{t("date")}</th>
                            <th>{t("Action")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenseRequest.length > 0 ? null : (
                            <tr>
                              <td colSpan={8}>
                                <img
                                  className="p-3"
                                  alt="no-result"
                                  width="250"
                                  src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                                />
                              </td>
                            </tr>
                          )}
                          {expenseRequest.map((data, id1) => (
                            <tr key={id1}>
                              <td>
                                {data?.outlet?.[0]?.outlet_unique_id ?? "--"}
                              </td>
                              <td>{data?.outlet?.[0]?.outlet_name ?? "--"}</td>

                              <td>
                                {data?.regionalOffice?.[0]
                                  ?.regional_office_name ?? "--"}
                              </td>
                              <td>
                                {data?.saleAreaDetails?.[0]?.sales_area_name ??
                                  "--"}
                              </td>
                              <td className="fw-bolder text-green">
                                {data?.total_amount}
                              </td>
                              <td>{data?.total_complaints}</td>
                              <td className="text-danger">
                                {data.status == "0" && "pending"}
                              </td>

                              <td>{data?.month}</td>

                              <td>
                                <ActionButton
                                  hideDelete={"d-none"}
                                  eyeOnclick={() =>
                                    navigate(`/view-office-fund`, {
                                      state: {
                                        outletId: data?.outlet?.[0]?.id,
                                        month: data?.month,
                                        type: "pending",
                                      },
                                    })
                                  }
                                  hideEdit={"d-none"}
                                  approveOnclick={() =>
                                    navigate(`/approve-office-fund`, {
                                      state: {
                                        outletId: data?.outlet?.[0]?.id,
                                        month: data?.month,
                                        type: "pending",
                                      },
                                    })
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <td colSpan={10}>
                            <ReactPagination
                              pageSize={pageSize}
                              prevClassName={
                                pageNo === 1
                                  ? "danger-combo-disable pe-none"
                                  : "red-combo"
                              }
                              nextClassName={
                                pageSize == pageDetail?.total
                                  ? expenseRequest.length - 1 < pageSize
                                    ? "danger-combo-disable pe-none"
                                    : "success-combo"
                                  : expenseRequest.length < pageSize
                                  ? "danger-combo-disable pe-none"
                                  : "success-combo"
                              }
                              title={`Showing ${
                                pageDetail?.pageStartResult || 0
                              } to ${pageDetail?.pageEndResult || 0} of ${
                                pageDetail?.total || 0
                              }`}
                              handlePageSizeChange={handlePageSizeChange}
                              prevonClick={() => setPageNo(pageNo - 1)}
                              nextonClick={() => setPageNo(pageNo + 1)}
                            />
                          </td>
                        </tfoot>
                      </Table>
                    </div>
                  </div>
                </>
              )}
            </Tab>
            <Tab title={t("Partial")}>
              {activeTab == "3" && <PartialExpense />}
            </Tab>
            <Tab title={t("Approved")}>
              {activeTab == "4" && <ApprovedExpense />}
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default PendingFund;
