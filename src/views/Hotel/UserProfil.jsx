import React, { useEffect, useState } from 'react';
import api from '../../services/api';

function UserProfile() {
  const [profil, setProfil] = useState({
    nom: '',
    prenom: '',
    numero: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = localStorage.getItem("user");
  const userParsed = JSON.parse(user);
  const clientId = userParsed?.utilisateur?._id;

  const fetchProfil = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getHotelierById(clientId);
      if (!res.data) throw new Error('Erreur lors du chargement du profil');

      setProfil({
        nom: res.data.getOne?.nom || '',
        prenom: res.data.getOne?.prenom || '',
        numero: res.data.getOne?.numero || '',
        email: res.data.getOne?.email || ''
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfil();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-4" role="alert">
        ❌ Erreur : {error}
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center mt-8">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white text-center">
              <h4 className="mb-0">Mon Profil</h4>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong>Nom :</strong>
                <p className="form-control-plaintext">{profil.nom}</p>
              </div>
              <div className="mb-3">
                <strong>Prénom :</strong>
                <p className="form-control-plaintext">{profil.prenom}</p>
              </div>
              <div className="mb-3">
                <strong>Email :</strong>
                <p className="form-control-plaintext">{profil.email}</p>
              </div>
              <div className="mb-3">
                <strong>Numéro :</strong>
                <p className="form-control-plaintext">{profil.numero}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
