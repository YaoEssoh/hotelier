import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../services/api";
import { RiEyeLine, RiPencilLine, RiDeleteBinLine, RiHotelBedLine } from "react-icons/ri";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newHotel, setNewHotel] = useState({
    nom: "",
    description: "",
    adress: "",
    nombreEtoiles: 3,
    telephone: "",
    email: "",
    nombreDeChambre: "",
    service: "",
    tarifMoyen: "",
    images: [],
  });
  const [selectedImage, setSelectedImage] = useState([]);
    const [filteredHotels, setfilteredHotels] = useState([]);

  const navigate = useNavigate();

  const fetchHotels = async () => {
    try {
      const user = localStorage.getItem("user");
      const userParsed = JSON.parse(user);
      const clientId = userParsed?.utilisateur?._id;

      if (!clientId) {
        throw new Error("Client ID not found in localStorage");
      }

            console.log("response");

      const response = await api.getHotels();

      console.log("response : ", response);
      
      
      const filteredHotels1 = response.filter(
        (hotel) => hotel.hotelier && hotel.hotelier.toString() === clientId
      );
setfilteredHotels(response)
      setHotels(response);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleViewDetails = (hotel) => {
    setSelectedHotel(hotel);
    setShowDetailsModal(true);
  };

  const handleUpdate = (hotel) => {
    setSelectedHotel({...hotel});
    setShowUpdateModal(true);
  };

  const handleDelete = async (hotelId) => {
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
        await api.deleteHotel(hotelId);
        setHotels(hotels.filter((hotel) => hotel._id !== hotelId));

        await MySwal.fire(
          "Deleted!",
          "Your hotel has been deleted.",
          "success"
        );
      }
    } catch (error) {
      MySwal.fire("Error!", "Failed to delete hotel.", "error");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedHotel = await api.updateHotel(
        selectedHotel._id,
        selectedHotel
      );
      setHotels(
        hotels.map((h) => (h._id === updatedHotel.data._id ? updatedHotel.data : h))
      );
      setShowUpdateModal(false);

      await MySwal.fire("Updated!", "Your hotel has been updated.", "success");
      fetchHotels();
    } catch (error) {
      MySwal.fire("Error!", "Failed to update hotel.", "error");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = localStorage.getItem("user");
      const userParsed = JSON.parse(user);
      const clientId = userParsed?.utilisateur?._id;

      const formData = new FormData();
      formData.append("nom", newHotel.nom);
      formData.append("description", newHotel.description);
      formData.append("adress", newHotel.adress);
      formData.append("nombreEtoiles", newHotel.nombreEtoiles);
      formData.append("telephone", newHotel.telephone);
      formData.append("email", newHotel.email);
      formData.append("nombreDeChambre", newHotel.nombreDeChambre);
      formData.append("service", newHotel.service);
      formData.append("tarifMoyen", newHotel.tarifMoyen);
      formData.append("hotelier", clientId);
      
      for (let i = 0; i < selectedImage.length; i++) {
        formData.append("files", selectedImage[i]);
      }

      const res = await api.createHotel(formData);
      if (res) {
        setShowCreateModal(false);
        setNewHotel({
          nom: "",
          description: "",
          adress: "",
          nombreEtoiles: 3,
          telephone: "",
          email: "",
          nombreDeChambre: "",
          service: "",
          tarifMoyen: "",
          images: [],
        });
        setSelectedImage([]);

        await MySwal.fire(
          "Created!",
          "Your hotel has been created.",
          "success"
        );
        fetchHotels();
      }
    } catch (error) {
      console.log(error)
      MySwal.fire(
        "Error!",
        error?.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      setSelectedImage([...files]);
      setNewHotel((prev) => ({
        ...prev,
        images: [...files],
      }));
    } else {
      setNewHotel((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedHotel(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center py-5">Error: {error}</div>;
  }

  return (
    <div className="content-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-wrap align-items-center justify-content-between breadcrumb-content">
                  <h5>Your Hotels</h5>
                  <div className="d-flex flex-wrap align-items-center justify-content-between">
                    <div className="pl-3 border-left btn-new">
                      <button
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                      >
                        New Hotel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row">
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <div className="col-lg-4 col-md-6 mb-4" key={hotel._id}>
                <div className="card card-block card-stretch card-height h-100">
                  <div className="card-header p-0">
                    {hotel.images && hotel.images.length > 0 ? (
                      <img
                        src={`https://hotel-api-ywn8.onrender.com/uploads/${hotel.images[0]}`}
                        className="card-img-top img-fluid"
                        alt={hotel.nom}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="bg-secondary d-flex align-items-center justify-content-center"
                        style={{ height: "200px" }}
                      >
                        <span className="text-white">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">{hotel.nom}</h5>
                      <div className="rating">
                        {Array.from({ length: hotel.nombreEtoiles }).map(
                          (_, i) => (
                            <i
                              key={i}
                              className="ri-star-fill text-warning"
                            />
                          )
                        )}
                      </div>
                    </div>

                    <p className="mb-3 text-muted">{hotel.description.substring(0, 100)}...</p>

                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <i className="ri-map-pin-line mr-2"></i>
                          <small className="text-muted">
                            {hotel.adress.substring(0, 30)}...
                          </small>
                        </div>
                        <span className="badge badge-primary">
                          ${hotel.tarifMoyen}/night
                        </span>
                      </div>

                      <div className="d-flex justify-content-between border-top pt-3">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewDetails(hotel)}
                        >
                          <RiEyeLine className="mr-1" /> View
                        </button>
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => navigate(`/hotels/${hotel._id}/rooms`)}
                        >
                          <RiHotelBedLine className="mr-1" /> Rooms
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleUpdate(hotel)}
                        >
                          <RiPencilLine className="mr-1" /> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(hotel._id)}
                        >
                          <RiDeleteBinLine className="mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info">No hotels found</div>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedHotel && (
        <div
          className={`modal fade ${showDetailsModal ? "show" : ""}`}
          style={{ display: showDetailsModal ? "block" : "none" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Hotel Details</h5>
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
                    {selectedHotel.images && selectedHotel.images.length > 0 ? (
                      <img
                        src={`https://hotel-api-ywn8.onrender.com/uploads/${selectedHotel.images[0]}`}
                        className="img-fluid mb-3"
                        alt={selectedHotel.nom}
                      />
                    ) : (
                      <div
                        className="bg-secondary d-flex align-items-center justify-content-center mb-3"
                        style={{ height: "200px" }}
                      >
                        <span className="text-white">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h4>{selectedHotel.nom}</h4>
                    <p>
                      <strong>Description:</strong> {selectedHotel.description}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedHotel.adress}
                    </p>
                    <p>
                      <strong>Stars:</strong> {selectedHotel.nombreEtoiles}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedHotel.telephone}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedHotel.email}
                    </p>
                    <p>
                      <strong>Rooms:</strong> {selectedHotel.nombreDeChambre}
                    </p>
                    <p>
                      <strong>Average Price:</strong> $
                      {selectedHotel.tarifMoyen}
                    </p>
                    <p>
                      <strong>Services:</strong> {selectedHotel.service}
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

      {/* Update Modal */}
      {selectedHotel && (
        <div
          className={`modal fade ${showUpdateModal ? "show" : ""}`}
          style={{ display: showUpdateModal ? "block" : "none" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Hotel</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowUpdateModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <form onSubmit={handleUpdateSubmit}>
                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="nom"
                          value={selectedHotel.nom || ""}
                          onChange={handleUpdateInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          className="form-control"
                          name="description"
                          value={selectedHotel.description || ""}
                          onChange={handleUpdateInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Address</label>
                        <input
                          type="text"
                          className="form-control"
                          name="adress"
                          value={selectedHotel.adress || ""}
                          onChange={handleUpdateInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Stars</label>
                        <select
                          className="form-control"
                          name="nombreEtoiles"
                          value={selectedHotel.nombreEtoiles || 3}
                          onChange={handleUpdateInputChange}
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          name="telephone"
                          value={selectedHotel.telephone || ""}
                          onChange={handleUpdateInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={selectedHotel.email || ""}
                          onChange={handleUpdateInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Number of Rooms</label>
                        <input
                          type="number"
                          className="form-control"
                          name="nombreDeChambre"
                          value={selectedHotel.nombreDeChambre || ""}
                          onChange={handleUpdateInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Average Price</label>
                        <input
                          type="number"
                          className="form-control"
                          name="tarifMoyen"
                          value={selectedHotel.tarifMoyen || ""}
                          onChange={handleUpdateInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Services</label>
                        <input
                          type="text"
                          className="form-control"
                          name="service"
                          value={selectedHotel.service || ""}
                          onChange={handleUpdateInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <div
        className={`modal fade ${showCreateModal ? "show" : ""}`}
        style={{ display: showCreateModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New Hotel</h5>
              <button
                type="button"
                className="close"
                onClick={() => setShowCreateModal(false)}
              >
                <span>&times;</span>
              </button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Name*</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nom"
                        value={newHotel.nom}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description*</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={newHotel.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Address*</label>
                      <input
                        type="text"
                        className="form-control"
                        name="adress"
                        value={newHotel.adress}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Stars*</label>
                      <select
                        className="form-control"
                        name="nombreEtoiles"
                        value={newHotel.nombreEtoiles}
                        onChange={handleInputChange}
                        required
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Phone*</label>
                      <input
                        type="text"
                        className="form-control"
                        name="telephone"
                        value={newHotel.telephone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email*</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={newHotel.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Number of Rooms*</label>
                      <input
                        type="number"
                        className="form-control"
                        name="nombreDeChambre"
                        value={newHotel.nombreDeChambre}
                        onChange={handleInputChange}
                        required
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label>Average Price*</label>
                      <input
                        type="number"
                        className="form-control"
                        name="tarifMoyen"
                        value={newHotel.tarifMoyen}
                        onChange={handleInputChange}
                        required
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label>Services</label>
                      <input
                        type="text"
                        className="form-control"
                        name="service"
                        value={newHotel.service}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Hotel Image*</label>
                      <input
                        type="file"
                        name="images"
                        multiple
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Hotel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Overlay for modals */}
      {(showDetailsModal || showUpdateModal || showCreateModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
}

export default Hotels;