import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  /*     const user=localStorage.getItem('persist:token')
    console.log("userrrrr PUBLIC route" , user)
    const userJson = JSON.parse(user)
        console.log("userrrrrJson PUBLIC route" , userJson)
    const userNull =  userJson?.user
    console.log("userrrrrNull PUBLIC route" , userNull) */
  const user = localStorage.getItem("user");

  if (user) {
    return <Navigate to={"/"}></Navigate>;
  } else {
    return children;
  }
};

export default PublicRoute;
