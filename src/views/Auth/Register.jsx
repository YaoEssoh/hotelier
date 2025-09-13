import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import api from "../../services/api";

const MySwal = withReactContent(Swal);

function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motsDePass: "",
    confirmPassword: "",
    numero: "",
    adress: "",
    role: "hotelier",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs
    if (formData.motsDePass !== formData.confirmPassword) {
      MySwal.fire({
        title: "Error!",
        text: "Passwords do not match",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);

    try {
      // Préparer les données pour l'API (enlever confirmPassword)
      const { confirmPassword, ...apiData } = formData;

      const response = await api.register(apiData); // Assurez-vous que la méthode register existe dans votre API

      MySwal.fire({
        title: "Success!",
        text: "Registration successful",
        icon: "success",
        confirmButtonText: "Continue",
      }).then(() => {
        // Redirection après inscription réussie
        navigate("/login");
      });
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage = "An error occurred during registration";
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || "Validation error";
        } else if (error.response.status === 409) {
          errorMessage = "Email already exists";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }

      MySwal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
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
                        <h2 className="mb-2 text-white">Sign Up</h2>
                        <p>Create your Webkit account.</p>
                        <form onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="floating-label form-group">
                                <input
                                  className="floating-input form-control"
                                  type="text"
                                  name="nom"
                                  value={formData.nom}
                                  onChange={handleChange}
                                  placeholder=" "
                                />
                                <label>Full Name</label>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="floating-label form-group">
                                <input
                                  className="floating-input form-control"
                                  type="text"
                                  name="prenom"
                                  value={formData.prenom}
                                  onChange={handleChange}
                                  placeholder=" "
                                />
                                <label>Last Name</label>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="floating-label form-group">
                                <input
                                  className="floating-input form-control"
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  placeholder=" "
                                />
                                <label>Email</label>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="floating-label form-group">
                                <input
                                  className="floating-input form-control"
                                  type="text"
                                  name="numero"
                                  value={formData.numero}
                                  onChange={handleChange}
                                  placeholder=" "
                                />
                                <label>Phone No.</label>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="floating-label form-group">
                                <input
                                  className="floating-input form-control"
                                  type="password"
                                  name="motsDePass"
                                  value={formData.motsDePass}
                                  onChange={handleChange}
                                  placeholder=" "
                                />
                                <label>Password</label>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="floating-label form-group">
                                <input
                                  className="floating-input form-control"
                                  type="password"
                                  name="confirmPassword"
                                  value={formData.confirmPassword}
                                  onChange={handleChange}
                                  placeholder=" "
                                />
                                <label>Confirm Password</label>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="custom-control custom-checkbox mb-3">
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id="customCheck1"
                                />
                                <label
                                  className="custom-control-label text-white"
                                  htmlFor="customCheck1"
                                >
                                  I agree with the terms of use
                                </label>
                              </div>
                            </div>
                          </div>
                          <button type="submit" className="btn btn-white">
                            Sign Up
                          </button>
                          <p className="mt-3">
                            Already have an Account?{" "}
                            <Link
                              to="/login"
                              className="text-white text-underline"
                            >
                              Sign In
                            </Link>
                          </p>
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

export default Register;
