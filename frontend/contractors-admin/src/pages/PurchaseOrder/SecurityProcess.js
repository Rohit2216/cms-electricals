import React, { useEffect, useState } from "react";
import { Col, Table, Row, Form } from "react-bootstrap";
import { BsEyeFill, BsPlus, BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import ReactPagination from "../../components/ReactPagination";
import Modaljs from "../../components/Modal";
import ActionButton from "../../components/ActionButton";
import {
  deletePurchaseOrderById,
  getAllPoInSecurityEligible,
  getAllPurchaseOrder,
  getAllSecurityIdListing,
  getAllRoInSecurityEligible,
} from "../../services/contractorApi";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { FaClipboardCheck } from "react-icons/fa";

const SecurityProcess = () => {
  const [securityDeposit, setSecurityDeposit] = useState([]);
  const [viewDetails, setViewDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [singleData, setSingleData] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [allRo, setAllRo] = useState([]);
  const [roId, setRoId] = useState({ label: "", value: "" });
  const [allPo, setAllPo] = useState([]);
  const [poId, setPoId] = useState({ label: "", value: "" });
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [security_id, setSecurity_id] = useState("");
  const [allSecurity, setAllSecurity] = useState([]);

  const { t } = useTranslation();

  const navigate = useNavigate();

  const fetchSecurityDepositData = async () => {
    const po_status = 2;
    const status = "2";
    const res = await getAllPurchaseOrder(
      search,
      pageSize,
      pageNo,
      status,
      po_status,
      roId?.value,
      poId?.label,
      security_id
    );
    if (res.status) {
      setSecurityDeposit(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setSecurityDeposit([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deletePurchaseOrderById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setSecurityDeposit((prev) => prev.filter((itm) => itm.id !== idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowDelete(false);
  };

  const fetchAllRo = async () => {
    const status = 2;
    const res = await getAllRoInSecurityEligible(status);
    if (res.status) {
      setAllRo(res.data);
    } else {
      setAllRo([]);
    }
  };
  const fetchAllPo = async () => {
    const status = 2;
    const res = await getAllPoInSecurityEligible(status, roId.value);
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };
  const fetchAllSecurity = async () => {
    const status = 2;
    const res = await getAllSecurityIdListing(status, poId.label);
    console.log(res, "security");
    if (res.status) {
      setAllSecurity(res.data);
    } else {
      setAllSecurity([]);
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
      const allItemId = securityDeposit.map((item) => item.id);
      setSelectedInvoices(allItemId);
    } else setSelectedInvoices([]);
  };

  useEffect(() => {
    fetchSecurityDepositData();
  }, [search, pageNo, pageSize, roId.value, poId.value, security_id]);

  useEffect(() => {
    fetchAllPo();
    fetchAllRo();
    fetchAllSecurity();
  }, [poId.value, roId.value, security_id]);
  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>Security Deposit · CMS Electricals</title>
      </Helmet>
      <Row className="p-2">
        <span className="d-align mt-3 me-3 justify-content-end gap-2">
          <span className="position-relative">
            <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
            <Form.Control
              type="text"
              placeholder={t("Search")}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="me-2"
              aria-label="Search"
            />
          </span>
        </span>
        <Col md={3}>
          <Select
            placeholder={t("select ro")}
            menuPortalTarget={document.body}
            isDisabled={poId.value}
            options={allRo?.map((data) => ({
              label: data.regional_office_name,
              value: data.id,
            }))}
            value={roId.value && roId}
            onChange={(e) => {
              if (e) {
                setRoId({ value: e?.value, label: e?.label });
              } else {
                setRoId({});
              }
            }}
            isClearable
          />
        </Col>
        <Col md={3}>
          <Select
            placeholder={t("select po")}
            menuPortalTarget={document.body}
            isDisabled={security_id}
            options={allPo?.map((data) => ({
              label: data.po_number,
              value: data.id,
            }))}
            value={poId.value && poId}
            onChange={(e) => {
              if (e) {
                setPoId({ value: e?.value, label: e?.label });
              } else {
                setPoId({});
              }
            }}
            isClearable
          />
        </Col>

        <Col md={3}>
          <Select
            placeholder={t("select Security")}
            menuPortalTarget={document.body}
            options={allSecurity.map((data) => ({
              label: data.security_unique_id,
              value: data.security_unique_id,
            }))}
            onChange={(e) => {
              setSecurity_id(e ? e.value : "");
            }}
            isClearable
          />
        </Col>
      </Row>
      <div className="d-flex justify-content-end">
        {roId?.value && selectedInvoices.length > 0 && (
          <button
            className="shadow border-0 purple-combo cursor-pointer px-4 py-1 me-4"
            onClick={() =>
              navigate(`/purchaseOrder/security-eligible/approve`, {
                state: {
                  id: selectedInvoices,
                },
              })
            }
          >
            <FaClipboardCheck />
            {t("Approve")}
          </button>
        )}
      </div>
      <div className="overflow-auto p-3 mb-2">
        <Table className="text-body bg-new Roles">
          <thead className="text-truncate">
            <tr>
              {roId?.value && securityDeposit.length > 0 && (
                <th>
                  <Form.Check
                    onClick={(e) => handleSelectAll(e.target.checked)}
                    checked={securityDeposit.every((item) =>
                      selectedInvoices.includes(item.id)
                    )}
                  ></Form.Check>
                </th>
              )}
              <th>{t("Sr No.")}</th>
              <th>{t("Security Unique Id")}</th>
              <th>{t("po number")}</th>
              <th>{t("Tender Date")}</th>
              <th>{t("Tender Number")}</th>
              <th>{t("security deposit date")}</th>
              <th>{t("security deposit amount")}</th>
              <th>{t("regional office name")}</th>
              <th>{t("Status")}</th>
              <th>{t("Action")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <td colSpan={10}>
                <img
                  className="p-3"
                  width="250"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                  alt={t("Loading")}
                />
              </td>
            ) : securityDeposit.length > 0 ? (
              <>
                {securityDeposit.map((data, id1) => (
                  <tr key={id1}>
                    {roId?.value && (
                      <td>
                        <Form.Check
                          checked={selectedInvoices.includes(data.id)}
                          onClick={() => handleSelect(data.id)}
                        ></Form.Check>
                      </td>
                    )}
                    <td>{serialNumber[id1]}</td>
                    <td>{data.security_unique_id}</td>
                    <td>{data.po_number}</td>
                    <td>{data.tender_date}</td>
                    <td>{data.tender_number}</td>
                    <td>{data.security_deposit_date}</td>
                    <td>{data.security_deposit_amount}</td>
                    <td>{data.regional_office_name}</td>
                    <td className={`text-${"green"}`}>Process</td>

                    <td>
                      <ActionButton
                        hideDelete={"d-none"}
                        hideEdit={"d-none"}
                        eyeOnclick={() =>
                          navigate(`/PurchaseOrder/security-deposit/view`, {
                            state: {
                              id: data.id,
                            },
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <td colSpan={10}>
                <img
                  className="p-3"
                  alt="no-result"
                  width="250"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                />
              </td>
            )}
          </tbody>
          <ConfirmAlert
            size={"sm"}
            deleteFunction={handleDelete}
            hide={setShowDelete}
            show={showDelete}
            title={"Confirm Delete"}
            description={"Are you sure you want to delete this!!"}
          />
        </Table>
      </div>
      <ReactPagination
        pageSize={pageSize}
        prevClassName={
          pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
        }
        nextClassName={
          pageSize == pageDetail?.total
            ? securityDeposit.length - 1 < pageSize
              ? "danger-combo-disable pe-none"
              : "success-combo"
            : securityDeposit.length < pageSize
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
    </>
  );
};

export default SecurityProcess;
