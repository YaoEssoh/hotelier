import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import api from "../../services/api";

const MySwal = withReactContent(Swal);

function Login() {
  const [email, setEmail] = useState("");
  const [motsDePass, setMotsDePass ] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation basique
    if (!email || !motsDePass) {
      MySwal.fire({
        title: "Error!",
        text: "Please fill in all fields",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.login({ email, motsDePass });
      console.log('====================================');
      console.log(email, motsDePass);
      console.log('====================================');
      const userData = response.data.data;
      const userRole = userData?.utilisateur?.role || userData?.role;

      // Vérification du rôle hotelier
      if (userRole !== "hotelier") {
        // Déconnexion immédiate si ce n'est pas un hotelier
        localStorage.removeItem("user");
        throw new Error("Only hoteliers are allowed to login here");
      }

      // Stocker les informations utilisateur
      localStorage.setItem("user", JSON.stringify(userData));

      // Si "Remember Me" est coché, stocker l'email dans le localStorage
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      MySwal.fire({
        title: "Welcome Hotelier!",
        text: "Login successful",
        icon: "success",
        confirmButtonText: "Access Dashboard",
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        navigate("/"); // Rediriger vers le dashboard hotelier
      });
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "An error occurred during login";
      if (error.message === "Only hoteliers are allowed to login here") {
        errorMessage =
          "This portal is for hoteliers only. Please use the client login.";
      } else if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Invalid email or motsDePass";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }

      MySwal.fire({
        title: "Access Denied",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger l'email mémorisé si disponible
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

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
                        <h2 className="mb-2 text-white">Sign In</h2>
                        <p className="text-white">
                          Login to access your account
                        </p>

                        <form onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="floating-label form-group">
                                <input
                                  className="floating-input form-control"
                                  type="email"
                                  placeholder=" "
                                  name="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required
                                />
                                <label>Email</label>
                              </div>
                            </div>

                            <div className="col-lg-12">
                              <div className="floating-label form-group">
                                <input
                                  className="floating-input form-control"
                                  type="motsDePass"
                                  placeholder=" "
                                  name="motsDePass"
                                  value={motsDePass}
                                  onChange={(e) => setMotsDePass(e.target.value)}
                                  required
                                  //minLength={6}
                                />
                                <label>Password</label>
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="custom-control custom-checkbox mb-3">
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id="customCheck1"
                                  checked={rememberMe}
                                  onChange={(e) =>
                                    setRememberMe(e.target.checked)
                                  }
                                />
                                <label
                                  className="custom-control-label control-label-1 text-white"
                                  htmlFor="customCheck1"
                                >
                                  Remember Me
                                </label>
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <Link
                                to="/forgot-password"
                                className="text-white float-right"
                              >
                                Forgot Password?
                              </Link>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="btn btn-white btn-block"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm mr-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Signing In...
                              </>
                            ) : (
                              "Sign In"
                            )}
                          </button>

                          <p className="mt-3 text-center text-white">
                            Don't have an account?{" "}
                            <Link
                              to="/register"
                              className="text-white text-underline font-weight-bold"
                            >
                              Sign Up
                            </Link>
                          </p>
                        </form>
                      </div>
                    </div>

                    <div className="col-lg-6 content-right d-none d-lg-block">
                      <img
                        src="../assets/images/login/01.png"
                        className="img-fluid image-right"
                        alt="Hotel Luxury"
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

export default Login;
