// js/main.js

// 🚨 QUAN TRỌNG: THAY THẾ URL DƯỚI ĐÂY BẰNG ENDPOINT CỦA BẠN
const MOCKAPI_BASE_URL = "YOUR_MOCKAPI_BASE_URL/api/v1";
const USERS_URL = `${MOCKAPI_BASE_URL}/users`;

let currentRole = null;
let currentUserId = null;

/**
 * Cập nhật giao diện dựa trên trạng thái đăng nhập
 * @param {object | null} user - Thông tin người dùng đã đăng nhập hoặc null nếu đăng xuất
 */
function updateUI(user) {
  if (user) {
    // Đã đăng nhập
    currentRole = user.role;
    currentUserId = user.id;

    $("#authButtons").hide();
    $("#userGreeting").css("display", "flex");
    $("#userName").text(
      `Xin chào, ${user.name} (${
        user.role === "admin" ? "Quản trị viên" : "Người dùng"
      })`
    );
    $("#authModal").hide();
    $("#tourListContainer").show(); // Hiển thị nội dung chính
  } else {
    // Chưa đăng nhập (Logout)
    currentRole = null;
    currentUserId = null;

    $("#authButtons").show();
    $("#userGreeting").hide();
    $("#tourListContainer").hide();

    // Hiển thị form Đăng nhập mặc định
    $("#authModal").show();
    $("#loginForm").show();
    $("#registerForm").hide();
    $("#authTitle").text("Đăng Nhập");
  }
}

// Kiểm tra Local Storage khi load trang (kiểm tra phiên)
function checkSession() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    try {
      const user = JSON.parse(loggedInUser);
      updateUI(user);
    } catch (e) {
      localStorage.removeItem("loggedInUser");
      updateUI(null);
    }
  } else {
    updateUI(null);
  }
}

// Xử lý Đăng Xuất
$("#btnLogout").click(function () {
  localStorage.removeItem("loggedInUser");
  updateUI(null);
});

// Chạy khi DOM đã sẵn sàng
$(document).ready(function () {
  checkSession();
});
