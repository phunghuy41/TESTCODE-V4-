# 19.11 — Chuyên Hạ Long · V4

## Trải nghiệm
- Trang mở đầu ưu tiên tuyệt đối một video duy nhất.
- Khi video kết thúc, màn hình chuyển cảnh toàn màn hình mời người xem khám phá Vườn Trái Tim.
- Bên dưới video luôn có lời nhắc và nút cuộn xuống khu vực 36 lá thư.
- 36 trái tim được giữ theo bố cục của V3.2; mỗi trái tim mở đúng lời chúc của lớp tương ứng.
- Có lọc theo khối, tìm kiếm không phân biệt dấu, mở thư ngẫu nhiên, giao diện sáng/tối.

## Thêm video sau này
Mở `data.js`, tìm:
`const FEATURED_VIDEO = { title: "Thước phim 19/11", src: "" };`

Đặt video vào thư mục `media/`, rồi điền đường dẫn, ví dụ:
`const FEATURED_VIDEO = { title: "Thước phim 19/11", src: "media/video-1911.mp4" };`

Chỉ khai báo một video. Khuyến nghị MP4 (H.264/AAC). Khi phát hết video, màn hình chuyển cảnh sẽ tự xuất hiện.

## Cấu trúc
- `index.html`: bố cục video-first, Vườn Trái Tim và hộp thư.
- `style.css`: giao diện xanh băng/đen than, hiệu ứng và responsive.
- `app.js`: phát hiện video kết thúc, chuyển cảnh, lọc/tìm lớp, mở thư.
- `data.js`: đủ 36 lời chúc theo đúng khối và lớp.
- `media/`: để trống đến khi có video thật.

## Lưu ý
Video hiện chưa có nên trang đang hiển thị trạng thái chờ. Chức năng upload video từ khách truy cập và đồng bộ video lên máy chủ chưa được triển khai; video sẽ được chủ website thêm vào thư mục media trước khi xuất bản.
