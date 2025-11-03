//js đăng nhập google
  
    // Hàm decode JWT token
    function parseJwt(token) {
      try {
        console.log("Đang decode token...");
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const userInfo = JSON.parse(jsonPayload);
        console.log("User info decoded:", userInfo);
        return userInfo;
      } catch (e) {
        console.error("Lỗi decode token:", e);
        return null;
      }
    }

    // Hàm cập nhật UI (giống popup Google)
    function updateUI(userInfo) {
      console.log("Cập nhật UI với userInfo:", userInfo);
      const userSection = document.getElementById('user-section');
      if (userInfo && userInfo.name) {
        const firstName = userInfo.given_name || userInfo.name.split(' ')[0];
        userSection.innerHTML = `
          <div class="dropdown">
            <img src="${userInfo.picture}" alt="User avatar" width="32" height="32" right="20" class=" rounded-1 dropdown-toggle " data-bs-toggle="dropdown" style="cursor: pointer;  onerror="this.src='https://via.placeholder.com/32?text=${userInfo.name.charAt(0).toUpperCase()}'">
            <ul class="dropdown-menu dropdown-menu-end" style="min-width: 250px; background: #202124; border: none; border-radius: 8px; padding: 12px;">
              <li class="dropdown-item text-white p-2 border-bottom" style="border-bottom: 1px solid #5f6368;">
                <div class="d-flex align-items-center">
                  <div class="me-3">
                    <div class="rounded-circle bg-primary d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; font-size: 18px; color: white;">
                      ${userInfo.name.charAt().toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div class="fw-bold text-white">${userInfo.name}</div>
                    <div class="text-muted small">${userInfo.email}</div>
                  </div>
                </div>
              </li>
              <li><hr class="dropdown-divider bg-secondary"></li>
              <li class="dropdown-item text-white p-2">
                <button id="logout-btn" class="btn btn-link text-danger w-100 text-start p-0" style="pointer-events: auto;">
                  <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                </button>
              </li>
            </ul>
          </div>
        `;
        
        // Event cho logout
        setTimeout(() => {
          const logoutBtn = document.getElementById('logout-btn');
          if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
              e.preventDefault();
              console.log("Đăng xuất clicked!");
              if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
                google.accounts.id.disableAutoSelect();
              }
              localStorage.removeItem('userToken');
              updateUI(null);
            });
          }
        }, 100);
      } else {
        console.log("Reset UI về nút đăng nhập");
        userSection.innerHTML = `
          <button id="google-login-btn" class="btn google-btn">
            <img src="./img/g-logo.png" width="20" alt="Google logo">
            Đăng nhập với Google
          </button>
        `;
        // Render button với try-catch
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
          try {
            setTimeout(() => {
              google.accounts.id.renderButton(
                document.getElementById("google-login-btn"),
                { theme: "filled", size: "large", type: "standard" }
              );
              console.log("Google button rendered thành công");
            }, 100);
          } catch (error) {
            console.error("Render button fail (có thể do origin không hợp lệ):", error);
          }
        } else {
          console.error("Google script chưa load đầy đủ!");
        }
      }
    }

    // Callback từ Google
    function handleCredentialResponse(response) {
      console.log("Callback fired! Response:", response);
      const token = response.credential;
      if (!token) {
        console.error("Không có token từ Google!");
        return;
      }
      const userInfo = parseJwt(token);
      if (userInfo) {
        localStorage.setItem('userToken', token);
        updateUI(userInfo);
      } else {
        console.error("Decode token fail!");
      }
    }

    // Khởi tạo
    window.onload = function () {
      console.log("Trang load, khởi tạo Google...");
      
      // Kiểm tra saved token
      const savedToken = localStorage.getItem('userToken');
      if (savedToken) {
        console.log("Có saved token, kiểm tra...");
        const userInfo = parseJwt(savedToken);
        if (userInfo && userInfo.exp * 1000 > Date.now()) {
          console.log("Token valid, load UI từ saved");
          setTimeout(() => updateUI(userInfo), 200);
          return;
        } else {
          console.log("Token expired, xóa");
          localStorage.removeItem('userToken');
        }
      }

      // Fallback: Luôn render button custom trước nếu chưa login
      updateUI(null);

      // Khởi tạo Google nếu chưa login
      if (typeof google === 'undefined') {
        console.error("Google script chưa load! Kiểm tra <script src='https://accounts.google.com/gsi/client'>");
        return;
      }

      google.accounts.id.initialize({
        client_id: "853533629897-kguvohuvjqnbo18q517vbls6dk23p6bd.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: false
      });

      // Render button với try-catch
      try {
        setTimeout(() => {
          google.accounts.id.renderButton(
            document.getElementById("google-login-btn"),
            { theme: "filled", size: "large", type: "standard" }
          );
          console.log("Google button rendered");
        }, 300);
      } catch (error) {
        console.error("Khởi tạo button fail:", error);
      }
    };
   
