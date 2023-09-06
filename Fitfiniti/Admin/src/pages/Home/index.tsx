import React, { useEffect } from "react";
import {
  Page,
  Masthead,
  MastheadToggle,
  MastheadMain,
  PageSidebar,
  PageSidebarBody,
  PageToggleButton,
  NavItem,
  Nav,
  NavList,
} from "@patternfly/react-core";
import BarsIcon from "@patternfly/react-icons/dist/esm/icons/bars-icon";
import logoCelo from "./../../assets/LogoCelo.png";
import { FiUsers } from "react-icons/fi";
import {LuLayoutDashboard} from 'react-icons/lu'
import {AiOutlineShopping} from 'react-icons/ai'
import {BsFiles, BsBook} from 'react-icons/bs';
import {GoSignOut} from 'react-icons/go';
import Dashboard from "./../../components/Dashboard";
import Proizvodi from "../../components/Proizvodi";
import Kategorije from "../../components/Kategorije";
import Objave from "../../components/Objave";
import Users from "../../components/Korisnici";
import { useNavigate } from "react-router-dom";

import "./Home.css";


const Home: React.FunctionComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const [activeItem, setActiveItem] = React.useState(0);

  const navigate = useNavigate();
  const onSelect = (
    _event: React.FormEvent<HTMLInputElement>,
    result: { itemId: number | string }
  ) => {
    setActiveItem(result.itemId as number);
  };

  const onSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (sessionStorage.getItem("token") === null) {
      navigate("/login");
    }
  }, []);
  const header = (
    <Masthead className="navbar">
      <MastheadToggle>
        <PageToggleButton
          variant="plain"
          aria-label="Global navigation"
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={onSidebarToggle}
          id="vertical-nav-toggle"
          style={{ color: "black" }}>
          <BarsIcon />
        </PageToggleButton>
      </MastheadToggle>
      <MastheadMain>
        <img style={{ width: "130px", height: "50px" }} src={logoCelo} />
      </MastheadMain>
    </Masthead>
  );

  const sidebar = (
    <PageSidebar
      isSidebarOpen={isSidebarOpen}
      id="vertical-sidebar"
      className="sidebar">
      <PageSidebarBody>
        <Nav
          onSelect={onSelect}
          aria-label="Default global"
          ouiaId="DefaultNav"
          className="navigation">
          <NavList>
            <NavItem
              preventDefault
              id="nav-default-link1"
              to="#nav-default-link1"
              itemId={0}
              isActive={activeItem === 0}
              className={`${activeItem === 0 ? "active" : ""} `}>
                <LuLayoutDashboard />
              Dashboard
            </NavItem>
            <NavItem
              preventDefault
              id="nav-default-link2"
              to="#nav-default-link2"
              itemId={1}
              isActive={activeItem === 1}
              className={`${activeItem === 1 ? "active" : ""} `}>
              <FiUsers />
              Korisnici
            </NavItem>
            <NavItem
              preventDefault
              id="nav-default-link3"
              to="#nav-default-link3"
              itemId={2}
              isActive={activeItem === 2}
              className={`${activeItem === 2 ? "active" : ""} `}>
                <AiOutlineShopping />
              Proizvodi
            </NavItem>
            <NavItem
              preventDefault
              id="nav-default-link4"
              to="#nav-default-link4"
              itemId={3}
              isActive={activeItem === 3}
              className={`${activeItem === 3 ? "active" : ""} `}>
                <BsFiles />
              Kategorije
            </NavItem>
            <NavItem
              preventDefault
              id="nav-default-link5"
              to="#nav-default-link5"
              itemId={4}
              isActive={activeItem === 4}
              className={`${activeItem === 4 ? "active" : ""} `}>
                <BsBook />
              Objave
            </NavItem>
            <NavItem
              preventDefault
              id="nav-default-link6"
              href="/login"
              itemId={5}
              isActive={activeItem === 5}
              className={`${activeItem === 5 ? "active" : ""} `}
              onClick={() => {
                sessionStorage.removeItem("token");
                window.location.reload();
              }}>
                <GoSignOut />
              Odjavi se
            </NavItem>
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );

  return (
    <Page header={header} sidebar={sidebar}>
      {activeItem === 0 && <Dashboard />}
      {activeItem === 1 && <Users />}
      {activeItem === 2 && <Proizvodi />}
      {activeItem === 3 && <Kategorije />}
      {activeItem === 4 && <Objave />}
    </Page>
  );
};

export default Home;
