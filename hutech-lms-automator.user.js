// ==UserScript==
// @name         HUTECH Auto Video Bypass (Bất tử & Đa năng)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Tự động qua bài, tự nhận diện môn học, không cần F12
// @author       Sang
// @match        *://*.hutech.edu.vn/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hostname !== 'lms.hutech.edu.vn') return;

    console.log("🚀 [Auto-Bypass 3.0] Đã cài cắm. Sẵn sàng quét mọi môn học!");

    setInterval(() => {
        var videoElements = document.querySelectorAll('.xblock-student_view-video, [data-block-type="video"]');
        if (videoElements.length === 0) return;

        videoElements.forEach((el) => {
            if (el.getAttribute('data-hacked') === 'true') return;

            var videoId = el.getAttribute('data-usage-id');
            if (!videoId) return;

            var csrfMatch = document.cookie.match(/csrftoken=([^;]+)/);
            var token = csrfMatch ? csrfMatch[1] : '';
            if (!token) return;

            // TUYỆT CHIÊU 3.0: Tự động trích xuất mã môn học từ chính ID của video
            // Ví dụ: block-v1:VJ+SKL115... -> course-v1:VJ+SKL115...
            var courseId = videoId.split('+type@')[0].replace('block-v1:', 'course-v1:');

            var publishUrl = `https://lms.hutech.edu.vn/courses/${courseId}/xblock/${videoId}/handler/publish_completion`;

            // Đánh dấu đã hack để không spam server
            el.setAttribute('data-hacked', 'true');

            fetch(publishUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "X-CSRFToken": token,
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: JSON.stringify({ "completion": 1.0 })
            })
            .then(res => {
                var shortId = videoId.substring(videoId.lastIndexOf('@')+1, videoId.lastIndexOf('@')+9);
                if (res.ok) {
                    console.log(`✅ [Auto-Bypass] ĐÃ HACK XONG VIDEO: ${shortId} (Môn: ${courseId.substring(10, 20)}...)`);
                } else {
                    console.error(`❌ [Auto-Bypass] Server từ chối (Mã ${res.status}) ở video: ${shortId}`);
                }
            })
            .catch(err => console.error(`❌ [Auto-Bypass] Lỗi kết nối mạng:`, err));
        });
    }, 3000);
})();