import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  RiArrowLeftLine,
  RiHotelBedLine,
  RiWifiLine,
  RiEyeLine,
  RiPencilLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import {
  FaSwimmingPool,
  FaParking,
  FaUtensils,
  FaShower,
} from "react-icons/fa";
import { MdMeetingRoom, MdBeachAccess } from "react-icons/md";
import { GiSofa } from "react-icons/gi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Rooms = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRoomData, setEditRoomData] = useState(null);

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchHotelRooms = async () => {
      try {
        const response = await api.getHotelById(id);
        setHotel(response.data.getOne);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        MySwal.fire("Error", "Failed to load hotel data", "error");
      }
    };

    fetchHotelRooms();
  }, [id]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    hotelId: id,
    type: "",
    status: "",

    numero: 0,
    capacite: 0,
    views: "",
    prix: 0,
    disponibilité: true,

    prixForChild: 0,
    description: "",
    equipement: "",
    image: "",
  });
  
  
  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setShowDetailsModal(true);
  };

  const handleUpdate = (room) => {
    setEditRoomData(room);
    setShowEditModal(true);
  };
  

  const handleDelete = async (roomId) => {
    try {
      const result = await MySwal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await api.deleteRoom(roomId);
        // Refresh the room list
        const response = await api.getHotelById(id);
        setHotel(response.data.getOne);

        await MySwal.fire("Deleted!", "The room has been deleted.", "success");
      }
    } catch (error) {
      MySwal.fire("Error!", "Failed to delete room.", "error");
    }
  };



  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-5">Error: {error}</div>
    );
  }

  if (!hotel) {
    return (
      <div className="alert alert-info text-center mt-5">
        No hotel data found
      </div>
    );
  }

  return (
    <div className="content-page">
      <div className="container-fluid">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <button
              className="btn btn-outline-primary mb-3"
              onClick={() => navigate(-1)}
            >
              <RiArrowLeftLine className="mr-1" /> Back to Hotels
            </button>

            <div className="card shadow">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <img
                      src={`https://hotel-api-ywn8.onrender.com/uploads/${hotel.images[0]}`}
                      alt={hotel.nom}
                      className="img-fluid rounded"
                      style={{
                        height: "250px",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  </div>
                  <div className="col-md-8">
                    <h2 className="mb-3">{hotel.nom}</h2>
                    <div className="d-flex align-items-center mb-3">
                      {[...Array(hotel.nombreEtoiles)].map((_, i) => (
                        <span key={i} className="text-warning h4">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-muted mb-4">{hotel.description}</p>

                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>Address:</strong> {hotel.adress}
                        </p>
                        <p>
                          <strong>Phone:</strong> {hotel.telephone}
                        </p>
                        <p>
                          <strong>Email:</strong> {hotel.email}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Total Rooms:</strong> {hotel.nombreDeChambre}
                        </p>
                        <p>
                          <strong>Available Rooms:</strong>{" "}
                          {hotel.chambre.filter((r) => r.disponibilité).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Available Rooms</h5>
                  <div>
                    <button
                      className="btn btn-light"
                      onClick={() => {
                        setNewRoomData({
                          hotelId: id,
                          type: "",
                          status: "",

                          numero: 0,
                          capacite: 0,
                          views: "",
                          prix: 0,
                          disponibilité: true,

                          prixForChild: 0,
                          description: "",
                          equipement: "",
                          image: "",
                        });
                        setShowAddModal(true);
                      }}
                    >
                      + Add Room
                    </button>

                    <span className="badge badge-light ml-2">
                      {hotel.chambre.length} rooms
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-body">
                {hotel.chambre.length === 0 ? (
                  <div className="alert alert-info">
                    No rooms available in this hotel
                  </div>
                ) : (
                  <div className="row">
                    {hotel.chambre.map((room) => (
                      <div key={room._id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card h-100">
                          <div className="card-img-top position-relative">
                            <img
                              src={`https://hotel-api-ywn8.onrender.com/uploads/${room.image}`}
                              alt={`Room ${room.numero}`}
                              className="img-fluid"
                              style={{
                                height: "200px",
                                width: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <div className="card-body">
                            <h5 className="card-title">
                              {room.type} - Room {room.numero}
                            </h5>
                            <p className="card-text text-muted">
                              {room.description}
                            </p>

                            <div className="d-flex flex-wrap mb-3">
                              <span className="me-3 mb-2 d-flex align-items-center">
                                <RiHotelBedLine className="mr-1" />{" "}
                                {room.capacite} Guests
                              </span>
                              <span className="me-3 mb-2 d-flex align-items-center">
                                <FaShower className="mr-1" />{" "}
                                {room.equipement.split(",")[0]}
                              </span>
                              <span className="me-3 mb-2 d-flex align-items-center">
                                <GiSofa className="mr-1" /> {room.status}
                              </span>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                              <h4 className="mb-0 text-primary">
                                ${room.prix}/night
                              </h4>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex justify-content-between border-top pt-3 mt-3">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleViewDetails(room)}
                              >
                                <RiEyeLine className="mr-1" /> View
                              </button>

                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleUpdate(room)}
                              >
                                <RiPencilLine className="mr-1" /> Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(room._id)}
                              >
                                <RiDeleteBinLine className="mr-1" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAddModal && (
        <div
          className={`modal fade ${showAddModal ? "show" : ""}`}
          style={{ display: showAddModal ? "block" : "none" }}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Room</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowAddModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const formData = new FormData();

                    // Ajouter tous les champs texte
                    formData.append("type", newRoomData.type);
                    formData.append("numero", newRoomData.numero);
                    formData.append("capacite", newRoomData.capacite);
                    formData.append("prix", newRoomData.prix);
                    formData.append("prixForChild", newRoomData.prixForChild);
                    formData.append("description", newRoomData.description);
                    formData.append("views", newRoomData.views);
                    formData.append("equipement", newRoomData.equipement);
                    formData.append("hotel", id); // Ajouter l'ID de l'hôtel

                    // Ajouter le fichier image si présent
                    if (newRoomData.imageFile) {
                      formData.append("file", newRoomData.imageFile);
                    }

                    await api.createRoom(formData);

                    const response = await api.getHotelById(id);
                    setHotel(response.data.getOne);

                    MySwal.fire(
                      "Success",
                      "Room added successfully",
                      "success"
                    );
                    setShowAddModal(false);
                    setNewRoomData({
                      type: "",
                      numero: "",
                      capacite: "",
                      prix: "",
                      prixForChild: "",
                      description: "",
                      views: "",
                      equipement: "",
                      imageFile: null,
                    });
                  } catch (err) {
                    console.error("Error adding room:", err);
                    MySwal.fire(
                      "Error",
                      err.response?.data?.message || "Failed to add room",
                      "error"
                    );
                  }
                }}
              >
                <div className="modal-body">
                  <div className="row">
                    <div className="form-group col-md-4">
                      <label>Type*</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newRoomData.type}
                        onChange={(e) =>
                          setNewRoomData({
                            ...newRoomData,
                            type: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label>Room Number*</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newRoomData.numero}
                        onChange={(e) =>
                          setNewRoomData({
                            ...newRoomData,
                            numero: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label>Capacity*</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newRoomData.capacite}
                        onChange={(e) =>
                          setNewRoomData({
                            ...newRoomData,
                            capacite: e.target.value,
                          })
                        }
                        min="1"
                        required
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label>Price*</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newRoomData.prix}
                        onChange={(e) =>
                          setNewRoomData({
                            ...newRoomData,
                            prix: e.target.value,
                          })
                        }
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label>Price for child</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newRoomData.prixForChild}
                        onChange={(e) =>
                          setNewRoomData({
                            ...newRoomData,
                            prixForChild: e.target.value,
                          })
                        }
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label>Description*</label>
                      <textarea
                        className="form-control"
                        value={newRoomData.description}
                        onChange={(e) =>
                          setNewRoomData({
                            ...newRoomData,
                            description: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label>Views</label>
                      <textarea
                        className="form-control"
                        value={newRoomData.views}
                        onChange={(e) =>
                          setNewRoomData({
                            ...newRoomData,
                            views: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label>Equipments (comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newRoomData.equipement}
                        onChange={(e) =>
                          setNewRoomData({
                            ...newRoomData,
                            equipement: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label>Image*</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) =>
                          setNewRoomData({
                            ...newRoomData,
                            imageFile: e.target.files[0],
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {editRoomData && (
        <div
          className={`modal fade ${showEditModal ? "show" : ""}`}
          style={{ display: showEditModal ? "block" : "none" }}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Room</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowEditModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await api.updateRoom(editRoomData._id, editRoomData);
                      const response = await api.getHotelById(id);
                      setHotel(response.data.getOne);
                      MySwal.fire(
                        "Success",
                        "Room updated successfully",
                        "success"
                      );
                      setShowEditModal(false);
                    } catch (err) {
                      MySwal.fire("Error", "Failed to update room", "error");
                    }
                  }}
                >
                  <div className="form-group">
                    <label>Type</label>
                    <input
                      className="form-control"
                      value={editRoomData.type}
                      onChange={(e) =>
                        setEditRoomData({
                          ...editRoomData,
                          type: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Number</label>
                    <input
                      className="form-control"
                      value={editRoomData.numero}
                      onChange={(e) =>
                        setEditRoomData({
                          ...editRoomData,
                          numero: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editRoomData.prix}
                      onChange={(e) =>
                        setEditRoomData({
                          ...editRoomData,
                          prix: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Capacity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editRoomData.capacite}
                      onChange={(e) =>
                        setEditRoomData({
                          ...editRoomData,
                          capacite: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <input
                      className="form-control"
                      value={editRoomData.status}
                      onChange={(e) =>
                        setEditRoomData({
                          ...editRoomData,
                          status: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      value={editRoomData.description}
                      onChange={(e) =>
                        setEditRoomData({
                          ...editRoomData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button className="btn btn-success" type="submit">
                    Update Room
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Room Details Modal */}
      {selectedRoom && (
        <div
          className={`modal fade ${showDetailsModal ? "show" : ""}`}
          style={{ display: showDetailsModal ? "block" : "none" }}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Room Details</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowDetailsModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <img
                      src={`https://hotel-api-ywn8.onrender.com/uploads/${selectedRoom.image}`}
                      alt={`Room ${selectedRoom.numero}`}
                      className="img-fluid rounded mb-3"
                    />
                  </div>
                  <div className="col-md-6">
                    <h4>
                      {selectedRoom.type} - Room {selectedRoom.numero}
                    </h4>
                    <p>
                      <strong>Status:</strong> {selectedRoom.status}
                    </p>
                    <p>
                      <strong>Capacity:</strong> {selectedRoom.capacite} Guests
                    </p>
                    <p>
                      <strong>Price:</strong> ${selectedRoom.prix}/night
                    </p>
                    <p>
                      <strong>Availability:</strong>{" "}
                      {selectedRoom.disponibilité ? "Available" : "Booked"}
                    </p>
                    <p>
                      <strong>Description:</strong> {selectedRoom.description}
                    </p>
                    <p>
                      <strong>Equipment:</strong> {selectedRoom.equipement}
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for modal */}
      {showDetailsModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default Rooms;
