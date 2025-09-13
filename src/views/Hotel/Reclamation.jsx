// src/views/Hotel/Reclamation.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FaUser, FaSearch } from 'react-icons/fa';
import { MdClear } from 'react-icons/md';

const API_BASE = process.env.REACT_APP_API_BASE || 'https://hotel-api-ywn8.onrender.com';

function getAuthHeaders() {
  return { 'Content-Type': 'application/json' };
}

// Hook personnalisé pour debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

export default function Reclamation() {
  const [allRecs, setAllRecs] = useState([]); // Toutes les réclamations
  const [filteredRecs, setFilteredRecs] = useState([]); // Réclamations filtrées
  const [displayedRecs, setDisplayedRecs] = useState([]); // Réclamations affichées (avec pagination)
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRec, setSelectedRec] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statutFilter, setStatutFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  function handleSearchChange(e) {
    setSearch(e.target.value);
  }

  function clearSearch() {
    setSearch('');
  }

  // Récupération de toutes les réclamations
  const fetchAllRecs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reclamation`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || 'Erreur récupération réclamation');
      }

      const json = await res.json();
      console.log('reclamation API response:', json);

      const payload = (json && json.data) ? json.data : json;
      const items = Array.isArray(payload.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      
      setAllRecs(items);
      setTotal(items.length);
      setLoading(false);
      return items;
    } catch (err) {
      console.error(err);
      alert('Impossible de charger les réclamations');
      setLoading(false);
      return [];
    }
  }, []);

  // Filtrage des réclamations
  const filterRecs = useCallback(() => {
    let result = [...allRecs];
    
    // Filtre par statut
    if (statutFilter !== 'all') {
      result = result.filter(r => r.statut === statutFilter);
    }
    
    // Filtre par recherche
    if (debouncedSearch.trim()) {
      const searchTerm = debouncedSearch.toLowerCase().trim();
      result = result.filter(r => 
        (r.objet && r.objet.toLowerCase().includes(searchTerm)) || 
        (r.message && r.message.toLowerCase().includes(searchTerm)) || 
        (renderClient(r.client).toLowerCase().includes(searchTerm)
      ))
    }
    
    setFilteredRecs(result);
    setTotal(result.length);
    setPage(1); // Reset à la première page après filtrage
  }, [allRecs, statutFilter, debouncedSearch]);

  // Pagination
  const applyPagination = useCallback(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    setDisplayedRecs(filteredRecs.slice(start, end));
  }, [filteredRecs, page, limit]);

  // Chargement initial
  useEffect(() => {
    fetchAllRecs();
  }, []);

  // Filtrage lorsque les données ou les filtres changent
  useEffect(() => {
    if (allRecs.length > 0) {
      filterRecs();
    }
  }, [allRecs, statutFilter, debouncedSearch, filterRecs]);

  // Application de la pagination lorsque les données filtrées changent
  useEffect(() => {
    applyPagination();
  }, [filteredRecs, page, applyPagination]);

  // Reste du code inchangé...
  async function fetchDetail(id) {
    try {
      const res = await fetch(`${API_BASE}/reclamation/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || 'Erreur chargement détail');
      }
      const json = await res.json();
      const detail = json.data || json;
      setSelectedRec(detail);
      return detail;
    } catch (e) {
      console.error(e);
      alert('Impossible de charger le détail');
      return null;
    }
  }

  async function openDetail(id) {
    setSelectedId(id);
    await fetchDetail(id);
  }

  async function sendMessage(id, author, message) {
    if (!message || !message.trim()) return;
    setActionLoading(true);

    try {
      const res = await fetch(`${API_BASE}/reclamation/${id}/message`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ author, message }),
      });
      if (!res.ok) throw new Error('Erreur envoi message');
      await fetchDetail(id);
      await fetchAllRecs(); // Recharger toutes les données après modification
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'envoi du message");
    } finally {
      setActionLoading(false);
    }
  }

  async function changeStatus(id, statut) {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reclamation/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ statut }),
      });
      if (!res.ok) throw new Error('Erreur changement statut');
      await fetchDetail(id);
      await fetchAllRecs(); // Recharger toutes les données après modification
    } catch (e) {
      console.error(e);
      alert('Erreur lors du changement de statut');
    } finally {
      setActionLoading(false);
    }
  }

  async function quickResolve(id) {
    if (!window.confirm('Marquer comme résolu ?')) return;
    await changeStatus(id, 'resolved');
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer cette réclamation ? Cette action est irréversible.')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reclamation/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Erreur suppression');
      await fetchAllRecs(); // Recharger toutes les données après suppression
      if (selectedId === id) {
        setSelectedId(null);
        setSelectedRec(null);
      }
    } catch (e) {
      console.error(e);
      alert('Impossible de supprimer la réclamation');
    } finally {
      setActionLoading(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="content-page">
      <div className="container-fluid">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <h5 className="card-title mb-0">
                  <FaUser className="me-2" />
                  Liste des réclamations ({total})
                </h5>

                <div className="search-bar position-relative" style={{ width: '300px' }}>
                  <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3" />
                  <input
                    type="text"
                    className="form-control ps-5"
                    placeholder="Rechercher une réclamation..."
                    value={search}
                    onChange={handleSearchChange}
                  />
                  {search && (
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

        <div className="card shadow-sm mt-3">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Objet</th>
                  <th>Message</th>
                  <th>Client</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr><td colSpan={5}>Chargement...</td></tr>
                ) : (!Array.isArray(displayedRecs) || displayedRecs.length === 0) ? (
                  <tr><td colSpan={5}>Aucune réclamation</td></tr>
                ) : displayedRecs.map((r) => (
                  <tr key={r._id}>
                    <td>{r.objet}</td>
                    <td style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.thread && r.thread.length ? r.thread[r.thread.length - 1].message : r.message}
                    </td>
                    <td>{renderClient(r.client)}</td>
                    <td><span className={`badge ${badgeClass(r.statut)}`}>{r.statut}</span></td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openDetail(r._id)}
                          disabled={actionLoading}
                        >Voir</button>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => quickResolve(r._id)}
                          disabled={actionLoading}
                        >Résoudre</button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(r._id)}
                          disabled={actionLoading}
                        >Suppr</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card-footer d-flex justify-content-between align-items-center">
            <div>Page {page} / {totalPages} — {total} résultat(s)</div>
            <div className="btn-group">
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >Préc</button>
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >Suiv</button>
            </div>
          </div>
        </div>

        {selectedId && selectedRec && (
          <DetailModal
            reclamation={selectedRec}
            onClose={() => { setSelectedId(null); setSelectedRec(null); }}
            onSendMessage={sendMessage}
            onChangeStatus={changeStatus}
            onDelete={handleDelete}
            actionLoading={actionLoading}
          />
        )}
      </div>
    </div>
  );
}

