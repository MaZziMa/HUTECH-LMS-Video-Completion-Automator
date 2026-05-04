# HUTECH LMS Video Completion Automator

![Version](https://img.shields.io/badge/version-3.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Tampermonkey-green.svg)
![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)
![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)

HUTECH LMS Video Completion Automator là một Userscript được phát triển nhằm tự động hóa quy trình xác nhận tiến độ xem video bài giảng trên hệ thống E-learning của HUTECH (xây dựng dựa trên nền tảng Open edX). Dự án ra đời với mục đích tối ưu hóa thao tác người dùng, tương tác trực tiếp với API của hệ thống để đánh dấu hoàn thành học liệu một cách trơn tru.

## Tính năng chính (Key Features)

*   **Tự động hóa hoàn toàn (Full Automation):** Tự động gửi tín hiệu xác nhận hoàn thành khi người dùng truy cập vào học liệu video. Quá trình diễn ra ngầm (background), không yêu cầu can thiệp thủ công qua Developer Tools.
*   **Nhận diện định tuyến động (Dynamic Routing Identification):** Áp dụng thuật toán bóc tách chuỗi (string manipulation) và biểu thức chính quy (Regex) để tự động trích xuất `Course ID` từ `Usage ID` của video. Đảm bảo script hoạt động ổn định trên mọi khóa học mà không cần cập nhật mã nguồn (hardcode).
*   **Tương thích kiến trúc SPA (SPA Resilience):** Tích hợp vòng lặp kiểm tra nền (background polling) giúp script liên tục theo dõi sự thay đổi của DOM, đảm bảo hoạt động bền bỉ khi người dùng điều hướng giữa các thành phần trong kiến trúc Single Page Application (không cần tải lại trang).
*   **Xác thực bảo mật (CSRF Handling):** Tự động truy xuất và đính kèm `X-CSRFToken` từ hệ thống Cookie của phiên làm việc hiện tại, đáp ứng đầy đủ yêu cầu xác thực bảo mật của Open edX đối với các HTTP POST request.
*   **Tối ưu hóa luồng gọi API (Request Throttling):** Áp dụng cơ chế gắn cờ trạng thái (`data-flagged`) cho các thành phần DOM đã được xử lý. Điều này ngăn chặn việc gọi API trùng lặp, tiết kiệm tài nguyên mạng và tránh gây bất thường trên máy chủ.

## Yêu cầu hệ thống (Prerequisites)

*   Trình duyệt web hỗ trợ nhân Chromium (Google Chrome, Microsoft Edge, Brave) hoặc Mozilla Firefox.
*   Tiện ích quản lý script: **[Tampermonkey](https://www.tampermonkey.net/)** (khuyến nghị) hoặc Greasemonkey.

## Hướng dẫn cài đặt (Installation)

1. Đảm bảo trình duyệt đã được cài đặt tiện ích **Tampermonkey**.
2. Truy cập vào biểu tượng tiện ích Tampermonkey trên trình duyệt, chọn **Create a new script...**
3. Xóa mã mẫu mặc định trong trình soạn thảo.
4. Sao chép toàn bộ nội dung của tệp [`hutech-lms-automator.user.js`](./hutech-lms-automator.user.js) trong repository này và dán vào trình soạn thảo.
5. Nhấn `Ctrl + S` (hoặc `Cmd + S` trên macOS) để lưu cấu hình.

## Hướng dẫn sử dụng (Usage)

Sau khi cài đặt thành công, script sẽ tự động khởi chạy khi thỏa mãn điều kiện tên miền.

1. Đăng nhập vào hệ thống học tập [LMS HUTECH](https://lms.hutech.edu.vn/).
2. Điều hướng đến khóa học và chọn học liệu định dạng Video.
3. Duy trì màn hình hiện tại trong khoảng **3 giây** (thời gian trễ được thiết lập để đảm bảo DOM đã render hoàn toàn).
4. Hệ thống sẽ tự động ghi nhận trạng thái hoàn thành (100% completion) đối với video hiện tại thông qua API.

*(Nhà phát triển có thể theo dõi tiến trình thực thi và các phản hồi từ API thông qua tab `Console` trong Developer Tools).*

## Nguyên lý hoạt động (Architecture & Workflow)

Luồng thực thi của script được thiết kế tuân thủ theo luồng trao đổi dữ liệu tiêu chuẩn của Open edX:

1.  **Origin Verification:** Script kiểm tra `window.location.hostname` để giới hạn phạm vi hoạt động chỉ trong môi trường iframe chứa video (`lms.hutech.edu.vn`).
2.  **DOM Polling:** Khởi tạo `setInterval` (chu kỳ 3000ms) nhằm quét các phần tử mang thuộc tính `data-block-type="video"`.
3.  **Data Preprocessing:** 
    *   Trích xuất token xác thực từ document cookie.
    *   Chuyển đổi chuỗi định dạng (ví dụ: `block-v1:...` chuyển thành `course-v1:...`) để thiết lập URL endpoint chính xác.
4.  **API Communication:** Sử dụng Fetch API để gửi payload `{"completion": 1.0}` qua phương thức `POST` tới endpoint `/handler/publish_completion`.

## Cảnh báo trách nhiệm (Disclaimer)

*   **Mục đích giáo dục (Educational Purposes Only):** Dự án này được thiết kế và chia sẻ dưới dạng một Proof of Concept (PoC) nhằm minh họa cách thức tương tác với các hệ thống Web API và kiến trúc Frontend hiện đại.
*   Tác giả không khuyến khích việc lạm dụng phần mềm để bỏ qua quy trình học tập tiêu chuẩn, và từ chối mọi trách nhiệm liên quan đến các vấn đề vi phạm chính sách học vụ hoặc rủi ro đối với tài khoản cá nhân của người sử dụng.

## Đóng góp (Contributing)

Chúng tôi hoan nghênh các đóng góp từ cộng đồng nhằm tối ưu hóa mã nguồn, cải thiện hiệu năng hoặc đối phó với các bản cập nhật từ nền tảng LMS.

1. Fork repository này.
2. Tạo Feature Branch mới (`git checkout -b feature/Optimization`).
3. Commit các thay đổi (`git commit -m 'Add performance optimization'`).
4. Push lên nhánh gốc (`git push origin feature/Optimization`).
5. Tạo Pull Request để được review.

## Tác giả (Author)

**Sang Le**
* GitHub: [@MaZziMa](https://github.com/MaZziMa)

## Giấy phép (License)

Dự án này được phân phối dưới các điều khoản của [MIT License](LICENSE).
