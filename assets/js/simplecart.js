// NỘI DUNG NÀY LÀ CỦA THƯ VIỆN simpleCartJS
function Cart() {
    var e = this;
    e.nextId = 1;
    e.Version = "2.2";
    // ... và toàn bộ mã của thư viện simpleCart ...
    // ...
    simpleCart.initialize()
};
if (typeof jQuery !== "undefined") $(document)
    .ready(function () {
        simpleCart.initialize()
    });
else if (typeof Prototype !== "undefined") Event.observe(window, "load", function () {
    simpleCart.initialize()
});