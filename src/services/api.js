import { Axios } from "axios";
import axiosContext from "./axiosContext";
const API_BASE_URL = 'http://localhost:3000'; 

const getHotels = async  () => {
  const response = await axiosContext.get("/hotel");
  return response.data.listeData
};


const getHotelById = (id) => {
  return axiosContext.get(`/hotel/${id}`);
};
const deleteHotel = (id) => {
  return axiosContext.delete(`/hotel/${id}`);
};
const updateHotel = (id , data) => {
  return axiosContext.put(`/hotel/${id}`, data);
};
const createHotel = (data) => {
  return axiosContext.post(`/hotel`, data, {
    headers:{
      'Content-Length': 'multipart/form-data'
    }
  });
};
const createRoom = (data) => {
  return axiosContext.post(`/chambre`, data, {
    headers:{
      'Content-Length': 'multipart/form-data'
    }
  });
};
const getRooms = () => {
  return axiosContext.get("/chambre");
};
const updateRoom = (id , data) => {
  return axiosContext.put(`/chambre/${id}`, data);
};
const deleteRoom = (id) => {
  return axiosContext.delete(`/chambre/${id}`);
};
const getRoomById = (id) => {
  return axiosContext.get(`/chambre/${id}`);
};
const createReservation = (data) => {
  return axiosContext.post(`/reservation`, data);
};
const getReservations = () => {
  return axiosContext.get(`/reservation`);
};
const getReservationsByHotelierId = (id) => {
  return axiosContext.get(`/reservation/by-hotelier/${id}`);
};
const updateReservationStatus = (id, data) => {
  return axiosContext.put(`/reservation/${id}`, data);
};
const getClients = () => {
  return axiosContext.get("/client");
};
const getUserProfile = (id) => {
  return axiosContext.get(`/client/${id}`);
};

const getclientByhotelierId = (id) => {
  return axiosContext.get(`/client/by-hotelier/${id}`);
};
const updateUserProfile = (id, data) => {
  return axiosContext.put(`/client/${id}`, data);
};
const login = (data) => {
  return axiosContext.post("/auth/signin", data);
};
const Forgot = (data) => {
  return axiosContext.post("/auth/forget", data);
};
const Reset = (token, newPassword) => {
  return axiosContext.post(`/auth/resetMotsDePass/${token}`, {
    newMotsDePass: newPassword
  });
};
const register = (data) => {
  return axiosContext.post("/client", data);
};

const checkRoomAvailability = (data) => {
  return axiosContext.post("/reservation/check-availability", data);
};
const getHotelierById = (id) => {
  return axiosContext.get(`/hotelier/${id}`);
};
const updateHotelier = (id, data) => {
  return axiosContext.put(`/hotelier/${id}`, data);
};
const patchStatutReservation = async (id, statut) =>{
  return await axiosContext.patch(`/reservation/${id}/statut`, statut);
};
const createReclamation = (data) => {
  return axiosContext.post('/reclamation', data);
};
// Récupérer toutes les réclamations avec filtres optionnels (ex: pagination, statut)
const getReclamations = (params) => {
  return axiosContext.get('/reclamation', { params });
};

// Récupérer une réclamation par son id
const getReclamationById = (id) => {
  return axiosContext.get(`/reclamation/${id}`);
};

// Mettre à jour une réclamation (PUT complet)
const updateReclamation = (id, data) => {
  return axiosContext.put(`/reclamation/${id}`, data);
};

// Modifier partiellement le statut d’une réclamation (PATCH)
const patchStatutReclamation = (id, statut) => {
  return axiosContext.patch(`/reclamation/${id}/statut`, { statut });
};

// Supprimer une réclamation
const deleteReclamation = (id) => {
  return axiosContext.delete(`/reclamation/${id}`);
};

const getReservationStatistic = () => {
  return axiosContext.get(`/reservation/statics`);
};

const getHotelStatistic = (id) => {
  return axiosContext.get(`/hotel/statistiques`);
};

export default {
  getHotels,
  Reset,
  updateRoom,
  updateHotelier,
  deleteRoom,
  deleteHotel,
  updateHotel,
  createHotel,
  getHotelierById,
  login,
  Forgot,
  getUserProfile,
  updateUserProfile,
  updateReservationStatus,
  register,
  checkRoomAvailability,
  getRooms,
  getClients,
  getHotelById,
  getRoomById,
  createReservation,
  getReservations,
  createRoom,
  patchStatutReservation,
  createReclamation,
  getReclamations,
  getReclamationById,
  updateReclamation,
  patchStatutReclamation,
  deleteReclamation,
  getclientByhotelierId,
  getReservationsByHotelierId,
  getReservationStatistic,
  getHotelStatistic
};
