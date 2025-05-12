import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Leaderboard.css';

function Leaderboard({ userName, onLogout }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://cosc484-project-group-4.onrender.com/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setLeaders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load leaderboard:', err);
        setLoading(false);
      });
  }, []);

  const goBack = () => navigate(-1);

  return (
    <div className="leaderboard-screen">
      <button className="back-button" onClick={goBack}>Back</button>
      <button className="logout-button" onClick={onLogout}>Logout</button>
      <h1 className="menu-title">Leaderboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr className="header-row">
              <th>Rank</th>
              <th>User</th>
              <th>High Score</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((user, index) => (
              <tr key={user.userName}>
                <td>{index + 1}</td>
                <td>{user.userName}</td>
                <td>{user.highScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;
