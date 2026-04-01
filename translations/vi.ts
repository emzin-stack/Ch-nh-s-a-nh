/**
 * ─── Vietnamese Translations ──────────────────────────────────────────────────
 * NEW FILE: translations/vi.ts
 *
 * Must have exactly the same keys as en.ts.
 * TypeScript enforces this via the `satisfies` operator at the bottom.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { en } from './en';

export const vi = {
  // ─── Navbar ────────────────────────────────────────────────────────────────
  nav_editor:        'Trình chỉnh sửa',
  nav_history:       'Lịch sử',
  nav_signout:       'Đăng xuất',
  nav_login:         'Đăng nhập',
  nav_register:      'Đăng ký',

  // ─── Landing page ──────────────────────────────────────────────────────────
  home_badge:        'Xử lý ảnh ngay trên trình duyệt',
  home_headline_1:   'Chỉnh sửa ảnh với',
  home_headline_2:   'Tốc độ ánh sáng',
  home_subtitle:     'Nén, cắt, chuyển đổi và so sánh — tất cả ngay trong trình duyệt. Không tải lên máy chủ bên thứ ba. Không giới hạn.',
  home_cta_editor:   'Mở trình chỉnh sửa',
  home_cta_register: 'Tạo tài khoản miễn phí',
  home_footer:       'PixelForge — ảnh được xử lý hoàn toàn trong trình duyệt của bạn.',

  // ─── Feature cards (landing) ───────────────────────────────────────────────
  feat_compress_title: 'Nén thông minh',
  feat_compress_desc:  'Giảm kích thước tệp mà không ảnh hưởng đến chất lượng.',
  feat_crop_title:     'Cắt linh hoạt',
  feat_crop_desc:      '1:1, 16:9, 9:16 hoặc tự do — cắt với độ chính xác từng pixel.',
  feat_compare_title:  'Trước / Sau',
  feat_compare_desc:   'So sánh bằng thanh trượt theo thời gian thực.',
  feat_download_title: 'Tải xuống ngay',
  feat_download_desc:  'Tải xuống dạng JPG, PNG, WebP hoặc GIF ngay lập tức.',
  feat_history_title:  'Lịch sử chỉnh sửa',
  feat_history_desc:   'Truy cập 10 lần chỉnh sửa gần nhất, mọi lúc, mọi thiết bị.',
  feat_secure_title:   'Riêng tư & Bảo mật',
  feat_secure_desc:    'Ảnh của bạn luôn thuộc về bạn. Xử lý ngay trên trình duyệt.',

  // ─── Auth pages ────────────────────────────────────────────────────────────
  login_title:          'Chào mừng trở lại',
  login_subtitle:       'Đăng nhập để xem lịch sử chỉnh sửa của bạn',
  login_email_label:    'EMAIL',
  login_password_label: 'MẬT KHẨU',
  login_submit:         'Đăng nhập',
  login_no_account:     'Chưa có tài khoản?',
  login_signup_link:    'Đăng ký miễn phí',
  login_guest_link:     'Tiếp tục không đăng nhập →',

  register_title:          'Tạo tài khoản',
  register_subtitle:       'Lưu lại chỉnh sửa, truy cập mọi lúc, mọi nơi',
  register_email_label:    'EMAIL',
  register_password_label: 'MẬT KHẨU',
  register_confirm_label:  'XÁC NHẬN MẬT KHẨU',
  register_submit:         'Tạo tài khoản',
  register_have_account:   'Đã có tài khoản?',
  register_signin_link:    'Đăng nhập',
  register_guest_link:     'Tiếp tục không đăng nhập →',
  register_success_title:  'Tạo tài khoản thành công!',
  register_success_sub:    'Đang chuyển hướng đến trình chỉnh sửa…',
  register_err_short:      'Mật khẩu phải có ít nhất 6 ký tự.',
  register_err_mismatch:   'Mật khẩu xác nhận không khớp.',

  // ─── Editor page ───────────────────────────────────────────────────────────
  editor_section_image:    'Ảnh',
  editor_section_tools:    'Công cụ',
  editor_section_actions:  'Thao tác',
  editor_section_preview:  'Xem trước',
  editor_section_compare:  'Trước / Sau',

  editor_original:         'Gốc',
  editor_edited:           'Đã chỉnh sửa',
  editor_no_image_title:   'Chưa có ảnh',
  editor_no_image_sub:     'Tải ảnh lên bằng bảng bên trái',
  editor_processing:       'Đang xử lý…',

  editor_btn_download:     'Tải xuống ảnh đã chỉnh sửa',
  editor_btn_save:         'Lưu vào lịch sử',
  editor_btn_reset:        'Đặt lại',
  editor_btn_signin_save:  'Đăng nhập để lưu lịch sử',

  editor_size_comparison:  'SO SÁNH KÍCH THƯỚC',
  editor_smaller:          '↓ Nhỏ hơn {{pct}}%',
  editor_guest_title:      'Lưu công việc của bạn',
  editor_guest_body:       'để lưu và truy cập lại các chỉnh sửa.',
  editor_guest_link:       'Tạo tài khoản miễn phí',

  editor_toast_invalid:    'Tệp không hợp lệ. Vui lòng tải lên JPG, PNG, GIF hoặc WebP dưới 20 MB.',
  editor_toast_loaded:     'Đã tải: {{name}}',
  editor_toast_compressed: 'Nén thành công!',
  editor_toast_cropped:    'Đã áp dụng cắt ảnh!',
  editor_toast_converted:  'Đã chuyển sang .{{format}}!',
  editor_toast_no_image:   'Không có ảnh đã chỉnh sửa để tải xuống.',
  editor_toast_downloaded: 'Đã bắt đầu tải xuống!',
  editor_toast_signin:     'Đăng nhập để lưu lịch sử chỉnh sửa.',
  editor_toast_nothing:    'Chưa có gì để lưu.',
  editor_toast_saved:      'Đã lưu vào lịch sử!',
  editor_toast_save_fail:  'Lưu lịch sử thất bại. Kiểm tra cài đặt Supabase Storage.',

  // ─── Image Uploader ────────────────────────────────────────────────────────
  upload_drop:       'Kéo ảnh vào đây hoặc nhấn để tải lên',
  upload_hint:       'JPG, PNG, GIF, WebP · Tối đa 20 MB',
  upload_loading:    'Đang tải…',
  upload_replace:    'Thay thế',

  // ─── Compression Tool ──────────────────────────────────────────────────────
  compress_presets:    'CHUẨN ĐẶT SẴN',
  compress_quality:    'CHẤT LƯỢNG',
  compress_smallest:   'Nhỏ nhất',
  compress_highest:    'Chất lượng cao nhất',
  compress_original:   'Gốc',
  compress_estimated:  'Ước tính',
  compress_reduction:  'Giảm dung lượng:',
  compress_smaller:    '~{{pct}}% nhỏ hơn',
  compress_apply:      'Áp dụng nén',
  compress_excellent:  'Xuất sắc',
  compress_good:       'Tốt',
  compress_medium:     'Trung bình',
  compress_low:        'Thấp',
  compress_very_low:   'Rất thấp',

  // ─── Crop Tool ─────────────────────────────────────────────────────────────
  crop_upload_prompt: 'Tải ảnh lên để sử dụng công cụ cắt',
  crop_ratio:         'TỈ LỆ KHUNG',
  crop_zoom:          'THU PHÓNG',
  crop_free:          'Tự do',
  crop_reset:         'Đặt lại',
  crop_apply:         'Áp dụng cắt',

  // ─── Format Converter ──────────────────────────────────────────────────────
  format_output:         'ĐỊNH DẠNG ĐẦU RA',
  format_photos:         'Tốt nhất cho ảnh',
  format_lossless:       'Chất lượng không mất dữ liệu',
  format_modern:         'Hiện đại & hiệu quả',
  format_animated:       'Ảnh động',
  format_no_alpha:       'Không hỗ trợ trong suốt',
  format_alpha:          'Hỗ trợ trong suốt ✓',
  format_limited:        'Màu sắc giới hạn',
  format_warning:        '⚠ Vùng trong suốt sẽ thành màu trắng',
  format_apply:          'Chuyển đổi định dạng',

  // ─── Before/After Slider ───────────────────────────────────────────────────
  compare_title:         'So sánh Trước / Sau',
  compare_empty:         'Tải ảnh lên và áp dụng chỉnh sửa để so sánh',
  compare_before:        'Trước',
  compare_after:         'Sau',
  compare_hint:          '← Kéo để so sánh →',
  compare_no_edits:      'Áp dụng chỉnh sửa để xem so sánh',

  // ─── Tool Panel tabs ───────────────────────────────────────────────────────
  tool_compress: 'Nén',
  tool_crop:     'Cắt',
  tool_convert:  'Chuyển đổi',

  // ─── History page ──────────────────────────────────────────────────────────
  history_title:       'Lịch sử chỉnh sửa',
  history_subtitle:    '{{count}} ảnh chỉnh sửa gần nhất · Tối đa 10',
  history_subtitle_pl: '{{count}} ảnh chỉnh sửa gần nhất · Tối đa 10',
  history_new_edit:    'Chỉnh sửa mới',
  history_loading:     'Đang tải lịch sử…',
  history_empty_title: 'Chưa có chỉnh sửa nào',
  history_empty_sub:   'Bắt đầu chỉnh sửa ảnh và lịch sử sẽ hiển thị ở đây.',
  history_open_editor: 'Mở trình chỉnh sửa',
  history_cap_note:    'Lịch sử giới hạn 10 mục. Các mục cũ nhất sẽ tự động bị xóa.',
  history_download:    'Tải xuống',
  history_before:      'Trước',
  history_after:       'Sau',

  history_type_compression: 'Đã nén',
  history_type_crop:        'Đã cắt',
  history_type_format:      'Đã chuyển đổi',
  history_type_combined:    'Kết hợp',

  // ─── Loading / fallback ────────────────────────────────────────────────────
  loading:           'Đang tải…',
  signin_to_view:    'Vui lòng đăng nhập để xem lịch sử.',
  signin_arrow:      'Đăng nhập →',
} satisfies Record<keyof typeof en, string>;