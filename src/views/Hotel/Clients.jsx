import React, { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaImage } from 'react-icons/fa';
import { MdClear } from 'react-icons/md';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import 'moment/locale/fr';
import api from "../../services/api";

function Clients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const clientsPerPage = 10;

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const filtered = clients.filter(client =>
      client.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.numero?.toString().includes(searchTerm)
    );
    setFilteredClients(filtered);
    setCurrentPage(0); // Reset à la première page lors d'une nouvelle recherche
  }, [searchTerm, clients]);

  const fetchClients = async () => {
    try {
      const response = await api.getClients();
      const data = Array.isArray(response.data.listeData) 
        ? response.data.listeData 
        : [];
      setClients(data);
      console.log("les clients" , response.data.listeData)
      setFilteredClients(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des clients.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Pagination
  const pageCount = Math.ceil(filteredClients.length / clientsPerPage);
  const offset = currentPage * clientsPerPage;
  const currentClients = filteredClients.slice(offset, offset + clientsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mx-3 my-5">
        {error}
      </div>
    );
  }

  return (
    <div className="content-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                  <h5 className="card-title mb-0">
                    <FaUser className="me-2" />
                    Liste des clients
                  </h5>
                  
                  <div className="search-bar position-relative" style={{ width: '300px' }}>
                    <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3" />
                    <input
                      type="text"
                      className="form-control ps-5"
                      placeholder="Rechercher un client..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    {searchTerm && (
                      <MdClear 
                        className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                        style={{ cursor: 'pointer' }}
                        onClick={clearSearch}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '50px' }}>Photo</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Date d'inscription</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentClients.length > 0 ? (
                        currentClients.map((client) => (
                          <tr key={client._id}>
                            <td>
                              {client.image ? (
                                <img 
                                  src={`http://localhost:3000/file/${client.profil}`} 
                                  alt={client.nom}
                                  className="rounded-circle"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              ) : (
                                <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" 
                                  style={{ width: '40px', height: '40px' }}>
                                  <FaImage size={16} />
                                </div>
                              )}
                            </td>
                            <td>{client.nom || 'Non renseigné'}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <FaEnvelope className="me-2 text-primary" />
                                {client.email || 'Non renseigné'}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <FaPhone className="me-2 text-success" />
                                {client.numero || 'Non renseigné'}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <FaCalendarAlt className="me-2 text-info" />
                                {moment(client.createdAt).format('DD/MM/YYYY')}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            {searchTerm ? (
                              <div>
                                <p>Aucun client ne correspond à votre recherche</p>
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={clearSearch}
                                >
                                  Réinitialiser la recherche
                                </button>
                              </div>
                            ) : (
                              <p>Aucun client trouvé</p>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {filteredClients.length > clientsPerPage && (
                  <div className="d-flex justify-content-center mt-4">
                    <ReactPaginate
                      previousLabel={'Précédent'}
                      nextLabel={'Suivant'}
                      breakLabel={'...'}
                      pageCount={pageCount}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageClick}
                      containerClassName={'pagination'}
                      activeClassName={'active'}
                      pageClassName={'page-item'}
                      pageLinkClassName={'page-link'}
                      previousClassName={'page-item'}
                      previousLinkClassName={'page-link'}
                      nextClassName={'page-item'}
                      nextLinkClassName={'page-link'}
                      breakClassName={'page-item'}
                      breakLinkClassName={'page-link'}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clients;