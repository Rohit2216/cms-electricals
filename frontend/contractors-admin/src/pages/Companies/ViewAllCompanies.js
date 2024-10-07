import React, { useEffect, useState } from "react";
import { Badge, Col, Row, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import CardComponent from "../../components/CardComponent";
import { getAdminAllCompaniesData } from "../../services/authapi";
import { useTranslation } from "react-i18next";

const ViewAllCompanies = () => {
  const [detailsData, setDetailsData] = useState({});
  const [gstDetails, setGSTDetails] = useState([]);
  const { id } = useParams();
  const { t } = useTranslation();

  const fetchMyCompaniesDetailsData = async () => {
    const res = await getAdminAllCompaniesData(id);
    if (res.status) {
      setDetailsData(res.data);
      setGSTDetails(res.data.gst_details);
    } else {
      setDetailsData([]);
    }
  };

  const dataValue = [
    { id: 1, name: "Company Name", value: detailsData?.company_name },
    { id: 2, name: "Company Email", value: detailsData?.company_email },
    { id: 3, name: "Company Contact", value: detailsData?.company_contact },
    { id: 4, name: "Company Mobile", value: detailsData?.company_mobile },
    { id: 5, name: "Company Address", value: detailsData?.company_address },
    {
      id: 6,
      name: "Company Contact Person",
      value: detailsData?.company_contact_person,
    },
    {
      id: 7,
      name: "primary contact number",
      value: detailsData?.primary_contact_number,
    },
    {
      id: 8,
      name: "primary contact email",
      value: detailsData?.primary_contact_email,
    },
    { id: 9, name: "designation", value: detailsData?.designation },
    { id: 10, name: "department", value: detailsData?.department },
    { id: 11, name: "Company Website", value: detailsData?.company_website },
    {
      id: 12,
      name: "GST Treatment Type",
      value: detailsData?.gst_treatment_type,
    },
    {
      id: 13,
      name: "business legal name",
      value: detailsData?.business_legal_name,
    },
    {
      id: 14,
      name: "business trade name",
      value: detailsData?.business_trade_name,
    },
    { id: 15, name: "pan number", value: detailsData?.pan_number },
    { id: 16, name: "place of supply", value: detailsData?.place_of_supply },
    {
      id: 17,
      name: "Enable Company Login",
      value: detailsData?.is_company_login_enable === "1" ? "Yes" : "No",
    },
    { id: 18, name: "Email", value: detailsData?.email },
    { id: 19, name: "Password", value: detailsData?.password },
  ];

  useEffect(() => {
    fetchMyCompaniesDetailsData();
  }, []);

  return (
    <Col md={12} className="last-child-none" data-aos={"fade-up"}>
      <CardComponent
        className={"after-bg-light"}
        title={`${detailsData.company_name} - ${t("Details")}`}
      >
        <Row className="g-3">
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Company Details")}</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    {dataValue.map((input, ida) =>
                      input.value ? (
                        <tr key={ida}>
                          <th>{t(input.name)} :</th>
                          <td>{input.value}</td>
                        </tr>
                      ) : null
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("GST Details")}</strong>
              <div className="mt-2">
                <Table className="table-sm table Roles">
                  <thead>
                    <tr>
                      <th>{t("Sr No.")}</th>
                      <th>{t("gst number")}</th>
                      <th>{t("billings address")}</th>
                      <th>{t("shipping address")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gstDetails?.map((itm, idx) => (
                      <tr key={idx}>
                        <td>
                          {idx + 1}{" "}
                          {itm.is_default == "1" && (
                            <Badge bg="secondary">{t("Default")}</Badge>
                          )}
                        </td>
                        <td>{itm.gst_number}</td>
                        <td>{itm.billing_address}</td>
                        <td>{itm.shipping_address}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        </Row>
      </CardComponent>
    </Col>
  );
};

export default ViewAllCompanies;
