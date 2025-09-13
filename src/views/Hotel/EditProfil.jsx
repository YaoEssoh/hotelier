import React, { useEffect, useState } from 'react';
import api from '../../services/api';

function EditProfile() {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    numero: '',
    email: '',
    motsDePass: ''
  });

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const user = localStorage.getItem("user");
  const userParsed = JSON.parse(user);
  const clientId = userParsed?.utilisateur?._id;

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const res = await api.getHotelierById(clientId);
        console.log(res.data)

        if (!res.data) throw new Error('Erreur lors du chargement');

        setForm({
          nom: res.data.getOne?.nom || '',
          prenom: res.data.getOne?.prenom || '',
          numero: res.data.getOne?.numero || '',
          email: res.data.getOne.email || '',
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfil();
  }, [clientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const response = await api.updateHotelier(clientId, form);
      if (!response.ok) throw new Error("Échec de la mise à jour");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p style={styles.loading}>Chargement...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Modifier mon profil</h2>

      {success && <p style={styles.success}>✅ Profil mis à jour</p>}
      {error && <p style={styles.error}>❌ {error}</p>}

      <form onSubmit={handleSubmit}>
        <label style={styles.label}>Nom :</label>
        <input
          name="nom"
          value={form.nom}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Prénom :</label>
        <input
          name="prenom"
          value={form.prenom}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Numéro :</label>
        <input
          name="numero"
          type="tel"
          value={form.numero}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Email :</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />


        <button type="submit" style={styles.button}>💾 Enregistrer</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Segoe UI, sans-serif'
  },
  title: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#2c3e50'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    marginTop: '15px',
    fontWeight: '600',
    color: '#34495e'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccd1d9',
    borderRadius: '5px',
    fontSize: '14px',
    boxSizing: 'border-box',
    marginBottom: '10px'
  },
  button: {
    marginTop: '25px',
    width: '100%',
    padding: '12px',
    backgroundColor: '#2980b9',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  success: {
    textAlign: 'center',
    fontSize: '14px',
    marginTop: '10px',
    color: '#27ae60',
    fontWeight: 'bold'
  },
  error: {
    textAlign: 'center',
    fontSize: '14px',
    marginTop: '10px',
    color: '#e74c3c',
    fontWeight: 'bold'
  },
  loading: {
    textAlign: 'center',
    marginTop: '50px',
    fontSize: '16px',
    color: '#7f8c8d'
  }
};

export default EditProfile;