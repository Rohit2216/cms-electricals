import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { BsArrowLeft, BsSearch } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";

const CardComponent = ({
  title,
  onclick,
  custom,
  align,
  link,
  classbody,
  className,
  shadow,
  headclass,
  heading2,
  children,
  icon,
  custom2,
  search,
  searchOnChange,
  backButton = true,
  hideButton = true,
  tag,
}) => {
  const { t } = useTranslation();
  const history = useNavigate();
  const { id } = useParams();
  return (
    <Card className={`card-bg h-100 ${className}`}>
      <Card.Header
        className={`${align} d-md-flex align-items-center justify-content-between bg-transparent border-primary p-3`}
        title={title}
      >
        <strong className={`d-align justify-content-between ${headclass}`}>
          {id && backButton ? (
            <BsArrowLeft
              title="back"
              fontSize={22}
              onClick={() => history(-1)}
              className="me-2 cursor-pointer"
            />
          ) : null}
          {t(title)} {heading2}
        </strong>
        <span className="d-md-flex d-grid align-items-center justify-content-between gap-2">
          {custom}
          {search && (
            <span className="position-relative">
              <BsSearch className="d-none d-md-block position-absolute top-50 me-3 end-0 translate-middle-y" />
              <Form.Control
                type="text"
                placeholder="Search..."
                onChange={searchOnChange}
                className="me-2"
                aria-label="Search"
              />
            </span>
          )}
          {hideButton && (
            <Button
              as={link ? Link : null}
              to={link}
              variant="light"
              className={`text-none view-btn shadow rounded-0 px-1 text-orange ${shadow}`}
              onClick={onclick}
            >
              {icon}
              {t(tag)}
            </Button>
          )}
          {custom2}
        </span>
      </Card.Header>
      <Card.Body className={classbody}>{children}</Card.Body>
    </Card>
  );
};

export default CardComponent;
