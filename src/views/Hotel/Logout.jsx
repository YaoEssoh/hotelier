import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Demander une confirmation avant de déconnecter l'utilisateur
    const confirmed = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?');

    if (confirmed) {
      localStorage.removeItem('user'); // Supprimer le token
      localStorage.removeItem('token'); // Supprimer le token

      navigate('/login');               // Rediriger vers /login
    }
  };

  return (
    <>
  <li className="dropdown-item d-flex align-items-center border-top">
    <button
      onClick={handleLogout}
      className="btn btn-link p-0 m-0 d-flex align-items-center text-danger logout-btn"
    >
      <svg
        className="svg-icon mr-2"
        width={20}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      Logout
    </button>
  </li>
</>

  );
}

export default LogoutButton;
