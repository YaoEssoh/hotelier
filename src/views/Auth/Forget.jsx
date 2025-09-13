import React, { useState } from "react";
import Swal from "sweetalert2";
import api from "../../services/api";


function Forget() {
  const [Email, setEmail] = useState({ email: "" });

  const OnchangeHandler = (e) => {
    setEmail({ ...Email, [e.target.name]: e.target.value });
  };

  const Forgot = async (event) => {
    event.preventDefault();
    try {
      const response = await api.Forgot(Email); // Assurez-vous d'avoir une méthode API pour gérer l'oubli

      Swal.fire({
        icon: "success",
        title: "Email Sent!",
        text: "Please check your email for the password reset link",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error sending email:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to send reset email",
        confirmButtonColor: "#d33",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="wrapper">
      <section className="login-content">
        <div className="container">
          <div className="row align-items-center justify-content-center height-self-center">
            <div className="col-lg-8">
              <div className="card auth-card">
                <div className="card-body p-0">
                  <div className="d-flex align-items-center auth-content">
                    <div className="col-lg-6 bg-primary content-left">
                      <div className="p-3">
                        <h2 className="mb-2 text-white">Reset Password</h2>
                        <p>
                          Enter your email address and we'll send you an email
                          with instructions to reset your password.
                        </p>
                        <form onSubmit={Forgot}>
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="floating-label form-group">
                                <input
                                  className="floating-input form-control"
                                  type="email"
                                  name="email"
                                  value={Email.email}
                                  onChange={OnchangeHandler}
                                  placeholder=" "
                                />
                                <label>Email</label>
                              </div>
                            </div>
                          </div>
                          <button type="submit" className="btn btn-white">
                            Reset
                          </button>
                        </form>
                      </div>
                    </div>
                    <div className="col-lg-6 content-right">
                      <img
                        src="../assets/images/login/01.png"
                        className="img-fluid image-right"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Forget;
