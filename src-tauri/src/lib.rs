mod autostart;
mod config;
mod dock_detector;
mod keyboard;
mod window;

use config::{load_settings, save_settings as save_config, AppSettings};
use keyboard::{start_keyboard_listener, TYPING_ENABLED};
use std::env;
use std::sync::atomic::Ordering;
use std::sync::Mutex;
use tauri::{command, AppHandle, Emitter, Manager, State};
use window::apply_window_settings;

pub struct AppState {
    pub settings: Mutex<AppSettings>,
}

#[command]
fn get_settings(state: State<AppState>) -> AppSettings {
    state.settings.lock().unwrap().clone()
}

#[command]
fn save_settings(
    app: AppHandle,
    state: State<AppState>,
    new_settings: AppSettings,
) -> Result<(), String> {
    {
        let mut current = state.settings.lock().unwrap();
        *current = new_settings.clone();
    }
    save_config(&new_settings)?;
    TYPING_ENABLED.store(new_settings.typing_enabled, Ordering::Relaxed);
    let _ = autostart::set_autostart(new_settings.autostart);
    apply_window_settings(&app, &new_settings);
    let _ = app.emit("settings-updated", new_settings);
    Ok(())
}

#[command]
fn open_settings_window(app: AppHandle) {
    if let Some(window) = app.get_webview_window("settings") {
        let _ = window.center();
        let _ = window.show();
        let _ = window.set_focus();
    }
}

#[command]
fn hide_settings_window(app: AppHandle) {
    if let Some(window) = app.get_webview_window("settings") {
        let _ = window.hide();
    }
}

#[command]
fn toggle_widget_visible(app: AppHandle) -> bool {
    if let Some(window) = app.get_webview_window("main") {
        if let Ok(visible) = window.is_visible() {
            if visible {
                let _ = window.hide();
                return false;
            } else {
                let _ = window.show();
                return true;
            }
        }
    }
    true
}

#[command]
fn hide_window(app: AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.hide();
    }
}

#[command]
fn show_window(app: AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
    }
}

#[command]
fn exit_app(app: AppHandle) {
    app.exit(0);
}

pub fn run() {
    let initial_settings = load_settings();
    TYPING_ENABLED.store(initial_settings.typing_enabled, Ordering::Relaxed);

    let show_settings_on_start = env::args().any(|arg| arg == "--settings" || arg == "-s");

    tauri::Builder::default()
        .manage(AppState {
            settings: Mutex::new(initial_settings.clone()),
        })
        .invoke_handler(tauri::generate_handler![
            get_settings,
            save_settings,
            open_settings_window,
            hide_settings_window,
            toggle_widget_visible,
            hide_window,
            show_window,
            exit_app,
        ])
        .setup(move |app| {
            let handle = app.handle().clone();
            apply_window_settings(&handle, &initial_settings);
            start_keyboard_listener(handle.clone());

            if let Some(settings_win) = handle.get_webview_window("settings") {
                let win_clone = settings_win.clone();
                settings_win.on_window_event(move |event| {
                    if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                        api.prevent_close();
                        let _ = win_clone.hide();
                    }
                });

                if show_settings_on_start {
                    let _ = settings_win.center();
                    let _ = settings_win.show();
                    let _ = settings_win.set_focus();
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running bongo-cat application");
}
