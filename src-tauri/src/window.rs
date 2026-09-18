use crate::config::AppSettings;
use crate::dock_detector::calculate_widget_position;
use tauri::{AppHandle, Manager, PhysicalPosition, PhysicalSize, Position, Size};

pub const BASE_WIDTH: u32 = 260;
pub const BASE_HEIGHT: u32 = 200;

pub fn apply_window_settings(app: &AppHandle, settings: &AppSettings) {
    if let Some(window) = app.get_webview_window("main") {
        let width = (BASE_WIDTH as f32 * settings.scale).round() as u32;
        let height = (BASE_HEIGHT as f32 * settings.scale).round() as u32;

        let _ = window.set_size(Size::Physical(PhysicalSize { width, height }));

        let (x, y) = calculate_widget_position(
            &settings.position_preset,
            width as i32,
            height as i32,
            settings.custom_x,
            settings.custom_y,
        );

        let _ = window.set_position(Position::Physical(PhysicalPosition { x, y }));
        let _ = window.set_always_on_top(settings.always_on_top);
        let _ = window.set_skip_taskbar(true);
    }
}
