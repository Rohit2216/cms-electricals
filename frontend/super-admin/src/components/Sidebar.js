import React, { Fragment } from "react";
import { Accordion, Nav, Spinner } from "react-bootstrap";
import { BsRecord2 } from "react-icons/bs";
import { NavLink, useLocation } from "react-router-dom";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import {
  getAdminAllEnableDisable,
  getAllModuleByRoleId,
} from "../services/authapi";
import { useState } from "react";
import { useEffect } from "react";
import { getIcons } from "../constants/getIcons";
import { findActiveDropdownId, findActiveSubDropdownId } from "../constants";
import { selectUser } from "../features/auth/authSlice";
import { useSelector } from "react-redux";

const JsSidebar = () => {
  const { user, userPermission } = useSelector(selectUser);

  const { pathname } = useLocation();

  const [sidebarData, setSidebarData] = useState([]);
  const fetchAllData = async () => {
    // const res = await getAdminAllEnableDisable();
    const res = await getAllModuleByRoleId(user?.id);

    if (res.status) {
      setSidebarData(res.data);
    } else {
      setSidebarData([]);
    }
  };

  const checkRolesAndPermission = (module, subModule, subSubModule) => {
    const data = userPermission.find((itm) => itm.title == module);

    if (subModule && subSubModule == null) {
      return data.submodules.find((itm2) => itm2.title == subModule);
    } else if (subSubModule) {
      const data3 = data.submodules
        .find((itm2) => itm2.title == subModule)
        .modulesOfSubModule.find((itm3) => itm3.title == subSubModule);
      return data3;
    } else return data;
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (sidebarData.length == 0) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="secondary" size="sm" /> PLEASE
        WAIT...
      </div>
    );
  }

  return (
    <section className="sidebar">
      <SimpleBar color="red" className="area">
        <Accordion
          defaultActiveKey={findActiveDropdownId(sidebarData, pathname) || 0}
        >
          <Nav className="d-grid gap-2 pe-3 ps-2 pt-3 mb-3">
            {sidebarData?.map((e) => (
              <Fragment key={e.id}>
                {e?.submodules?.length > 0 ? (
                  <Accordion.Item eventKey={e.id}>
                    <Accordion.Header title={e.title}>
                      <div className="d-grid">
                        <div className="text-truncate">
                          <span className="me-2">{getIcons(e.icon)}</span>
                          {e.title}
                        </div>
                      </div>
                    </Accordion.Header>

                    <Accordion.Body className="last-child-none d-grid p-2">
                      <React.Fragment>
                        {e?.submodules?.map((body) => (
                          <Fragment key={body.id}>
                            {body?.modulesOfSubModule?.length > 0 ? (
                              <Accordion
                                defaultActiveKey={
                                  findActiveSubDropdownId(body, pathname) || 0
                                }
                              >
                                <Accordion.Item eventKey={body.id}>
                                  <Accordion.Header title={body.title}>
                                    <div className="d-grid">
                                      <div className="text-truncate">
                                        {body.title}
                                      </div>
                                    </div>
                                  </Accordion.Header>
                                  <Accordion.Body className="last-child-none d-grid p-2">
                                    <React.Fragment>
                                      {body?.modulesOfSubModule?.map((bb) =>
                                        checkRolesAndPermission(
                                          e.title,
                                          body.title,
                                          bb.title
                                        )?.view ? (
                                          <NavLink
                                            to={bb.path}
                                            className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
                                            key={bb.id}
                                            title={bb.title}
                                          >
                                            <BsRecord2 /> {bb.title}
                                          </NavLink>
                                        ) : null
                                      )}
                                    </React.Fragment>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            ) : checkRolesAndPermission(e.title, body.title)
                                .view ? (
                              <NavLink
                                to={body.path}
                                className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
                                title={body.title}
                              >
                                <BsRecord2 /> {body.title}
                              </NavLink>
                            ) : null}
                          </Fragment>
                        ))}
                      </React.Fragment>
                    </Accordion.Body>
                  </Accordion.Item>
                ) : (
                  <NavLink
                    to={e.path}
                    className="text-start my-bg-shadow r-5 text-gray text-truncate text-decoration-none"
                    style={{ padding: ".6rem .7rem" }}
                    title={e.title}
                  >
                    <span className="me-2">{getIcons(e.icon)}</span>
                    {e.title}
                  </NavLink>
                )}
              </Fragment>
            ))}
          </Nav>
        </Accordion>
      </SimpleBar>
    </section>
  );
};

export default JsSidebar;
