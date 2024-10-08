import React, { useEffect, useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import {
  BsCalendarDate,
  BsEnvelope,
  BsGeoAlt,
  BsGlobe2,
  BsLightningCharge,
  BsPhoneVibrate,
  BsPlus,
} from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import ActionButton from "../../components/ActionButton";
import Modaljs from "../../components/Modal";
import { Helmet } from "react-helmet";
import ImageViewer from "../../components/ImageViewer";
import { Formik } from "formik";
import { addContractorUserSchema } from "../../utils/formSchema";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import moment from "moment";
import { useLocation } from "react-router-dom";
import {
  addUserContractors,
  deleteAdminContractors,
  getAdminContractors,
  getAdminSingleContractors,
  updateAdminContractors,
} from "../../services/authapi";

const ContractorUsers = () => {
  const { state } = useLocation();
  const contractor = state;
  const [Contractors, setContractors] = useState(false);
  const [detailShow, setDetailShow] = useState(false);
  const [allContractors, setAllContractors] = useState();
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [adminID, setAdminID] = useState("");

  const fetchContractorData = async () => {
    const res = await getAdminContractors();
    // return console.log(res);
    if (res.status) {
      const filterAdmin = res.data.filter(
        (item) => item.admin_id === contractor.admin_id
      );
      setAllContractors(filterAdmin[0].users);
    } else {
      setAllContractors([]);
    }
  };

  useEffect(() => {
    fetchContractorData();
    const idAdmin = contractor?.admin_id;
    setAdminID(idAdmin);
  }, []);

  // console.log('adminID', edit)
  // Edit Contractors User
  const handleEditDetailShow = async (id, user_type) => {
    const res = await getAdminSingleContractors(id, user_type);
    // set
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
    setDetailShow(true);
  };
  const handleEdit = async (id, user_type) => {
    const res = await getAdminSingleContractors(id, user_type);
    // set
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
    setContractors(true);
  };

  const handleDelete = async () => {
    const res = await deleteAdminContractors(idToDelete, "User");
    if (res.status) {
      toast.success(res.message);
      setAllContractors((prev) =>
        prev.filter((itm) => itm.admin_id !== +idToDelete)
      );
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleFileChange = (e, setFieldValue) => {
    if (e.target.files) {
      setFieldValue("image", e.target.files[0]);
    }
  };

  // Sumbit Form
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("joining_date", values.joining_date);
    formData.append("password", values.password);
    formData.append("id", edit?.admin_id || adminID);
    formData.append("contractor_id", adminID);
    formData.append("image", values.image);
    formData.append("status", values.status);
    formData.append("type", "User");

    if (edit?.admin_id) {
      formData.append("contact_no", values?.mobile);
    } else {
      formData.append("mobile", values.mobile);
    }
    // return console.log(values);

    const res = edit.admin_id
      ? await updateAdminContractors(formData)
      : await addUserContractors(formData);

    if (res.status) {
      fetchContractorData();
      toast.success(res.message);
      setContractors(false);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Contractor Users · CMS Electricals</title>
      </Helmet>
      <Col md={12}>
        <CardComponent
          title={"Contractor Users"}
          icon={<BsPlus />}
          onclick={() => {
            setEdit({});
            setContractors(true);
          }}
          tag={"Add"}
        >
          <Row className="g-3">
            <Col md={12}>
              <div className="p-2">
                <div className="shadow after-bg-light">
                  <div className="d-align h-100 p-3 gap-5 justify-content-start">
                    <div className="my-bg p-2 rounded-circle">
                      <img
                        className="border-blue object-fit rounded-circle"
                        height={100}
                        width={100}
                        src={`${process.env.REACT_APP_API_URL}${contractor?.image}`}
                        alt={contractor?.name}
                      />
                    </div>
                    <div className="d-grid gap-2">
                      <small
                        className={
                          contractor?.status === "1"
                            ? "text-green"
                            : "text-danger"
                        }
                      >
                        <BsLightningCharge />{" "}
                        {contractor?.status === "1" ? "Active" : "Inactive"}
                      </small>
                      <p className="mb-0 fw-bold">
                        {contractor?.name}{" "}
                        <small className="text-gray">
                          ({contractor?.user_type})
                        </small>
                      </p>
                      <small className="text-gray">
                        <BsEnvelope /> {contractor?.email}
                      </small>
                      <small className="text-gray">
                        <BsPhoneVibrate /> {contractor?.contact_no},{" "}
                        {contractor?.alt_number}
                      </small>
                      <small className="text-gray">
                        <BsGeoAlt /> {contractor?.address_1}, {contractor?.city}
                        , {contractor?.pin_code}
                      </small>
                      <small className="text-gray">
                        <BsGlobe2 /> {contractor?.country}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={12}>
              <div className="overflow-auto p-2">
                <Table className="text-body bg-new Roles p-0">
                  <thead className="text-truncate">
                    <tr>
                      {[
                        "Sr No.",
                        "Image",
                        "Name",
                        "Email",
                        "Contact No.",
                        "Status",
                        "Action",
                      ].map((thead) => (
                        <th key={thead}>{thead}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allContractors?.length > 0 ? null : (
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
                    {allContractors?.map((item2, id2) => (
                      <tr key={id2}>
                        <td>{id2 + 1}</td>
                        <td>
                          <ImageViewer
                            src={`${process.env.REACT_APP_API_URL}/${item2.image}`}
                          >
                            <img
                              width={50}
                              className="my-bg p-1 rounded"
                              src={`${process.env.REACT_APP_API_URL}/${item2.image}`}
                              alt={item2.name}
                            />
                          </ImageViewer>
                        </td>
                        <td>{item2?.name}</td>
                        <td>{item2?.email}</td>
                        <td>{item2?.contact_no}</td>
                        <td
                          className={`text-${
                            item2?.status == 1 ? "green" : "danger"
                          }`}
                        >
                          {item2?.status == 1 ? "Active" : "Inactive"}{" "}
                        </td>
                        <td>
                          <ActionButton
                            eyeOnclick={() =>
                              handleEditDetailShow(
                                item2.admin_id,
                                item2.user_type
                              )
                            }
                            deleteOnclick={() => {
                              setIdToDelete(`${item2.admin_id}`);
                              setShowAlert(true);
                            }}
                            editOnclick={() =>
                              handleEdit(item2.admin_id, item2.user_type)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </CardComponent>
      </Col>
      <Formik
        enableReinitialize={true}
        initialValues={{
          name: edit.name || "",
          email: edit.email || "",
          userType: edit.user_type_number || "",
          contractor_id: edit.contractor_id || "",
          password: edit.password || "",
          mobile: edit.mobile || "",
          joining_date: edit.joining_date
            ? moment(edit.joining_date).format("YYYY-MM-DD")
            : "",
          image: edit.image || null,
          status: edit.status || 1,
          // admin_id: edit.admin_id || "ss",
        }}
        validationSchema={addContractorUserSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            open={Contractors}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit.admin_id ? "Update" : "ADD"}
            close={() => setContractors(false)}
            title={edit.admin_id ? "Update Contractors" : "Add Contractors"}
            formikProps={props}
          >
            <Row className="g-2 align-items-end pb-1">
              <Form.Group as={Col} md={6}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name={"name"}
                  value={props.values.name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(props.touched.name && props.errors.name)}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name={"email"}
                  value={props.values.email}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(props.touched.email && props.errors.email)}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              {!edit.admin_id ? (
                <Form.Group as={Col} md={6}>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name={"password"}
                    value={props.values.password}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.password && props.errors.password
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
              ) : null}
              <Form.Group as={Col} md={6}>
                <Form.Label>Mobile No.</Form.Label>
                <Form.Control
                  maxLength={10}
                  type="text"
                  name={"mobile"}
                  value={props.values.mobile}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.mobile && props.errors.mobile
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.mobile}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Joining Date</Form.Label>
                <Form.Control
                  type="date"
                  name={"joining_date"}
                  value={props.values.joining_date}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.joining_date && props.errors.joining_date
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.joining_date}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name={"status"}
                  value={props.values.status}
                  onChange={props.handleChange}
                >
                  <option>--Select--</option>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} md={edit.admin_id ? 6 : 12}>
                <Form.Label>Image</Form.Label>
                <div
                  className={edit.admin_id && "d-flex align-items-center gap-2"}
                >
                  {edit.admin_id && (
                    <img
                      width={50}
                      className="my-bg p-1 rounded"
                      src={`${process.env.REACT_APP_API_URL}/${edit?.image}`}
                      alt={edit?.name}
                    />
                  )}
                  <Form.Control
                    type="file"
                    name={"image"}
                    onChange={(e) => handleFileChange(e, props.setFieldValue)}
                  />
                </div>
              </Form.Group>
            </Row>
          </Modaljs>
        )}
      </Formik>
      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />

      <Modaljs
        open={detailShow}
        size={"md"}
        closebtn={"Cancel"}
        hideFooter={"d-none"}
        close={() => setDetailShow(false)}
        title={"View Details"}
      >
        <div className="shadow m-2 after-bg-light">
          <div className="d-align h-100 p-3 gap-5 justify-content-start">
            <div className="my-bg p-2 rounded-circle">
              <img
                className="border-blue object-fit rounded-circle"
                height={100}
                width={100}
                src={`${process.env.REACT_APP_API_URL}${edit?.image}`}
                alt="User-Profile"
              />
            </div>
            <div className="d-grid gap-2">
              <small
                className={edit?.status === 1 ? "text-green" : "text-danger"}
              >
                <BsLightningCharge />{" "}
                {edit?.status === 1 ? "Active" : "Inactive"}
              </small>
              <p className="mb-0 fw-bold">
                {edit?.name}{" "}
                <small className="text-gray">({edit?.user_type})</small>
              </p>
              <small className="text-gray">
                <BsEnvelope /> {edit?.email}
              </small>
              <small className="text-gray">
                <BsPhoneVibrate /> {edit?.mobile}
              </small>
              <small className="text-gray">
                <BsCalendarDate /> {edit?.joining_date}
              </small>
            </div>
          </div>
        </div>
      </Modaljs>
    </>
  );
};

export default ContractorUsers;
