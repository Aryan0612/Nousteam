import React, { useState } from "react";
import * as XLSX from "xlsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import GaugeChart from "react-gauge-chart";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('cellDetails'); // For handling active tab display

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="App">
      <h1>Noustem Internship task</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      
      {/* Buttons for tab navigation */}
      <div className="button-container">
        <button className={`tab-button ${activeTab === 'cellDetails' ? 'active' : ''}`} onClick={() => setActiveTab('cellDetails')}>Cell Details</button>
        <button className={`tab-button ${activeTab === 'cellScores' ? 'active' : ''}`} onClick={() => setActiveTab('cellScores')}>Cell Scores</button>
        <button className={`tab-button ${activeTab === 'interestLevel' ? 'active' : ''}`} onClick={() => setActiveTab('interestLevel')}>Interest Level</button>
      </div>

      {/* Render content based on active tab */}
      {data.length > 0 && (
        <div>
          {activeTab === 'cellDetails' && (
            <>
              <h2>Call Details</h2>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Call ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row["call id"]}</TableCell>
                        <TableCell>{row["Date"]}</TableCell>
                        <TableCell>{row["Time"]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {activeTab === 'cellScores' && (
            <>
              <h2>Call Scores</h2>
              <BarChart width={600} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="call id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Overall Call score" fill="#8884d8" />
              </BarChart>
            </>
          )}

          {activeTab === 'interestLevel' && (
            <>
              <h2>Interest Level</h2>
              <GaugeChart
                id="gauge-chart"
                nrOfLevels={10}
                percent={data[0]["interest_level.1"]}
                textColor="#000"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
