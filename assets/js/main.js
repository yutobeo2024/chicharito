// ======================= MÃ JAVASCRIPT TÍCH HỢP API =======================
document.addEventListener('DOMContentLoaded', function() {
    // !!! QUAN TRỌNG: THAY THẾ URL NÀY BẰNG URL WEB APP CỦA BẠN
    const API_URL = 'https://script.google.com/macros/s/AKfycbzHXirXIPG0Lzhc0CKdJNfg1tGCV68OxXL0HHAO8R7w3GwPKzgWcAVC5-JXZfAUMPX6lQ/exec';

    // =================================
    // CẤU HÌNH & KHỞI TẠO THƯ VIỆN
    // =================================

    // Cấu hình simpleCartJS (Giỏ hàng)
    if (typeof simpleCart !== 'undefined') {
        simpleCart({
            cartColumns: [
                { view: (item, column) => `<img src="${item.get('thumb')}" style="width: 80px; height: auto; border: 1px solid #ddd; padding: 2px;">`, label: "Ảnh"},
                { attr: "name", label: "Tên sản phẩm" },
                { view: "decrement", label: false, text: "-" },
                { attr: "quantity", label: "Số lượng" },
                { view: "increment", label: false, text: "+" },
                { attr: "total", label: "Thành tiền", view: 'currency' },
                { view: "remove", text: "Xóa", label: false }
            ],
            cartStyle: "table",
            checkout: {
                type: "SendForm", // Chuyển dữ liệu đến trang thanh toán
                url: "/thanh-toan.html"
            },
            currency: "VND",
            data: {}
        });
    }

    // =================================
    // CÁC HÀM TẢI DỮ LIỆU TỪ API
    // =================================

    // Hàm chung để tải và hiển thị sản phẩm vào một slider
    async function renderProducts(apiUrlAction, containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            // Không làm gì nếu không tìm thấy container trên trang hiện tại
            return;
        }

        container.innerHTML = `<div class="owl-item" style="text-align:center;">Đang tải sản phẩm...</div>`; // Thông báo đang tải

        try {
            const response = await fetch(`${API_URL}?action=${apiUrlAction}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();

            if (result.status === 'success' && result.data.length > 0) {
                let productsHTML = '';
                result.data.forEach(product => {
                    productsHTML += `
                        <div class="item">
                            <div class="product-block">
                                <div class="product-image">
                                    <a href="/chi-tiet-san-pham.html?id=${product.id_sanpham}">
                                        <figure class="product-display">
                                            <img src="${product.hinh_anh_chinh_url}" alt="${product.ten_sanpham}">
                                            <img class="product-secondpic" alt="${product.ten_sanpham}" src="${product.hinh_anh_phu_url || product.hinh_anh_chinh_url}">
                                        </figure>
                                    </a>
                                </div>
                                <div class="item-info">
                                    <div class="info-inner">
                                        <div class="item-title">
                                            <a href="/chi-tiet-san-pham.html?id=${product.id_sanpham}" title="${product.ten_sanpham}">${product.ten_sanpham}</a>
                                        </div>
                                        <div class="item-content">
                                            <div class="item-price">
                                                <div class="price-box">
                                                    <p class="special-price">
                                                        <span class="price">${parseInt(product.gia_ban).toLocaleString('vi-VN')} đ</span>
                                                    </p>
                                                    ${product.gia_cu ? `<p class="old-price"><span class="price">${parseInt(product.gia_cu).toLocaleString('vi-VN')} đ</span></p>` : ''}
                                                </div>
                                            </div>
                                            <div class="product-meta">
                                                <div class="product-action">
                                                    <button class="button btn-cart add_to_cart" onclick="addToCart(event, '${product.ten_sanpham}', ${product.gia_ban}, '${product.hinh_anh_chinh_url}')">
                                                        <i class="fa fa-shopping-cart"></i><span>Thêm vào giỏ</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                container.innerHTML = productsHTML;
                
                // Khởi tạo lại Owl Carousel
                if (jQuery.fn.owlCarousel) {
                    jQuery(containerSelector).owlCarousel({
                        items: 4, itemsDesktop: [1024, 4], itemsDesktopSmall: [900, 3], itemsTablet: [600, 2], itemsMobile: [320, 1],
                        navigation: true, navigationText: ['<a class="flex-prev"></a>', '<a class="flex-next"></a>'], slideSpeed: 500, pagination: false
                    });
                }

            } else {
                container.innerHTML = `<p style="text-align:center;">Chưa có sản phẩm nào.</p>`;
            }
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
            container.innerHTML = '<p style="text-align:center;">Không thể tải sản phẩm. Vui lòng thử lại sau.</p>';
        }
    }

    // Hàm tải và hiển thị tin tức
    async function loadBlogPosts() {
        const blogContainer = document.getElementById('blog-posts-container');
        if(!blogContainer) return;

        blogContainer.innerHTML = `<div>Đang tải tin tức...</div>`;
        
        try {
            const response = await fetch(`${API_URL}?action=getBlogPosts`);
            const result = await response.json();
            
            if(result.status === 'success' && result.data.length > 0) {
                let postsHTML = '';
                result.data.slice(0, 3).forEach(post => { // Giới hạn 3 bài
                    postsHTML += `
                     <article class="blog_entry item col-lg-4 col-md-4 col-sm-6 col-xs-6">
                        <div class="entry-content">
                            <div class="featured-thumb">
                                <a class="ft-thumb" href="/chi-tiet-bai-viet.html?id=${post.id_baiviet}"><img src="${post.hinh_anh_url}" alt="${post.tieu_de}"></a>
                            </div>
                        </div>
                        <header class="blog_entry-header clearfix">
                            <h2 class="blog_entry-title">
                                <a rel="bookmark" href="/chi-tiet-bai-viet.html?id=${post.id_baiviet}">${post.tieu_de}</a> 
                            </h2>
                        </header>
                        <footer class="entry-meta">
                            <time class="entry-date"><i class="fa fa-calendar"></i> ${new Date(post.ngay_dang).toLocaleDateString('vi-VN')}</time>
                        </footer>
                     </article>
                    `;
                });
                blogContainer.innerHTML = postsHTML;
            } else {
                 blogContainer.innerHTML = '<p>Chưa có bài viết nào.</p>';
            }
        } catch(error) {
            console.error('Lỗi khi tải tin tức:', error);
            blogContainer.innerHTML = '<p>Không thể tải tin tức. Vui lòng thử lại sau.</p>';
        }
    }

    // =================================
    // HÀM TƯƠNG TÁC NGƯỜI DÙNG
    // =================================

    // Hàm thêm vào giỏ hàng
    window.addToCart = function(event, name, price, thumb) {
        event.preventDefault();
        simpleCart.add({
            name: name,
            price: price,
            quantity: 1,
            thumb: thumb
        });
        
        // Hiển thị popup thông báo
        if (typeof $ !== 'undefined' && $.fn.modal) {
             $('#popup-cart').modal('show');
        } else {
            alert('Đã thêm sản phẩm vào giỏ hàng!');
        }
    };

    // Hàm xử lý form thanh toán
    function handleCheckoutForm() {
        const form = document.getElementById('checkout-form');
        if (!form) return;

        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const submitBtn = document.getElementById('submit-order-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Đang xử lý...';

            const orderItems = [];
            simpleCart.each(item => {
                orderItems.push({
                    name: item.get('name'),
                    quantity: item.get('quantity'),
                    price: item.get('price')
                });
            });

            if (orderItems.length === 0) {
                alert("Giỏ hàng của bạn đang trống!");
                submitBtn.disabled = false;
                submitBtn.textContent = 'Xác nhận đặt hàng';
                return;
            }

            const orderData = {
                action: 'createOrder',
                orderData: {
                    customerName: document.getElementById('customerName').value,
                    customerEmail: document.getElementById('customerEmail').value,
                    customerPhone: document.getElementById('customerPhone').value,
                    shippingAddress: document.getElementById('shippingAddress').value,
                    notes: document.getElementById('orderNotes').value,
                    total: simpleCart.grandTotal(),
                    items: orderItems
                }
            };
            
            try {
                // Sử dụng 'no-cors' vì Apps Script có thể chặn CORS với POST phức tạp
                await fetch(API_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: JSON.stringify(orderData),
                    headers: { 'Content-Type': 'application/json' }
                });
                
                alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
                simpleCart.empty();
                window.location.href = '/';
                
            } catch (error) {
                console.error('Lỗi khi gửi đơn hàng:', error);
                alert('Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Xác nhận đặt hàng';
            }
        });
    }

    // =================================
    // GỌI CÁC HÀM KHI TRANG TẢI XONG
    // =================================
    renderProducts('getFeaturedProducts', '#featured-products-container .slider-items');
    renderProducts('getNewProducts', '#new-products-container .slider-items');
    loadBlogPosts();
    handleCheckoutForm();

});