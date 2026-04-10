import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TEAMS, ALL_SPORTS } from '../data/constants';
import { LEADERBOARD } from '../data/leagueData';
import { ArrowUpDown } from 'lucide-react';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: 'total', direction: 'desc' });

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getTotal = (points) => Object.values(points).reduce((sum, val) => sum + (val || 0), 0);

  const sortedData = [...LEADERBOARD].sort((a, b) => {
    const aValue = sortConfig.key === 'total' ? getTotal(a.points) : (a.points[sortConfig.key] || 0);
    const bValue = sortConfig.key === 'total' ? getTotal(b.points) : (b.points[sortConfig.key] || 0);
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const getTeam = (id) => TEAMS.find(t => t.id === id);

  return (
    <div className="container" style={{ width: '100%' }}>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th></th>
              <th className="clickable" onClick={() => handleSort('total')} style={{ minWidth: '120px' }}>
                <div className="flex items-center gap-2">
                  Total Points
                  <ArrowUpDown size={14} opacity={sortConfig.key === 'total' ? 1 : 0.3} />
                </div>
              </th>
              {ALL_SPORTS.map(sport => (
                <th key={sport.id} className="clickable" onClick={() => handleSort(sport.id)}>
                  <div className="flex items-center gap-2">
                    <span onClick={(e) => { e.stopPropagation(); navigate(`/fixtures?sport=${sport.id}`) }} style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}>
                      {sport.name}
                    </span>
                    <ArrowUpDown size={14} opacity={sortConfig.key === sport.id ? 1 : 0.3} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map(row => {
              const team = getTeam(row.teamId);
              const cellStyle = { background: team.color, color: team.text, fontWeight: 'bold' };
              
              return (
                <tr key={row.teamId}>
                   {/* First Column Sticky */}
                  <td 
                    className="clickable" 
                    onClick={() => navigate(`/fixtures?team=${team.id}`)}
                    style={cellStyle}
                  >
                    {team.name}
                  </td>
                  <td style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{getTotal(row.points)}</td>
                  {ALL_SPORTS.map(sport => (
                    <td key={sport.id} style={cellStyle}>
                      {row.points[sport.id] || 0}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
