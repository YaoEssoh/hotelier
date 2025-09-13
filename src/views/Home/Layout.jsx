import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import api from '../../services/api';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

function Layout() {
  const [hotelStats, setHotelStats] = useState({
    totalHotels: 0,
    totalChambres: 0,
    tarifMoyenGlobal: 0,
    totalEvaluations: 0,
    noteMoyenne: null
  });
  
  const [reservationStats, setReservationStats] = useState({
    nombreClients: 0,
    totalReservations: 0,
    pendingCount: 0,
    confirmedCount: 0,
    cancelledCount: 0,
    dureeMoyenne: 0,
    totalRevenus: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create refs for each chart
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const hotelOverviewChartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = localStorage.getItem("user");
        const userParsed = JSON.parse(user);
        const clientId = userParsed?.utilisateur?._id;
        
        // Fetch both statistics in parallel
        const [reservationResponse, hotelResponse] = await Promise.all([
          api.getReservationStatistic(),
          api.getHotelStatistic()
        ]);
        
        console.log("statistique hotel", hotelResponse.data.stats);
        console.log("statistique reservations", reservationResponse.data);

        // Mettre à jour les états avec les données reçues
        setHotelStats({
          totalHotels: hotelResponse.data?.stats.totalHotels || 0,
          totalChambres: hotelResponse.data?.stats.totalChambres || 0,
          tarifMoyenGlobal: hotelResponse.data?.stats.tarifMoyenGlobal || 0,
          totalEvaluations: hotelResponse.data?.stats.totalEvaluations || 0,
          noteMoyenne: hotelResponse.data?.stats.noteMoyenne || null
        });

        console.log("statistique hotel ch", hotelStats.totalChambres);


        setReservationStats({
          nombreClients: reservationResponse.data?.stats?.nombreClients || 0,
          totalReservations: reservationResponse.data?.stats?.totalReservations || 0,
          pendingCount: reservationResponse.data?.stats?.pendingCount || 0,
          confirmedCount: reservationResponse.data?.stats?.confirmedCount || 0,
          cancelledCount: reservationResponse.data?.stats?.cancelledCount || 0,
          dureeMoyenne: reservationResponse.data?.stats?.dureeMoyenne || 0,
          totalRevenus: reservationResponse.data?.stats?.totalRevenus || 0
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to destroy charts
    return () => {
      if (pieChartRef.current) {
        pieChartRef.current.destroy();
      }
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
      if (hotelOverviewChartRef.current) {
        hotelOverviewChartRef.current.destroy();
      }
    };
  }, []);

  if (loading) return <div className="text-center py-5">Loading statistics...</div>;
  if (error) return <div className="text-center py-5 text-danger">Error: {error}</div>;

  // Data for charts
  const reservationStatusData = {
    labels: ['Pending', 'Confirmed', 'Cancelled'],
    datasets: [
      {
        data: [
          reservationStats.pendingCount,
          reservationStats.confirmedCount,
          reservationStats.cancelledCount
        ],
        backgroundColor: [
          '#FFCE56',
          '#36A2EB',
          '#FF6384'
        ],
        hoverBackgroundColor: [
          '#FFCE56',
          '#36A2EB',
          '#FF6384'
        ]
      }
    ]
  };

  const revenueData = {
    labels: ['Total Revenue'],
    datasets: [
      {
        label: 'Revenue',
        backgroundColor: '#4BC0C0',
        borderColor: '#4BC0C0',
        borderWidth: 1,
        hoverBackgroundColor: '#4BC0C0',
        hoverBorderColor: '#4BC0C0',
        data: [reservationStats.totalRevenus]
      }
    ]
  };

  const hotelOverviewData = {
    labels: ['Total Hotels', 'Total Rooms', 'Avg. Price'],
    datasets: [
      {
        label: 'Hotel Overview',
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ],
        data: [
          hotelStats.totalHotels,
          hotelStats.totalChambres,
          hotelStats.tarifMoyenGlobal
        ]
      }
    ]
  };

  return (

     <div className="content-page">
     
       <div className="container-fluid">
  

      {/* Summary Cards */}
      <div className="row">
        {/* Hotel Stats */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Hotels
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {hotelStats.totalHotels}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-hotel fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Total Rooms
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {hotelStats.totalChambres}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-bed fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Average Price
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    ${hotelStats.tarifMoyenGlobal}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Average Rating
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {hotelStats.noteMoyenne || 'N/A'}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-star fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row">
        {/* Reservation Status Pie Chart */}
        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Reservation Status</h6>
            </div>
            <div className="card-body">
              <div className="chart-pie pt-4 pb-2">
                <Pie 
                  ref={pieChartRef}
                  data={reservationStatusData} 
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }} 
                />
              </div>
              <div className="mt-4 text-center small">
                <span className="mr-2">
                  <i className="fas fa-circle text-warning"></i> Pending: {reservationStats.pendingCount}
                </span>
                <span className="mr-2">
                  <i className="fas fa-circle text-primary"></i> Confirmed: {reservationStats.confirmedCount}
                </span>
                <span className="mr-2">
                  <i className="fas fa-circle text-danger"></i> Cancelled: {reservationStats.cancelledCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Bar Chart */}
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Revenue Overview</h6>
            </div>
            <div className="card-body">
              <div className="chart-bar">
                <Bar
                  ref={barChartRef}
                  data={revenueData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-4 text-center">
                <h4 className="text-gray-800">Total Revenue: ${reservationStats.totalRevenus}</h4>
                <p className="text-muted">Average Stay Duration: {reservationStats.dureeMoyenne} days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="row">
        {/* Hotel Overview Bar Chart */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Hotel Overview</h6>
            </div>
            <div className="card-body">
              <Bar
                ref={hotelOverviewChartRef}
                data={hotelOverviewData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Customer Stats */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Customer Statistics</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card border-left-info shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                            Total Customers
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {reservationStats.nombreClients}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-users fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <div className="card border-left-success shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                            Total Reservations
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {reservationStats.totalReservations}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-calendar-check fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="card border-left-warning shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                            Customer Reviews
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {hotelStats.totalEvaluations} reviews
                          </div>
                          <div className="mt-2">
                            {hotelStats.noteMoyenne ? (
                              <>
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <i 
                                    key={i} 
                                    className={`fas fa-star ${i < Math.floor(hotelStats.noteMoyenne) ? 'text-warning' : 'text-gray-300'}`}
                                  ></i>
                                ))}
                                <span className="ml-2">({hotelStats.noteMoyenne}/5)</span>
                              </>
                            ) : 'No ratings yet'}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-star fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
     </div>
  
  );
};

export default Layout;