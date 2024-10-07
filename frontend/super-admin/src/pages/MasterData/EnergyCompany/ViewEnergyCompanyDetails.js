import React, { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import CardComponent from "../../../components/CardComponent";
import ImageViewer from "../../../components/ImageViewer";
import { getAdminSingleEnergy } from "../../../services/authapi";

const ViewEnergyCompanyDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState({});

  const fetchEnergyById = async () => {
    const res = await getAdminSingleEnergy(id);
    if (res.status) {
      setData(res.data);
    } else {
      setData({});
    }
  };

  useEffect(() => {
    fetchEnergyById();
  }, []);

  const dataValue = [
    { id: 1, name: "Address", value: data?.address_1 },
    { id: 2, name: "alt number", value: data?.alt_number },
    { id: 3, name: "city", value: data?.city },
    { id: 4, name: "company name", value: data?.company_name },
    { id: 5, name: "contact no", value: data?.contact_no },
    { id: 6, name: "country", value: data?.country },
    { id: 7, name: "description", value: data?.description },
    { id: 8, name: "email", value: data?.email },
    { id: 9, name: "gst number", value: data?.gst_number },
    { id: 11, name: "pin code", value: data?.pin_code },
    { id: 12, name: "regional office name", value: data?.regional_office_name },
    { id: 13, name: "sales area name", value: data?.sales_area_name },
    {
      id: 14,
      name: "status",
      value: +data.status == 1 ? "Active" : "InActive",
    },
    { id: 15, name: "username", value: data?.username },
    { id: 16, name: "website url", value: data?.website_url },
    { id: 17, name: "zone name", value: data?.zone_name },
  ];

  return (
    <>
      <Col md={12}>
        <CardComponent
          className={"after-bg-light"}
          title={`${data?.company_name} - details`}
        >
          {dataValue?.map((input, ida) =>
            input.value ? (
              <Form.Group key={ida} as={Row} className="mb-3">
                <Form.Label column sm={2}>
                  {input?.name}
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    className="fw-bolder"
                    value={input?.value}
                    disabled
                  />
                </Col>
              </Form.Group>
            ) : null
          )}

          <Col md={12}>
            <div className="overflow-auto p-2">
              <Table className="text-body bg-new Roles p-0">
                <thead className="text-truncate">
                  <tr>
                    {[
                      "Sr No.",
                      "User",
                      "Email",
                      "User Type",
                      "Contact No.",
                      "Status",
                    ].map((thead) => (
                      <th key={thead}>{thead}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.users?.length > 0 ? null : (
                    <tr>
                      <td colSpan={7}>
                        <img
                          className="p-3"
                          alt="no-result"
                          width="250"
                          src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                        />
                      </td>
                    </tr>
                  )}
                  {data?.users?.map((item2, id2) => (
                    <tr key={id2}>
                      <td>
                        {id2 + 1}
                        {console.log(item2, "item 2")}
                      </td>
                      <td>
                        <ImageViewer
                          src={
                            item2?.image
                              ? `${process.env.REACT_APP_API_URL}${item2?.image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                        >
                          <span className="d-flex align-items-center gap-2">
                            <img
                              width={30}
                              height={30}
                              className="my-bg object-fit p-1 rounded-circle"
                              src={
                                item2?.image
                                  ? `${process.env.REACT_APP_API_URL}${item2?.image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            />{" "}
                            <span className="d-grid">
                              {item2?.name}{" "}
                              <span>
                                {item2?.employee_id ? item2?.employee_id : null}
                              </span>
                            </span>
                          </span>
                        </ImageViewer>
                      </td>
                      <td>{item2?.email}</td>
                      <td>{item2?.user_type}</td>
                      <td>{item2?.contact_no}</td>
                      <td
                        className={`text-${
                          item2?.status == 0 ? "green" : "danger"
                        }`}
                      >
                        {item2?.status == 0 ? "Active" : "Inactive"}{" "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </CardComponent>
      </Col>
    </>
  );
};

export default ViewEnergyCompanyDetails;
