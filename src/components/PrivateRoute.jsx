import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  /*   const user=localStorage.getItem('persist:token')
    console.log("userrrrr private route" , user)
    const userJson = JSON.parse(user)
        console.log("userrrrrJson private route" , userJson)
    const userNull =  userJson?.user
    console.log("userrrrrNull private route" , userNull) */
  //const parsedUser=user ? JSON.parse(user) :null
  const user = localStorage.getItem("user");
  if (!user /*|| !parsedUser || parsedUser.user.item!=="entreprise"*/) {
    return <Navigate to={"/login"}></Navigate>;
  } else {
    return children;
  }
};

export default PrivateRoute;
