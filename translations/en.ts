/**
 * ─── English Translations ─────────────────────────────────────────────────────
 * NEW FILE: translations/en.ts
 *
 * Every user-facing string in the app lives here.
 * Keys are shared with vi.ts — TypeScript will error if vi.ts is missing a key.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const en = {
  // ─── Navbar ────────────────────────────────────────────────────────────────
  nav_editor:        'Editor',
  nav_history:       'History',
  nav_signout:       'Sign out',
  nav_login:         'Login',
  nav_register:      'Register',

  // ─── Landing page ──────────────────────────────────────────────────────────
  home_badge:        'Browser-Native Image Processing',
  home_headline_1:   'Edit Images at',
  home_headline_2:   'Light Speed',
  home_subtitle:     'Compress, crop, convert and compare — all inside your browser. No uploads to third-party servers. No limits.',
  home_cta_editor:   'Open Editor',
  home_cta_register: 'Create Free Account',
  home_footer:       'PixelForge — images processed entirely in your browser.',

  // ─── Feature cards (landing) ───────────────────────────────────────────────
  feat_compress_title: 'Smart Compression',
  feat_compress_desc:  'Reduce file size without sacrificing visual quality.',
  feat_crop_title:     'Flexible Cropping',
  feat_crop_desc:      '1:1, 16:9, 9:16 or free-form — crop with pixel precision.',
  feat_compare_title:  'Before / After',
  feat_compare_desc:   'Real-time slider comparison of original vs edited.',
  feat_download_title: 'Instant Download',
  feat_download_desc:  'Download in JPG, PNG, WebP or GIF instantly.',
  feat_history_title:  'Edit History',
  feat_history_desc:   'Access your last 10 edits, any time, any device.',
  feat_secure_title:   'Private & Secure',
  feat_secure_desc:    'Your images stay yours. Processed in-browser.',

  // ─── Auth pages ────────────────────────────────────────────────────────────
  login_title:          'Welcome back',
  login_subtitle:       'Sign in to access your edit history',
  login_email_label:    'EMAIL',
  login_password_label: 'PASSWORD',
  login_submit:         'Sign In',
  login_no_account:     "Don't have an account?",
  login_signup_link:    'Sign up free',
  login_guest_link:     'Continue as guest →',

  register_title:          'Create account',
  register_subtitle:       'Save your edits, access history anywhere',
  register_email_label:    'EMAIL',
  register_password_label: 'PASSWORD',
  register_confirm_label:  'CONFIRM PASSWORD',
  register_submit:         'Create Account',
  register_have_account:   'Already have an account?',
  register_signin_link:    'Sign in',
  register_guest_link:     'Continue as guest →',
  register_success_title:  'Account created!',
  register_success_sub:    'Redirecting you to the editor…',
  register_err_short:      'Password must be at least 6 characters.',
  register_err_mismatch:   'Passwords do not match.',

  // ─── Editor page ───────────────────────────────────────────────────────────
  editor_section_image:    'Image',
  editor_section_tools:    'Tools',
  editor_section_actions:  'Actions',
  editor_section_preview:  'Preview',
  editor_section_compare:  'Before / After',

  editor_original:         'Original',
  editor_edited:           'Edited',
  editor_no_image_title:   'No image loaded',
  editor_no_image_sub:     'Upload an image using the panel on the left',
  editor_processing:       'Processing…',

  editor_btn_download:     'Download Edited',
  editor_btn_save:         'Save to History',
  editor_btn_reset:        'Reset Edits',
  editor_btn_signin_save:  'Sign in to save history',

  editor_size_comparison:  'SIZE COMPARISON',
  editor_smaller:          '↓ {{pct}}% smaller',
  editor_guest_title:      'Save your work',
  editor_guest_body:       'to save and re-access your edits.',
  editor_guest_link:       'Create a free account',

  editor_toast_invalid:    'Invalid file. Please upload a JPG, PNG, GIF, or WebP under 20 MB.',
  editor_toast_loaded:     'Loaded: {{name}}',
  editor_toast_compressed: 'Compression applied!',
  editor_toast_cropped:    'Crop applied!',
  editor_toast_converted:  'Converted to .{{format}}!',
  editor_toast_no_image:   'No edited image to download.',
  editor_toast_downloaded: 'Download started!',
  editor_toast_signin:     'Sign in to save your edit history.',
  editor_toast_nothing:    'Nothing to save yet.',
  editor_toast_saved:      'Saved to history!',
  editor_toast_save_fail:  'Failed to save history. Check Supabase storage settings.',

  // ─── Image Uploader ────────────────────────────────────────────────────────
  upload_drop:       'Drop image here or click to upload',
  upload_hint:       'JPG, PNG, GIF, WebP · Max 20 MB',
  upload_loading:    'Loading…',
  upload_replace:    'Replace',

  // ─── Compression Tool ──────────────────────────────────────────────────────
  compress_presets:    'PRESETS',
  compress_quality:    'QUALITY',
  compress_smallest:   'Smallest',
  compress_highest:    'Highest quality',
  compress_original:   'Original',
  compress_estimated:  'Estimated',
  compress_reduction:  'Reduction:',
  compress_smaller:    '~{{pct}}% smaller',
  compress_apply:      'Apply Compression',
  compress_excellent:  'Excellent',
  compress_good:       'Good',
  compress_medium:     'Medium',
  compress_low:        'Low',
  compress_very_low:   'Very Low',

  // ─── Crop Tool ─────────────────────────────────────────────────────────────
  crop_upload_prompt: 'Upload an image to use the crop tool',
  crop_ratio:         'ASPECT RATIO',
  crop_zoom:          'ZOOM',
  crop_free:          'Free',
  crop_reset:         'Reset',
  crop_apply:         'Apply Crop',

  // ─── Format Converter ──────────────────────────────────────────────────────
  format_output:         'OUTPUT FORMAT',
  format_photos:         'Best for photos',
  format_lossless:       'Lossless quality',
  format_modern:         'Modern & efficient',
  format_animated:       'Animated images',
  format_no_alpha:       'No transparency',
  format_alpha:          'Transparency ✓',
  format_limited:        'Limited colors',
  format_warning:        '⚠ Transparency will become white',
  format_apply:          'Convert Format',

  // ─── Before/After Slider ───────────────────────────────────────────────────
  compare_title:         'Before / After Comparison',
  compare_empty:         'Upload an image and apply edits to compare',
  compare_before:        'Before',
  compare_after:         'After',
  compare_hint:          '← Drag to compare →',
  compare_no_edits:      'Apply edits to see comparison',

  // ─── Tool Panel tabs ───────────────────────────────────────────────────────
  tool_compress: 'Compress',
  tool_crop:     'Crop',
  tool_convert:  'Convert',

  // ─── History page ──────────────────────────────────────────────────────────
  history_title:       'Edit History',
  history_subtitle:    'Your last {{count}} edited image · Max 10 saved',
  history_subtitle_pl: 'Your last {{count}} edited images · Max 10 saved',
  history_new_edit:    'New Edit',
  history_loading:     'Loading history…',
  history_empty_title: 'No edits yet',
  history_empty_sub:   'Start editing images and your history will appear here.',
  history_open_editor: 'Open Editor',
  history_cap_note:    'History is capped at 10 entries. Oldest records are automatically removed.',
  history_download:    'Download',
  history_before:      'Before',
  history_after:       'After',

  history_type_compression: 'Compressed',
  history_type_crop:        'Cropped',
  history_type_format:      'Converted',
  history_type_combined:    'Combined',

  // ─── Loading / fallback ────────────────────────────────────────────────────
  loading:           'Loading…',
  signin_to_view:    'Please sign in to view history.',
  signin_arrow:      'Sign in →',
} as const;