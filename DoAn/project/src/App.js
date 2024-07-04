import React, { useState, useEffect } from 'react';
import axios from 'axios';
import updateData from './updateData.js';
import './App.css';


export function App() {
  const [formdata, setformdata] = useState({ id: "", temperature: "", humidity: "", time: "" });
  const [data, setData] = useState([]);
  const { id, temperature, humidity, times } = formdata;
  const [TempStatus, settempStatus] = useState(false);
  const [HumidStatus, sethumidStatus] = useState(false);


  const [temp, settemp] = useState(0)
  const [humid, sethumid] = useState(0)

  useEffect(() => {
    axios.get("http://192.168.52.95:8081/get")
      .then((response) => {
        console.log("done");
        setData(response.data); // cập nhật data bằng dữ liệu từ response
        updateData(data);
      })
      .catch((error) => {
        console.error(error); // bắt lỗi nếu có
      });
  }, [data]);

  const TurnOnOfftemp = () => {
    axios.get(`http://192.168.52.98/turnOnOfftemp?temp=${temp}`).then((response) => {
      console.log("done");
    });
    settempStatus(!TempStatus);
  };
  const TurnOnOffhumid = () => {
    axios.get(`http://192.168.52.98/turnOnOffhumid?humid=${humid}`).then((response) => {
      console.log("done");
    });
    sethumidStatus(!HumidStatus);
  };

  return (
    <div className="container">
      <div className='Header'>
        <div id='icon1'>
          <span className=" button-icon">
            <i className="fa-solid fa-bars"></i>
          </span>
        </div>
        <h1 id='tieude'>Room Temperature</h1>
        <div id='icon2'>
          <span className=" button-icon">
            <i className="fa fa-arrows-rotate"></i>
          </span>
        </div>
        <div id='icon3'>
          <span className=" button-icon">
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </span>
        </div>
      </div>
      <div className='Cel'>
        <h1 id='chu'>Celsius   (C)</h1>
        <div className='time'>
          {data.map((items) => (
            <div className="timeline">
              <p id="timein">  <span id="time">{items.times} </span></p>
            </div>
          ))}
        </div>
      </div>
      <div className='Main'>
        <div className='Khung1'>
          <h2>Thông số nhiệt độ và độ ẩm</h2>
        </div>
        <div className='Khung2'>
          <img id='hinh' src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/225px-Flag_of_Vietnam.svg.png'></img>
          <h1>TpHCM, VN</h1>
        </div>
        <div className="row">
          {data.map((items) => (
            <div className='item'>
              <div className="col">
                <div id='icon5'>
                  <span className=" button-icon">
                    <i className="fa-solid fa-temperature-low"></i>
                  </span>
                </div>

                <h3>Nhiệt độ</h3>
                <p id="temp">{items.temperature}°C</p>

              </div>

              <div className="col">
                <div id='icon6'>
                  <span className=" button-icon">
                    <i className="fa fa fa-droplet-degree"></i>
                  </span>
                </div>
                <h3>Độ ẩm</h3>
                <p id="humid">{items.humidity}%</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );

}
export default App;