/* Helpers (inchangés) */

function renderClient(client) {
  if (!client) return 'N/A';
  if (typeof client === 'string') return client;
  if (Array.isArray(client) && client.length > 0) return renderClient(client[0]);

  if (client.firstName || client.lastName) {
    const f = (client.firstName || '').trim();
    const l = (client.lastName || '').trim();
    if (f || l) return `${f} ${l}`.trim();
  }

  const tryFields = ['name', 'fullName', 'prenom', 'username', 'email', 'nom'];
  for (const k of tryFields) {
    if (client[k]) return client[k];
  }

  if (client.user) return renderClient(client.user);
  if (client.client) return renderClient(client.client);
  if (client.profile) return renderClient(client.profile);
  if (client._doc) return renderClient(client._doc);

  return client._id || 'Client inconnu';
}

function badgeClass(st) {
  switch (st) {
    case 'open': return 'bg-warning text-dark';
    case 'in_progress': return 'bg-info text-dark';
    case 'resolved': return 'bg-success';
    case 'closed': return 'bg-secondary';
    default: return 'bg-light text-dark';
  }
}

/* Modal Détail (inchangé) */

function DetailModal({ reclamation, onClose, onSendMessage, onChangeStatus, onDelete, actionLoading }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (!message.trim()) return;
    setSending(true);
    try {
      await onSendMessage(reclamation._id, 'Admin', message.trim());
      setMessage('');
    } catch (e) {
      alert('Erreur envoi message');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="modal show d-block" tabIndex={-1} role="dialog" onClick={e => e.stopPropagation()}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Réclamation — {reclamation.objet}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <p><strong>Client:</strong> {renderClient(reclamation.client)}</p>
            <p><strong>Message initial:</strong> {reclamation.message}</p>
            <p><strong>Email:</strong> {reclamation.contactEmail}</p>

            <hr />

            <div className="d-flex gap-2 align-items-center">
              <label className="mb-0 me-2">Statut :</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 160 }}
                value={reclamation.statut}
                onChange={(e) => onChangeStatus(reclamation._id, e.target.value)}
                disabled={actionLoading}
              >
                <option value="open">Open</option>
                <option value="in_progress">En cours</option>
                <option value="resolved">Résolu</option>
                <option value="closed">Fermé</option>
              </select>

              <div className="ms-auto">
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(reclamation._id)} disabled={actionLoading}>
                  Supprimer
                </button>
                <button className="btn btn-sm btn-secondary ms-2" onClick={onClose} disabled={actionLoading}>
                  Fermer
                </button>
              </div>
            </div>

            <hr />

            <div className="mt-3">
              <h6>Conversation</h6>
              <div className="mb-3">
                {reclamation.thread?.map((msg, i) => (
                  <div key={i} className={`mb-2 p-2 rounded ${msg.author === 'Admin' ? 'bg-light' : 'bg-light-blue'}`}>
                    <strong>{msg.author}:</strong> {msg.message}
                  </div>
                ))}
              </div>

              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Répondre..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleSend}
                  disabled={sending || !message.trim()}
                >
                  {sending ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}