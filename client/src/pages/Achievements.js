import React, { useState, useEffect } from "react";
import axios from "axios";
import { deleteToken, getUserFromToken } from "../utils/token";
import "./stylesheets/Achievements.css";
import { useNavigate } from "react-router-dom";
import { FaShare } from "react-icons/fa";
import { DEMO_MODE } from "../utils/demo";
import { FAKE_WALLS, FAKE_ROUTES, FAKE_ACHIEVEMENTS_INITIAL } from "../demo/fakeData";

const routeTypes = [
  { name: "Crimpy", icon: `${process.env.PUBLIC_URL}/images/icon_crimpy.png` },
  { name: "Dyno", icon: `${process.env.PUBLIC_URL}/images/icon_dyno.png` },
  { name: "Slope", icon: `${process.env.PUBLIC_URL}/images/icon_slope.png` },
  { name: "Power", icon: `${process.env.PUBLIC_URL}/images/icon_power.png` },
  { name: "Pump", icon: `${process.env.PUBLIC_URL}/images/icon_pump.png` },
];

const Achievements = ({ showMessage }) => {
  const [walls, setWalls] = useState([]);
  const [selectedWall, setSelectedWall] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [userId, setUserId] = useState(null);
  const [achievements, setAchievements] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserFromToken();
    if (user) setUserId(user.userId);

    if (DEMO_MODE) {
      setWalls(FAKE_WALLS);
      return;
    }

    const fetchWalls = async () => {
      try {
        const response = await axios.get(
          `https://node.me2vegan.com/api/customs/achievement/walls`
        );
        setWalls(response.data);
      } catch (error) {
        console.error("Error fetching walls data:", error);
      }
    };
    fetchWalls();
  }, []);

  const handleWallSelect = async (wall) => {
    setSelectedWall(wall);

    if (DEMO_MODE) {
      const fakeRouteData = FAKE_ROUTES[wall.wallName];
      setRoutes(fakeRouteData ? fakeRouteData.customs : []);
      setAchievements(FAKE_ACHIEVEMENTS_INITIAL);
      return;
    }

    try {
      const routesResponse = await axios.get(
        `https://node.me2vegan.com/api/customs/achievement/walls/${wall.wallName}`
      );
      setRoutes(routesResponse.data.customs);

      const achievementsResponse = await axios.get(
        `https://node.me2vegan.com/api/achievements/${userId}`
      );
      const userAchievements = achievementsResponse.data.reduce(
        (acc, achievement) => {
          acc[achievement.customName] = achievement.status;
          return acc;
        },
        {}
      );
      setAchievements(userAchievements);
    } catch (error) {
      console.error("Error fetching wall details or achievements:", error);
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  const handleSaveAchievement = async () => {
    if (!userId || !selectedRoute) return;

    if (DEMO_MODE) {
      setAchievements({ ...achievements, [selectedRoute.customName]: "completed" });
      showMessage("完成狀態已更新 🎉", "success");
      return;
    }

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
      const response = await axios.post(
        `https://node.me2vegan.com/api/achievements/create`,
        {
          userId,
          customName: selectedRoute.customName,
          status: "completed",
        }
      );

      if (response.status === 200 || response.status === 201) {
        setAchievements({
          ...achievements,
          [selectedRoute.customName]: "completed",
        });
        showMessage("完成狀態已更新", "success");
      } else {
        showMessage("完成狀態更新失敗，請稍後再試", "error");
      }
    } catch (error) {
      console.error("Error saving achievement: ", error);
      showMessage("伺服器異常，請稍後再試", "error");
    }
  };

  const handleShare = async () => {
    const shareLink = `https://rockreach.me2vegan.com/achievement/${userId}/${selectedWall.wallName}`;
    try {
      await navigator.clipboard.writeText(shareLink);
      showMessage("已複製網址到剪貼簿！", "success");
    } catch (error) {
      showMessage("複製網址失敗", "error");
    }
  };

  const handleReturn = () => {
    if (!selectedRoute) {
      setSelectedWall(null);
    } else {
      setSelectedRoute(null);
    }
  };

  const completedCount = routes.filter(
    (route) => achievements[route.customName] === "completed"
  ).length;

  const getRouteTypeIcon = (typeName) => {
    const type = routeTypes.find((routeType) => routeType.name === typeName);
    return type ? type.icon : "";
  };

  return (
    <div className="achievements-container">
      {!selectedWall ? (
        <div className="walls-list">
          {walls.map((wall, index) => (
            <div
              key={index}
              className="wall-item"
              onClick={() => handleWallSelect(wall)}
            >
              <h4>{wall.wallName}</h4>
              <img src={wall.originalImage} alt={wall.wallName} />
            </div>
          ))}
        </div>
      ) : (
        <div className="wall-data">
          <button onClick={handleReturn} className="return-button">
            <img src={`${process.env.PUBLIC_URL}/images/undo.png`} alt="return" />
          </button>
          <div
            className={`custom-item-details ${!selectedRoute ? "" : "hidden"}`}
          >
            <div className="custom-item-details-h3-div">
              <h3>{selectedWall.wallName}</h3>
            </div>
            <img src={selectedWall.originalImage} alt={selectedWall.wallName} />
          </div>

          {selectedRoute && (
            <div className="route-details">
              <div className="route-details-data">
                <p className="route-details-data-name">
                  {selectedRoute.customName}
                </p>
                <div className="route-types">
                  {selectedRoute.customType.map((type, index) => (
                    <img key={index} src={getRouteTypeIcon(type)} alt={type} />
                  ))}
                </div>
                {selectedRoute.memo && (
                  <p className="custom-memo">Memo: {selectedRoute.memo}</p>
                )}
              </div>
              <img src={selectedRoute.processedImage} alt="Processed" />
              {achievements[selectedRoute.customName] !== "completed" &&
                userId && (
                  <button
                    onClick={handleSaveAchievement}
                    className="complete-custom-button"
                  >
                    完成
                  </button>
                )}
            </div>
          )}
          {routes.length > 0 && (
            <div className="route-list-box">
              <div className="routes-list">
                <h4>路線列表:</h4>
                {routes.map((route, index) => (
                  <div
                    key={index}
                    className={`route-item ${
                      selectedRoute &&
                      selectedRoute.customName === route.customName
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleRouteSelect(route)}
                  >
                    <h4>{route.customName}</h4>
                    {achievements[route.customName] === "completed" && (
                      <pre className="completed-text"> 已完成！</pre>
                    )}
                  </div>
                ))}
              </div>{" "}
            </div>
          )}
          <div className="complete-count-area">
            <p>
              已完成數量: {completedCount}/{routes.length}
            </p>
            {userId && (
              <div className="Achievements-share-button">
                <button onClick={handleShare}>
                  <FaShare />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;
