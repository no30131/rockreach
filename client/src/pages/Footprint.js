import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { getUserFromToken } from "../utils/token";
import { useParams, useNavigate } from "react-router-dom";
import "./stylesheets/Footprint.css";
import { Layout } from "antd";
import { deleteToken } from "../utils/token";
import { DEMO_MODE } from "../utils/demo";
import { FAKE_GYM_LOCATIONS } from "../demo/fakeData";
import "leaflet/dist/leaflet.css";

const { Sider, Content } = Layout;

const Footprint = ({ showMessage }) => {
  const { id } = useParams();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [footprints, setFootprints] = useState([]);
  const [climbRecords, setClimbRecords] = useState([]);
  const [currentGym, setCurrentGym] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [footprintData, setFootprintData] = useState({
    visitDate: "",
    visitTimes: 0,
    expiryDate: "",
    gymName: "",
  });
  const navigate = useNavigate();

  const fetchUserFootprints = useCallback(async (fetchId) => {
    try {
      const response = await axios.get(
        `https://node.me2vegan.com/api/footprints/${fetchId}`
      );
      setFootprints(response.data);

      const userNameResponse = await axios.get(
        `https://node.me2vegan.com/api/users/${fetchId}`
      );
      setUserName(userNameResponse.data.name);
    } catch (error) {
      console.error("Error fetching footprints:", error);
    }
  }, []);

  const fetchUserClimbRecords = useCallback(async (userId) => {
    try {
      const response = await axios.get(
        `https://node.me2vegan.com/api/climbRecords/${userId}`
      );
      setClimbRecords(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching climb records:", error);
      return [];
    }
  }, []);

  useEffect(() => {
    if (DEMO_MODE) return; // Demo 模式由下方 Leaflet useEffect 處理

    const user = getUserFromToken();
    if (user) {
      setUserId(user.userId);
      if (!id) {
        fetchUserFootprints(user.userId);
        fetchUserClimbRecords(user.userId);
      }
    } else {
      console.error("No user found");
    }

    if (id) {
      fetchUserFootprints(id);
      fetchUserClimbRecords(id);
    } else if (!user) {
      setIsMapLoaded(true);
    }

    if (!window.google) {
      axios
        .get(`https://node.me2vegan.com/api/footprints/google-maps-api-url`)
        .then((response) => {
          const { url } = response.data;
          const existingScript = document.querySelector(`script[src="${url}"]`);
          if (!existingScript) {
            const script = document.createElement("script");
            script.src = url;
            script.async = true;
            script.onload = () => {
              setIsMapLoaded(true);
            };
            document.body.appendChild(script);
          } else {
            setIsMapLoaded(true);
          }
        });
    } else {
      setIsMapLoaded(true);
    }
  }, [id, fetchUserFootprints, fetchUserClimbRecords, userId]);

  const fetchFootprint = useCallback(
    async (gymId) => {
      try {
        const fetchId = id || userId;
        if (!fetchId) {
          console.log("please log in");
          return;
        }

        const footprintsResponse = await axios.get(
          `https://node.me2vegan.com/api/footprints/${fetchId}`
        );
        const userFootprints = footprintsResponse.data;
        const gymFootprint = userFootprints.find(
          (footprint) => String(footprint.gymId._id) === String(gymId)
        );
        if (gymFootprint) {
          setFootprintData((prevData) => ({
            ...prevData,
            expiryDate: gymFootprint.expiryDate,
          }));
        }
      } catch (error) {
        console.error("Error fetching footprints:", error);
      }
    },
    [id, userId]
  );

  const updateInfoWindowContent = useCallback(
    async (marker, gym) => {
      const gymClimbRecords = climbRecords.filter(
        (record) => record.gymName === gym.name
      );
      let visitDate = "無紀錄";
      let visitTimes = 0;
      if (gymClimbRecords.length > 0) {
        const latestRecord = gymClimbRecords.reduce((latest, record) => {
          return new Date(latest.date) > new Date(record.date)
            ? latest
            : record;
        });
        visitDate = latestRecord.date;
        visitTimes = gymClimbRecords.length;
      }
      const userFootprint = footprints.find(
        (footprint) => String(footprint.gymId._id) === String(gym._id)
      );

      const visitTimesText = "到訪次數：";
      const visitDateText = "上次到訪：";
      const expiryDateText = "會員到期日：";

      const infoWindowContent = `
      <div style="font-size: 15px;">
        ${visitTimesText}${visitTimes}<br/>
        ${visitDateText}${visitDate}<br/>
        ${
          userFootprint
            ? `${expiryDateText}${userFootprint.expiryDate}<br/>`
            : ""
        }
        <br/><strong>${gym.name}</strong><br/>
        ${gym.address}<br/>
        ${gym.phone}<br/><br/>
        ${
          !id && userId
            ? `<button onclick="manageGym('${gym._id}')">管理</button>`
            : ""
        }
      </div>
    `;

      const infoWindow = new window.google.maps.InfoWindow({
        content: infoWindowContent,
      });
      infoWindow.open(window.map, marker);

      if (visitTimes > 0) {
        marker.setIcon({
          url: `${process.env.PUBLIC_URL}/images/boulder-orange.png`,
          scaledSize: new window.google.maps.Size(28, 28),
        });
      }

      setFootprintData({
        visitDate: visitDate,
        visitTimes: visitTimes,
        expiryDate: userFootprint?.expiryDate || "",
        gymName: gym.name,
      });
    },
    [climbRecords, footprints, id, userId]
  );

  const initMap = useCallback(async () => {
    if (!window.google) {
      console.error("Google Maps API未加載");
      return;
    }

    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    window.map = new window.google.maps.Map(mapElement, {
      center: { lat: 25.0478, lng: 121.517 },
      zoom: 12,
    });

    try {
      const response = await axios.get(
        `https://node.me2vegan.com/api/gyms/all`
      );
      const gyms = response.data;

      const service = new window.google.maps.places.PlacesService(window.map);

      const newMarkers = [];

      gyms.forEach(async (gym) => {
        try {
          const geocodeResponse = await axios.get(
            `https://node.me2vegan.com/api/footprints/google-maps/geocode`,
            {
              params: { address: gym.address },
            }
          );

          if (geocodeResponse.data.results.length === 0) {
            return;
          }

          const { lat, lng } =
            geocodeResponse.data.results[0].geometry.location;

          const request = {
            location: { lat, lng },
            radius: "50",
            query: gym.name,
          };

          service.textSearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              const existingPlace = results[0];
              const gymClimbRecords = climbRecords.filter(
                (record) => record.gymName === gym.name
              );
              const marker = new window.google.maps.Marker({
                position: existingPlace.geometry.location,
                map: window.map,
                title: gym.name,
                icon: {
                  url:
                    gymClimbRecords.length > 0
                      ? `${process.env.PUBLIC_URL}/images/boulder-orange.png`
                      : `${process.env.PUBLIC_URL}/images/boulder-grey.png`,
                  scaledSize: new window.google.maps.Size(28, 28),
                },
              });

              marker.addListener("click", () => {
                updateInfoWindowContent(marker, gym);
                fetchFootprint(gym._id);
              });

              newMarkers.push(marker);
            }
          });
        } catch (error) {
          console.error("Error fetching geocode:", error);
        }
      });

      setMarkers(newMarkers);
    } catch (error) {
      console.error("Error fetching gyms:", error);
    }
  }, [climbRecords, fetchFootprint, updateInfoWindowContent]);

  useEffect(() => {
    if (isMapLoaded) {
      initMap();
    }
  }, [isMapLoaded, initMap]);

  useEffect(() => {
    if (footprints.length && climbRecords.length && isMapLoaded) {
      initMap();
    }
  }, [footprints, climbRecords, isMapLoaded, initMap]);

  const saveVisit = async () => {
    const token = getUserFromToken();
    if (!token) {
        deleteToken();
        showMessage("登入超時，請重新登入！", "error");
        setTimeout(() => {
            navigate("/signin");
        }, 1000);
        return;
    }

    try {
      const updatedFootprint = {
        gymId: currentGym,
        userId: userId,
        expiryDate: footprintData.expiryDate,
      };
      const response = await axios.post(
        `https://node.me2vegan.com/api/footprints/create`,
        updatedFootprint
      );

      if (!response) {
        console.log("update footprint faild.");
      }
      closeDetails();
      const footprintsResponse = await axios.get(
        `https://node.me2vegan.com/api/footprints/${userId}`
      );
      setFootprints(footprintsResponse.data);
      const climbRecordsResponse = await fetchUserClimbRecords(userId);
      setClimbRecords(climbRecordsResponse);

      markers.forEach((marker) => {
        updateInfoWindowContent(marker, currentGym);
      });
    } catch (error) {
      console.error("Error creating footprint:", error);
    }
  };

  window.manageGym = (gymId) => {
    setCurrentGym(gymId);
    fetchFootprint(gymId);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setCurrentGym(null);
  };

  const handleShare = async () => {
    const shareLink = `https://rockreach.me2vegan.com/footprint/${userId}`;
    try {
      await navigator.clipboard.writeText(shareLink);
      showMessage("已複製網址到剪貼簿！", "success");
    } catch (error) {
      showMessage("複製網址失敗", "error");
    }
  };

  // Demo 模式：Leaflet 地圖
  const leafletMapRef = useRef(null);
  const leafletInstanceRef = useRef(null);

  useEffect(() => {
    if (!DEMO_MODE) return;
    if (leafletInstanceRef.current) return;

    import('leaflet').then(({ default: L }) => {
      const mapEl = document.getElementById('demo-footprint-map');
      if (!mapEl) return;

      const map = L.map(mapEl).setView([25.053, 121.534], 13);
      leafletInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const makeIcon = (visited) => L.divIcon({
        html: `<div style="width:${visited?18:13}px;height:${visited?18:13}px;background:${visited?'rgb(255,98,0)':'#bbb'};border:3px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
        iconSize: visited ? [18, 18] : [13, 13],
        iconAnchor: visited ? [9, 9] : [6, 6],
        className: '',
      });

      FAKE_GYM_LOCATIONS.forEach(gym => {
        const popup = gym.visited
          ? `<strong>${gym.name}</strong><br>到訪次數：${gym.times}<br>上次到訪：${gym.lastVisit}${gym.expiryDate ? `<br>會員到期：${gym.expiryDate}` : ''}`
          : `<strong>${gym.name}</strong><br><span style="color:#bbb">尚未到訪</span>`;
        L.marker([gym.lat, gym.lng], { icon: makeIcon(gym.visited) })
          .addTo(map)
          .bindPopup(popup);
      });
    });

    return () => {
      if (leafletInstanceRef.current) {
        leafletInstanceRef.current.remove();
        leafletInstanceRef.current = null;
      }
    };
  }, []);

  if (DEMO_MODE) {
    const visited = FAKE_GYM_LOCATIONS.filter(g => g.visited);
    return (
      <div className="footprints-container">
        <div>
          <div id="demo-footprint-map" style={{ height: '70vh', width: '100%', borderRadius: 8, overflow: 'hidden' }}></div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
            <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:13 }}>
              <span style={{ width:12, height:12, background:'rgb(255,98,0)', borderRadius:'50%', display:'inline-block' }}></span>已到訪
            </span>
            <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:13 }}>
              <span style={{ width:12, height:12, background:'#bbb', borderRadius:'50%', display:'inline-block' }}></span>未到訪
            </span>
          </div>
          <div style={{ display:'flex', gap:12, marginTop:12, flexWrap:'wrap' }}>
            {visited.map(g => (
              <div key={g.name} style={{ background:'#fff', borderRadius:8, padding:'12px 16px', boxShadow:'0 2px 6px rgba(0,0,0,.08)', minWidth:160 }}>
                <strong style={{ display:'block', fontSize:16, color:'rgb(255,98,0)', marginBottom:4 }}>{g.times} 次</strong>
                <span style={{ fontSize:14 }}>{g.name}</span><br/>
                <span style={{ fontSize:12, color:'#aaa' }}>上次到訪：{g.lastVisit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="footprints-container">
      {!id && !userId ? (
        <p>請先登入！</p>
      ) : (
        <div>
          {id && (
            <p>
              <strong>{userName} </strong>的足跡地圖
            </p>
          )}
          <Layout className="map-details">
            <Sider
              style={{
                display: showDetails ? "block" : "none",
                background: "rgb(245, 245, 245)",
                height: "80vh",
              }}
            >
              <div>
                <button className="close-btn" onClick={closeDetails}>
                  X
                </button>
                <div className="map-detail-box">
                  <div className="map-detail">
                    <h2>{footprintData.gymName}</h2>
                  </div>
                  <div className="map-detail">
                    <h4>上次到訪日期:</h4>
                    <input
                      type="text"
                      value={footprintData.visitDate || ""}
                      readOnly
                    />
                  </div>
                  <div className="map-detail">
                    <h4>到訪次數:</h4>
                    <input
                      type="number"
                      value={footprintData.visitTimes || 0}
                      readOnly
                    />
                  </div>
                  <div className="map-detail">
                    <h4>會員到期日:</h4>
                    <input
                      type="date"
                      placeholder="請選擇到期日"
                      value={footprintData.expiryDate || ""}
                      onChange={(e) =>
                        setFootprintData({
                          ...footprintData,
                          expiryDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button onClick={saveVisit} className="save-button">
                    儲存
                  </button>
                </div>
              </div>
            </Sider>
            <Content>
              <div id="map" style={{ height: "77vh", width: "100%" }}></div>
            </Content>
          </Layout>
          <div className="map-share-area">
            {!id && userId && (
              <button
                onClick={() => handleShare()}
                className="map-share-button"
              >
                分享
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Footprint;