//js hiệu ứng heart giao diện 
  
    // Pagination JS
    document.addEventListener('DOMContentLoaded', function() {
      const paginationLinks = document.querySelectorAll('#pagination .page-link');
      paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const page = this.getAttribute('data-page');
          if (page === 'prev' || page === 'next') {
            // Handle prev/next logic here if needed (e.g., change current page)
            console.log('Navigating to', page);
            return;
          }
          const pageNum = parseInt(page);
          // Remove active class from all
          paginationLinks.forEach(l => {
            l.parentElement.classList.remove('active');
          });
          // Add active to clicked
          this.parentElement.classList.add('active');
          console.log('Switched to page', pageNum);
          // Here you can add logic to load content for that page
        });
      });
    });

    // ========== HIỆU ỨNG HEART JS (Tách riêng) ==========
   // Hiệu Ứng Heart Liên Mạch Giữa Trang: Persist State localStorage + Tạo Ngay Khi Load
function createHeart(size) {
  const heart = document.createElement('div');
  heart.classList.add('heart', size);
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.animationDuration = (Math.random() * 2 + 2) + 's'; /* Random duration */
  heart.style.opacity = Math.random() * 0.8 + 0.2;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 3000); /* Fade-out chậm hơn để liên mạch */
}

// Start Interval Tạo Hearts
function startEffects() {
  const interval = setInterval(() => {
    if (document.querySelectorAll('.heart').length < 20) {
      const size = Math.random() > 0.5 ? 'large' : 'small';
      createHeart(size);
    }
  }, 200); /* Interval chậm hơn để mượt */
  return interval;
}

// Toggle Heart (Lưu State localStorage)
let effectInterval = null;
const toggleBtn = document.getElementById('effectToggle');
if (toggleBtn) {
  // Load State Từ localStorage Khi Trang Load
  const savedState = localStorage.getItem('heartEffectOn') === 'true';
  if (savedState) {
    effectInterval = startEffects();
    toggleBtn.title = 'Tắt hiệu ứng Heart';
    toggleBtn.innerHTML = '<i class="bi bi-heart-fill"></i>'; /* Trái tim đầy nếu on */
    // Tạo 5-10 hearts ngay để liên mạch từ trang cũ
    for (let i = 0; i < Math.random() * 5 + 5; i++) {
      setTimeout(() => createHeart(Math.random() > 0.5 ? 'large' : 'small'), i * 100);
    }
  } else {
    toggleBtn.title = 'Bật hiệu ứng Heart';
    toggleBtn.innerHTML = '<i class="bi bi-heart"></i>'; /* Trái tim rỗng nếu off */
  }

  toggleBtn.addEventListener('click', () => {
    const isOn = effectInterval !== null;
    if (isOn) {
      clearInterval(effectInterval);
      effectInterval = null;
      document.querySelectorAll('.heart').forEach(e => e.remove()); /* Xóa hearts khi off */
      localStorage.setItem('heartEffectOn', 'false');
      toggleBtn.title = 'Bật hiệu ứng Heart';
      toggleBtn.innerHTML = '<i class="bi bi-heart"></i>'; /* Rỗng khi tắt */
    } else {
      effectInterval = startEffects();
      localStorage.setItem('heartEffectOn', 'true');
      toggleBtn.title = 'Tắt hiệu ứng Heart';
      toggleBtn.innerHTML = '<i class="bi bi-heart-fill"></i>'; /* Đầy khi bật */
    }
  });
}

function previewMiniSite(siteUrl) {
  window.location.href = `preview.html?site=${encodeURIComponent(siteUrl)}`
}


