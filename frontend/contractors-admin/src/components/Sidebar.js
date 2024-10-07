import React from "react";
import { Accordion, Nav } from "react-bootstrap";
import { BsRecord2 } from "react-icons/bs";
import { NavLink, useLocation } from "react-router-dom";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import {
  findActiveDropdownId,
  findActiveSubDropdownId,
  menubar,
} from "../constants";
import { useTranslation } from "react-i18next";

const JsSidebar = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <section className="sidebar">
      <SimpleBar color="red" className="area">
        <Accordion
          defaultActiveKey={findActiveDropdownId(menubar, pathname) || 0}
        >
          <Nav className="d-grid gap-2 pe-3 ps-2 pt-3 mb-3">
            {menubar.map((menu, idx) => (
              <React.Fragment key={idx}>
                {menu.nav?.map((item, ida) => (
                  <NavLink
                    to={item.url}
                    key={ida}
                    className="text-start my-bg-shadow r-5 text-gray text-truncate text-decoration-none"
                    style={{ padding: ".6rem .7rem" }}
                    title={item.menu}
                  >
                    <span className="me-2">{item.icon}</span>
                    {t(item.menu)}
                  </NavLink>
                ))}
                {menu.drop?.map((content, idc) => (
                  <Accordion.Item key={idc} eventKey={menu.id}>
                    <Accordion.Header title={content.title}>
                      <div className="d-grid">
                        <div
                          className="text-truncate"
                          onClick={() => {
                            localStorage.setItem("last_tab", "2");
                          }}
                        >
                          <span className="me-2">{content.nesicon}</span>
                          {t(content.title)}
                        </div>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body className="last-child-none active-sidebar d-grid p-2">
                      {content.dropmenu?.map((body, str) => (
                        <React.Fragment key={str}>
                          {body.smenu?.map((body, idd) => (
                            <NavLink
                              to={body.url}
                              className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
                              key={idd}
                              title={body.nestitle}
                              onClick={() => {
                                localStorage.setItem("last_tab", "2");
                              }}
                            >
                              <BsRecord2 /> {t(body.nestitle)}
                            </NavLink>
                          ))}
                          <Accordion
                            defaultActiveKey={findActiveSubDropdownId(
                              body,
                              pathname
                            )}
                          >
                            {body.submenu?.map((menu2, iuu) => (
                              <Accordion.Item
                                key={iuu}
                                className={menu2.className}
                                eventKey={menu2.id}
                              >
                                <Accordion.Header title={menu2.title}>
                                  <div className="d-grid">
                                    <div className="text-truncate">
                                      <span className="me-2">{menu2.icon}</span>
                                      {t(menu2.title)}
                                    </div>
                                  </div>
                                </Accordion.Header>
                                <Accordion.Body className="last-child-none d-grid p-2">
                                  {menu2.smenu2?.map((menu, iyy) => (
                                    <NavLink
                                      to={menu.url2}
                                      className="px-0 d-block hr-border2 py-2 text-gray text-truncate text-decoration-none"
                                      key={iyy}
                                      title={menu.title2}
                                    >
                                      <BsRecord2 /> {t(menu.title2)}
                                    </NavLink>
                                  ))}
                                </Accordion.Body>
                              </Accordion.Item>
                            ))}
                          </Accordion>
                        </React.Fragment>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </React.Fragment>
            ))}
          </Nav>
        </Accordion>
      </SimpleBar>
    </section>
  );
};

export default JsSidebar;
