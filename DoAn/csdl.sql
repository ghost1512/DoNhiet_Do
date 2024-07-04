create database csdl_project;
use csdl_project;
create table nhietdo_data
(
  temperature int , -- Cột nhiệt độ, kiểu số thực, không được rỗng
  humidity int , -- Cột độ ẩm, kiểu số thực, không được rỗng
  times TIME  -- Cột thời gian, kiểu ngày giờ, mặc định là thời gian hiện tại
);

-- Thêm dòng vào bảng
INSERT INTO nhietdo_data (temperature, humidity, times) VALUES (25, 65, '23:00:02'); -- Thêm một dòng với nhiệt độ 25.6 độ C và độ ẩm 65.3%
INSERT INTO nhietdo_data (temperature, humidity, times) VALUES (26, 63, '23:01:00'); -- Thêm một dòng với nhiệt độ 26.2 độ C và độ ẩm 63.8%
INSERT INTO nhietdo_data (temperature, humidity, times) VALUES (28, 70, '23:01:00'); -- Thêm một dòng với nhiệt độ 26.2 độ C và độ ẩm 63.8%

select * from nhietdo_data;