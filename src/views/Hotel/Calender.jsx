import { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, List, Typography, Divider, Tag } from "antd";
import api from "../../services/api";

const { Text } = Typography;
const localizer = momentLocalizer(moment);

function ReservationCalendar() {
  const [reservations, setReservations] = useState([]);
  const [eventsCountByDate, setEventsCountByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reservationsForSelectedDate, setReservationsForSelectedDate] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await api.getReservations();
      const reservationsData = response.data.listeData;

      if (!reservationsData || !Array.isArray(reservationsData)) {
        throw new Error("Reservations data is invalid or not found");
      }

      const formattedReservations = reservationsData.map((reservation) => {
        return {
          id: reservation._id,
          title: `Réservation: ${reservation.client?.[0]?.nom || 'Inconnu'}`,
          start: new Date(reservation.dateDebut),
          end: new Date(reservation.dateFin),
          statut: reservation.statut,
          client: reservation.client?.[0],
          total: reservation.total,
          nombreDeNuits: reservation.nombreDeNuits,
          chambre: reservation.chambre
        };
      });

      const countByDate = formattedReservations.reduce((acc, reservation) => {
        const dateStart = moment(reservation.start).format("YYYY-MM-DD");
        const dateEnd = moment(reservation.end).format("YYYY-MM-DD");
        
        // Compter pour chaque jour de la réservation
        const startDate = moment(reservation.start);
        const endDate = moment(reservation.end);
        
        let currentDate = startDate.clone();
        while (currentDate.isSameOrBefore(endDate, 'day')) {
          const dateStr = currentDate.format("YYYY-MM-DD");
          acc[dateStr] = (acc[dateStr] || 0) + 1;
          currentDate.add(1, 'day');
        }
        
        return acc;
      }, {});

      setEventsCountByDate(countByDate);
      setReservations(formattedReservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDateSelect = (date) => {
    const dateStr = moment(date).format("YYYY-MM-DD");
    const selectedReservations = reservations.filter(
      (reservation) =>
        moment(reservation.start).isSameOrBefore(date, 'day') &&
        moment(reservation.end).isSameOrAfter(date, 'day')
    );
    setSelectedDate(date);
    setReservationsForSelectedDate(selectedReservations);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };



  const eventComponent = ({ event }) => (
    <div style={{ 
      padding: '2px',
      borderRadius: '3px',
      backgroundColor: getStatusColor(event.statut),
      color: 'white',
      fontSize: '12px'
    }}>
      {event.title}
    </div>
  );

  const dayPropGetter = (date) => {
    const dateStr = moment(date).format("YYYY-MM-DD");
    const eventCount = eventsCountByDate[dateStr] || 0;
    let style = {};

    if (eventCount > 0 && eventCount < 3) {
      style = { backgroundColor: "rgba(255, 165, 0, 0.2)" };
    } else if (eventCount >= 3) {
      style = { backgroundColor: "rgba(255, 0, 0, 0.2)" };
    }

    return { style };
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmé':
        return '#52c41a';
      case 'Pending':
        return '#faad14';
      case 'Annulé':
        return '#f5222d';
      default:
        return '#d9d9d9';
    }
  };

  return (
    <div className="content-page">
          <div className="container-fluid">
            
          <div style={{ position: "relative", marginTop: "10px" }}>
        <Calendar
          localizer={localizer}
          events={reservations}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "650px" }}
          components={{
            event: eventComponent,
            toolbar: () => null, 
          }}
          onSelectSlot={(slotInfo) => handleDateSelect(new Date(slotInfo.start))}
          selectable={true}
          // views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          dayPropGetter={dayPropGetter}
        />
      </div>

      <Modal
        title={`Réservations pour le ${selectedDate ? moment(selectedDate).format("DD/MM/YYYY") : ""}`}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
        bodyStyle={{ padding: "20px" }}
      >
        <List
          dataSource={reservationsForSelectedDate}
          renderItem={(reservation) => (
            <List.Item
              style={{
                cursor: "pointer",
                border: "1px solid #e8e8e8",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "15px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
              }}
            >
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ fontSize: "16px" }}>
                    {reservation.title}
                  </Text>
                  <Tag color={getStatusColor(reservation.statut)}>
                    {reservation.statut}
                  </Tag>
                </div>
                
                <Divider style={{ margin: "10px 0" }} />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <Text strong>Client:</Text> {reservation.client?.nom} {reservation.client?.prenom}<br />
                    <Text strong>Email:</Text> {reservation.client?.email}<br />
                    <Text strong>Téléphone:</Text> {reservation.client?.numero}<br />
                  </div>
                  <div>
                    <Text strong>Dates:</Text> {moment(reservation.start).format("DD/MM/YYYY")} - {moment(reservation.end).format("DD/MM/YYYY")}<br />
                    <Text strong>Nombre de nuits:</Text> {reservation.nombreDeNuits}<br />
                    <Text strong>Total:</Text> {reservation.total} €<br />
                    <Text strong>Chambre:</Text> {reservation.chambre?.numero || 'Non attribuée'}<br />
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Modal>
          </div>

    </div>
  
  );
}

export default ReservationCalendar;