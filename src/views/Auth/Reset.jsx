import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Validation
    if (!password || !confirmPass) {
      Swal.fire({
        icon: "error",
        title: "Champs requis",
        text: "Veuillez remplir tous les champs",
        confirmButtonColor: "#d33",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPass) {
      Swal.fire({
        icon: "error",
        title: "Mots de passe différents",
        text: "Les mots de passe ne correspondent pas",
        confirmButtonColor: "#d33",
      });
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Mot de passe faible",
        text: "Le mot de passe doit contenir au moins 8 caractères",
        confirmButtonColor: "#d33",
      });
      setLoading(false);
      return;
    }

    try {
      // Appel API corrigé
      const response = await api.Reset(token, password);

      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: response.data?.message || "Mot de passe réinitialisé avec succès",
        confirmButtonColor: "#3085d6",
      }).then(() => navigate("/login"));
    } catch (error) {
      console.error("Erreur:", error);
      
      let errorMsg = "Erreur lors de la réinitialisation";
      if (error.response) {
        if (error.response.status === 401) {
          errorMsg = "Le lien de réinitialisation a expiré ou est invalide. Veuillez demander un nouveau lien.";
        } else {
          errorMsg = error.response.data?.message || errorMsg;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: errorMsg,
        confirmButtonColor: "#d33",
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
                        <h2 className="mb-2 text-white">Réinitialisation</h2>
                        <p className="text-white mb-4">
                          Entrez votre nouveau mot de passe pour réinitialiser votre compte.
                        </p>
                        <form onSubmit={handleReset}>
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="floating-label form-group">
                                <input
                                  className="floating-input form-control"
                                  type="password"
                                  placeholder=" "
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                                  minLength="8"
                                />
                                <label>Nouveau mot de passe</label>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="floating-label form-group">
                                <input
                                  className="floating-input form-control"
                                  type="password"
                                  placeholder=" "
                                  value={confirmPass}
                                  onChange={(e) => setConfirmPass(e.target.value)}
                                  required
                                  minLength="8"
                                />
                                <label>Confirmer le mot de passe</label>
                              </div>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="btn btn-white"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                En cours...
                              </>
                            ) : (
                              "Réinitialiser"
                            )}
                          </button>
                        </form>
                      </div>
                    </div>
                    <div className="col-lg-6 content-right">
                      <img
                        src="../assets/images/login/01.png"
                        className="img-fluid image-right"
                        alt="Réinitialisation de mot de passe"
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

export default ResetPassword;