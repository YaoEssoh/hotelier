import React from "react";
import SideBar from "../../components/SideBar";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { Outlet } from "react-router-dom";

function Home() {
  return (
    <div>
      {/* Wrapper Start */}
      <SideBar />
      <NavBar />
  <Outlet/>
      <Footer />
    </div>
  );
}

export default Home;
