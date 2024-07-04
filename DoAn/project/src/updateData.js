
// Hàm cập nhật nhiệt độ, độ ẩm và thời gian thật
function updateData() {
    // Lấy các phần tử HTML theo id
    const temperature = document.getElementById("temperature");
    const humidity = document.getElementById("humidity");
    const times = document.getElementById("times");
    // Sử dụng Fetch API để gửi yêu cầu đến web servers
    // Thay đổi địa chỉ web server theo thực tế
    fetch("http://10.106.27.84:8081/get")
        .then((response) => response.json()) // Chuyển đổi phản hồi sang JSON
        .then((data) => {
            // Cập nhật nội dung cho các phần tử HTML
            temperature.textContent = data.temperature + "°C";
            humidity.textContent = data.humidity + "%";
            times.textContent = data.times;
        })
        .catch((error) => {
            // Bắt lỗi nếu có
            console.error(error);
        });
}
// Gọi hàm cập nhật dữ liệu lần đầu tiên
updateData();
// Đặt bộ đếm thời gian để gọi hàm cập nhật dữ liệu mỗi 5 giây
setInterval(updateData, 5000);