import React, { useEffect, useState } from "react";
import api from "../../services/api";
import moment from "moment";
import { MdClear } from "react-icons/md";
import { FaSearch, FaUser } from "react-icons/fa";

function ReservationDashboard() {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reservationsPerPage] = useState(10);

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredReservations(reservations);
    } else {
      const filtered = reservations.filter((res) => {
        const clientName = res.client?.[0]?.nom?.toLowerCase() || "";
        const roomNumber = res.chambre?.numero?.toString() || "";
        const status = res.statut?.toLowerCase() || "";

        return (
          clientName.includes(searchTerm.toLowerCase()) ||
          roomNumber.includes(searchTerm) ||
          status.includes(searchTerm.toLowerCase())
        );
      });
      setFilteredReservations(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, reservations]);

  const fetchReservations = async () => {
    try {
      const response = await api.getReservations();
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.listeData || [];
      setReservations(data);
      setFilteredReservations(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des réservations.");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => setSearchTerm("");

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = filteredReservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage);

  const handleStatusChange = async (id, newStatus) => {
    try {

      await api.patchStatutReservation(id, { statut: newStatus })
      const updated = reservations.map((res) =>
        res._id === id ? { ...res, statut: newStatus } : res
      );
      setReservations(updated);
      setFilteredReservations(updated);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      alert("Échec de la mise à jour du statut.");
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-success";
      case "Paid":
        return "bg-success";
      case "Cancelled":
        return "bg-danger";
      default:
        return "bg-warning text-dark";
    }
  };

  const getSelectStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return { backgroundColor: "#d4edda", borderColor: "#28a745", color: "#155724" };
      case "Paid":
        return { backgroundColor: "#d4edda", borderColor: "#28a745", color: "#155724" };
      case "Cancelled":
        return { backgroundColor: "#f8d7da", borderColor: "#dc3545", color: "#721c24" };
      case "Pending":
      default:
        return { backgroundColor: "#fff3cd", borderColor: "#ffc107", color: "#856404" };
    }
  };

  if (loading) return <p>Chargement des réservations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="content-page">
      <div className="container-fluid">
        {/* Recherche */}
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                  <h5 className="card-title mb-0">
                    <FaUser className="me-2" />
                    Liste des réservations ({filteredReservations.length})
                  </h5>

                  <div className="search-bar position-relative" style={{ width: "300px" }}>
                    <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3" />
                    <input
                      type="text"
                      className="form-control ps-5"
                      placeholder="Rechercher un client, chambre ou statut..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <MdClear
                        className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                        style={{ cursor: "pointer" }}
                        onClick={clearSearch}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table des réservations */}
        <div className="row mt-4">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th>Nom du Client</th>
                        <th>Chambre</th>
                        <th>Date Début</th>
                        <th>Date Fin</th>
                        <th>Statut</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentReservations.length > 0 ? (
                        currentReservations.map((res) => (
                          <tr key={res._id}>
                            <td>{res.client?.[0]?.nom || "N/A"}</td>
                            <td>{res.chambre?.numero || "N/A"}</td>
                            <td>{moment(res.dateDebut).format("YYYY-MM-DD")}</td>
                            <td>{moment(res.dateFin).format("YYYY-MM-DD")}</td>
                            <td>
                              <span className={`badge ${getBadgeClass(res.statut)}`}>
                                {res.statut}
                              </span>
                            </td>
                            <td>
                              {res.statut !== "Paid" ? (
                                <select
                                  className="form-select fw-bold"
                                  style={{ ...getSelectStyle(res.statut), transition: "0.3s" }}
                                  value={res.statut}
                                  onChange={(e) => handleStatusChange(res._id, e.target.value)}
                                >
                                  <option value="Pending">En attente</option>
                                  <option value="Confirmed">Confirmée</option>
                                  <option value="Cancelled">Annulée</option>
                                </select>
                              ) : (
                                <span className="fw-bold text-success">Déjà payé</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            Aucune réservation trouvée
                          </td>
                        </tr>
                      )}

                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav className="mt-3">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Précédent
                        </button>
                      </li>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <li
                          key={number}
                          className={`page-item ${currentPage === number ? "active" : ""}`}
                        >
                          <button className="page-link" onClick={() => paginate(number)}>
                            {number}
                          </button>
                        </li>
                      ))}

                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Suivant
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservationDashboard;
