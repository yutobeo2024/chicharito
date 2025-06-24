// =============================================================
//                       MAIN JAVASCRIPT FILE
// =============================================================

// ----- PHẦN 1: DÁN MÃ THƯ VIỆN VÀO ĐÂY -----

// Dán toàn bộ nội dung file jquery.min.js vào đây
// Dán toàn bộ nội dung file simplecart.js vào đây
// Dán toàn bộ nội dung file owl.carousel.js vào đây

// ----- PHẦN 2: MÃ TÙY CHỈNH CỦA BẠN -----

// Mã này sẽ chỉ chạy sau khi tất cả các thư viện ở trên đã được định nghĩa.
$(document).ready(function() {
    
    // !!! QUAN TRỌNG: Thay thế URL này bằng URL Web App của bạn
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
                type: "SendForm",
                url: "/thanh-toan.html"
            },
            currency: "VND",
            data: {}
        });
    }

    // =================================
    // CÁC HÀM TẢI DỮ LIỆU TỪ API
    // =================================
    
    // ... (Giữ nguyên các hàm renderProducts, loadBlogPosts, ... như phiên bản trước) ...
    
    async function renderProducts(apiUrlAction, containerSelector) {
        // ... (Mã hàm renderProducts giữ nguyên)
    }
    
    async function loadBlogPosts() {
        // ... (Mã hàm loadBlogPosts giữ nguyên)
    }

    async function loadProductDetail() {
        // ... (Mã hàm loadProductDetail giữ nguyên)
    }
    
    async function loadPostDetail() {
        // ... (Mã hàm loadPostDetail giữ nguyên)
    }

    // =================================
    // HÀM TƯƠNG TÁC NGƯỜI DÙNG
    // =================================

    window.addToCart = function(event, name, price, thumb) {
        event.preventDefault();
        simpleCart.add({
            name: name,
            price: price,
            quantity: 1,
            thumb: thumb
        });
        if (typeof $ !== 'undefined' && $.fn.modal) {
             $('#popup-cart').modal('show');
        } else {
            alert('Đã thêm sản phẩm vào giỏ hàng!');
        }
    };
    
    function handleCheckoutForm() {
        // ... (Mã hàm handleCheckoutForm giữ nguyên)
    }

    // =================================
    // GỌI CÁC HÀM KHI TRANG TẢI XONG
    // =================================
    renderProducts('getFeaturedProducts', '#featured-products-container .slider-items');
    renderProducts('getNewProducts', '#new-products-container .slider-items');
    loadBlogPosts();
    handleCheckoutForm();
    
    // Các hàm cho trang chi tiết sẽ tự kiểm tra sự tồn tại của container
    loadProductDetail(); 
    loadPostDetail();

    // Script dành riêng cho trang giỏ hàng
    if (window.location.pathname.includes('gio-hang.html')) {
        simpleCart.ready(function() {
            function checkCartState() {
                if (simpleCart.quantity() === 0) {
                    $('#empty-cart-message').show();
                    $('#cart-summary').hide();
                    $('.simpleCart_items').hide();
                } else {
                    $('#empty-cart-message').hide();
                    $('#cart-summary').show();
                    $('.simpleCart_items').show();
                }
            }
            checkCartState();
            simpleCart.bind('update', checkCartState);
        });
    }
});