// js/auth.js

// ----------------------------------------------------
// I. XỬ LÝ ĐĂNG KÝ (Tạo tài khoản mới & Kiểm tra trùng lặp)
// ----------------------------------------------------

$("#registerForm").submit(function (e) {
  e.preventDefault();

  const name = $("#registerName").val().trim();
  const email = $("#registerEmail").val().trim();
  const password = $("#registerPassword").val();
  const confirmPassword = $("#confirmPassword").val();

  $("#passwordMismatch").hide();
  $("#authAlert").hide().removeClass("alert-danger alert-success").text("");

  // Kiểm tra mật khẩu khớp
  if (password !== confirmPassword) {
    $("#passwordMismatch").show();
    return;
  }

  const newUser = {
    name: name,
    email: email,
    password: password,
    role: "regular", // Mặc định khi đăng ký là Người dùng thường
  };

  // Bước 1: Kiểm tra email trùng lặp (GET MockAPI)
  $.get(USERS_URL, { email: newUser.email })
    .done(function (users) {
      if (users.length > 0) {
        // Email đã tồn tại
        $("#authAlert")
          .addClass("alert-danger")
          .text("Email này đã được sử dụng. Vui lòng chọn email khác.")
          .show();
      } else {
        // Bước 2: Tạo tài khoản mới (POST MockAPI)
        $.post(USERS_URL, newUser)
          .done(function (createdUser) {
            $("#authAlert")
              .addClass("alert-success")
              .text("Đăng ký thành công! Vui lòng Đăng nhập.")
              .show();

            // Chuyển về form Đăng nhập sau 2 giây
            setTimeout(() => {
              $("#registerForm").hide();
              $("#loginForm").show();
              $("#authTitle").text("Đăng Nhập");
              $("#authAlert").hide();
              $("#registerForm")[0].reset();
            }, 2000);
          })
          .fail(function () {
            $("#authAlert")
              .addClass("alert-danger")
              .text("Lỗi hệ thống khi tạo tài khoản.")
              .show();
          });
      }
    })
    .fail(function () {
      $("#authAlert")
        .addClass("alert-danger")
        .text("Lỗi kết nối MockAPI khi kiểm tra email.")
        .show();
    });
});

// ----------------------------------------------------
// II. XỬ LÝ ĐĂNG NHẬP (Lưu Role & Phân quyền)
// ----------------------------------------------------

$("#loginForm").submit(function (e) {
  e.preventDefault();

  const email = $("#loginEmail").val().trim();
  const password = $("#loginPassword").val();

  $("#authAlert").hide().removeClass("alert-danger alert-success").text("");

  // Lấy user theo email và kiểm tra mật khẩu
  $.get(USERS_URL, { email: email })
    .done(function (users) {
      if (users.length === 1) {
        const user = users[0];
        if (user.password === password) {
          // Đăng nhập thành công!
          // Lưu thông tin phiên (Role) vào Local Storage
          localStorage.setItem(
            "loggedInUser",
            JSON.stringify({
              id: user.id,
              name: user.name,
              role: user.role, // Lưu Role để phân quyền
            })
          );

          updateUI(user); // Cập nhật giao diện (từ main.js)
          $("#loginForm")[0].reset();
        } else {
          $("#authAlert")
            .addClass("alert-danger")
            .text("Mật khẩu không đúng.")
            .show();
        }
      } else {
        $("#authAlert")
          .addClass("alert-danger")
          .text("Email không tồn tại.")
          .show();
      }
    })
    .fail(function () {
      $("#authAlert")
        .addClass("alert-danger")
        .text("Lỗi kết nối MockAPI khi đăng nhập.")
        .show();
    });
});

// ----------------------------------------------------
// III. XỬ LÝ CHUYỂN FORM
// ----------------------------------------------------

// Chuyển sang Đăng nhập
$("#btnShowLogin, #switchToLogin").click(function (e) {
  e.preventDefault();
  $("#authTitle").text("Đăng Nhập");
  $("#loginForm").show();
  $("#registerForm").hide();
  $("#authAlert").hide();
  $("#authModal").show();
  $("#tourListContainer").hide();
});

// Chuyển sang Đăng ký
$("#btnShowRegister, #switchToRegister").click(function (e) {
  e.preventDefault();
  $("#authTitle").text("Đăng Ký Tài Khoản");
  $("#loginForm").hide();
  $("#registerForm").show();
  $("#authAlert").hide();
  $("#authModal").show();
  $("#tourListContainer").hide();
});
