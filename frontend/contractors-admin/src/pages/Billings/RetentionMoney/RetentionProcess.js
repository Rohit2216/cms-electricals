import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  approveRetentionAmount,
  discardRetentions,
  getAllEligibleAndDoneRetentions,
  getAllPONumber,
  getAllRetentionIdListing,
  getAllRoListing,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import { Col, Form, Row, Table } from "react-bootstrap";
import ActionButton from "../../../components/ActionButton";
import ReactPagination from "../../../components/ReactPagination";
import ConfirmAlert from "../../../components/ConfirmAlert";
import Select from "react-select";
import { Formik } from "formik";
import Modaljs from "../../../components/Modal";
import { FaClipboardCheck } from "react-icons/fa";

export default function RetentionProcess() {
  const { t } = useTranslation();
  const [allComplaints, setAllComplaints] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");
  const [showDiscard, setShowDiscard] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [showApproveAndId, setShowApproveAndId] = useState("");
  const [pv_number, setPv_number] = useState("");
  const [ro_number, setRo_number] = useState("");
  const [po_number, setPo_number] = useState("");
  const [allRo, setAllRo] = useState([]);
  const [retention_id, setRetention_id] = useState("");
  const [allRetention, setAllRetention] = useState([]);
  const [allPo, setAllPo] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const navigate = useNavigate();

  const fetchAllInvoices = async () => {
    const status = "2";
    const res = await getAllEligibleAndDoneRetentions(
      status,
      pageSize,
      pageNo,
      search,
      po_number,
      ro_number,
      retention_id
    );

    if (res.status) {
      setAllComplaints(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllComplaints([]);
      setPageDetail({});
    }
  };

  const fetchAllRo = async () => {
    const status = "2";
    const res = await getAllRoListing(status, po_number);
    if (res.status) {
      setAllRo(res.data);
    } else {
      setAllRo([]);
    }
  };
  const fetchAllRetention = async () => {
    const status = "2";
    const res = await getAllRetentionIdListing(status, ro_number);
    if (res.status) {
      setAllRetention(res.data);
    } else {
      setAllRetention([]);
    }
  };

  const handleSelect = (id) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(selectedInvoices.filter((item) => item !== id));
    } else {
      setSelectedInvoices([...selectedInvoices, id]);
    }
  };

  const handleSelectAll = (check) => {
    if (check) {
      const allItemId = allComplaints.map((item) => item.id);
      setSelectedInvoices(allItemId);
    } else setSelectedInvoices([]);
  };

  const fetchAllPoNumber = async () => {
    const status = "2";
    const res = await getAllPONumber(status);
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      payment_reference_number: values.payment_reference_number,
      amount: values.amount,
      date: values.date,
      id: showApproveAndId,
      status: 3,
    };
    // return console.log("sData1", sData);
    const res = await approveRetentionAmount(sData);
    if (res.status) {
      toast.success(res.message);
      setAllComplaints((prev) =>
        prev.filter((itm) => itm.id !== showApproveAndId)
      );
      setPageDetail({
        ...pageDetail,
        total: +pageDetail.total - 1,
        pageEndResult: pageDetail.pageEndResult - 1,
      });
    } else {
      toast.error(res.message);
    }
    resetForm();
    setShowApproveAndId("");
    setSubmitting(false);
  };

  const handleDiscard = async () => {
    const res = await discardRetentions(showDiscard);
    if (res.status) {
      toast.success(res.message);
      setRefresh((e) => !e);
    } else {
      toast.error(res.message);
    }
    setShowDiscard("");
  };

  useEffect(() => {
    fetchAllInvoices();
    fetchAllRo();
    fetchAllPoNumber();
    fetchAllRetention();
  }, [refresh, po_number, ro_number, retention_id]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };
  return (
    <>
      <Row className="p-2">
        <Col md={3}>
          <Select
            placeholder={t("select po")}
            menuPortalTarget={document.body}
            isDisabled={ro_number}
            options={allPo.map((data) => ({
              label: data.po_number,
              value: data.id,
            }))}
            onChange={(e) => {
              setPo_number(e ? e.value : "");
            }}
            isClearable
          />
        </Col>
        <Col md={3}>
          <Select
            placeholder={t("select ro")}
            menuPortalTarget={document.body}
            isDisabled={retention_id}
            options={allRo.map((data) => ({
              label: data.regional_office_name,
              value: data.id,
            }))}
            onChange={(e) => {
              setRo_number(e ? e.value : "");
            }}
            isClearable
          />
        </Col>
        <Col md={3}>
          <Select
            placeholder={t("select retention")}
            menuPortalTarget={document.body}
            options={allRetention.map((data) => ({
              label: data.retention_unique_id,
              value: data.retention_unique_id,
            }))}
            onChange={(e) => {
              setRetention_id(e ? e.value : "");
            }}
            isClearable
          />
        </Col>
      </Row>

      <div className="d-flex justify-content-end ">
        {selectedInvoices.length > 0 && (
          <button
            className="shadow border-0 purple-combo cursor-pointer px-4 py-1 mx-3"
            onClick={() =>
              navigate(`/approve-retention`, {
                state: {
                  ids: selectedInvoices,
                },
              })
            }
          >
            <FaClipboardCheck />
            approve Retention
          </button>
        )}
      </div>
      <div className="p-3">
        <div className="table-scroll my-2  ">
          <Table className="text-body Roles">
            <thead className="text-truncate">
              <tr>
                {allComplaints.length > 0 && po_number && ro_number && (
                  <th>
                    <Form.Check
                      onClick={(e) => handleSelectAll(e.target.checked)}
                      checked={allComplaints.every((item) =>
                        selectedInvoices.includes(item.id)
                      )}
                    ></Form.Check>
                  </th>
                )}
                <th>{t("s.no.")}</th>
                <th className="text-wrap">{t("retention unique id")}</th>
                <th>{t("Bill number")}</th>
                <th style={{ minWidth: "80px" }}>{t("Bill Date")}</th>
                <th style={{ minWidth: "140px" }}>{t("Outlet Name")}</th>
                <th style={{ minWidth: "120px" }}>{t("outlet code")}</th>
                <th style={{ minWidth: "120px" }}>{t("sales area")}</th>
                <th>{t("ro")}</th>
                <th style={{ minWidth: "150px" }}>{t("complain type")}</th>
                <th style={{ minWidth: "150px" }}>{t("complain code")}</th>
                <th>{t("po number")}</th>
                <th>{t("callup number")}</th>
                <th>{t("voucher number")}</th>
                <th>{t("voucher date")}</th>
                <th>{t("voucher amount")}</th>

                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {allComplaints?.length > 0 ? null : (
                <tr>
                  <td colSpan={12}>
                    <img
                      className="p-3"
                      alt="no-result"
                      width="210"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </td>
                </tr>
              )}

              {allComplaints?.map((data, idx) => (
                <tr key={idx}>
                  {po_number && ro_number && (
                    <td>
                      <Form.Check
                        checked={selectedInvoices.includes(data.id)}
                        onClick={() => handleSelect(data.id)}
                      ></Form.Check>
                    </td>
                  )}
                  <td>{idx + 1}</td>
                  <td>{data?.retention_unique_id ?? "--"}</td>
                  <td>{data?.invoice_no ?? "--"}</td>
                  <td>{data?.invoice_date ?? "--"}</td>
                  <td>
                    {data?.outletDetails.map((data) => (
                      <li>{data.outlet_name}</li>
                    ))}
                  </td>
                  <td>
                    {data?.outletDetails.map((data) => (
                      <li>{data.outlet_unique_id}</li>
                    ))}
                  </td>
                  <td>
                    {data?.salesAreaDetails.map((data) => (
                      <li>{data.sales_area_name}</li>
                    ))}
                  </td>

                  <td>{data?.ro_name ?? "--"}</td>
                  <td>
                    {data?.complaintDetails.map((data) => (
                      <li>{data.complaint_type_name}</li>
                    ))}
                  </td>
                  <td>
                    {data?.complaintDetails.map((data) => (
                      <li>{data.complaint_id}</li>
                    ))}
                  </td>
                  <td>{data?.po_number ?? "--"}</td>
                  <td>{data?.callup_number ?? "--"}</td>
                  <td>{data?.pv_number ?? "--"}</td>
                  <td>{data?.pv_date ?? "--"}</td>
                  <td>₹{data?.pv_amount ?? "--"}</td>

                  <td>
                    <ActionButton
                      hideDelete={"d-none"}
                      hideEdit={"d-none"}
                      eyeOnclick={() =>
                        navigate(`/view-retention-money`, {
                          state: {
                            id: data?.id,
                          },
                        })
                      }
                      rejectOnclick={() => {
                        setShowDiscard(data.id);
                      }}
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
                    pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
                  }
                  nextClassName={
                    pageSize == pageDetail?.total
                      ? allComplaints.length - 1 < pageSize
                        ? "danger-combo-disable pe-none"
                        : "success-combo"
                      : allComplaints.length < pageSize
                      ? "danger-combo-disable pe-none"
                      : "success-combo"
                  }
                  title={`Showing ${pageDetail?.pageStartResult || 0} to ${
                    pageDetail?.pageEndResult || 0
                  } of ${pageDetail?.total || 0}`}
                  handlePageSizeChange={handlePageSizeChange}
                  prevonClick={() => setPageNo(pageNo - 1)}
                  nextonClick={() => setPageNo(pageNo + 1)}
                />
              </td>
            </tfoot>
          </Table>

          <ConfirmAlert
            size={"sm"}
            deleteFunction={handleDiscard}
            hide={setShowDiscard}
            show={showDiscard}
            title={"Confirm Discard"}
            description={"Are you sure you want to discard this!!"}
          />
        </div>
      </div>
    </>
  );
}
