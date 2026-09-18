use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    pub scale: f32,
    pub position_preset: String,
    pub custom_x: Option<i32>,
    pub custom_y: Option<i32>,
    pub theme: String,
    pub typing_enabled: bool,
    pub always_on_top: bool,
    pub effects_enabled: bool,
    pub autostart: bool,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            scale: 1.0,
            position_preset: "bottom-right".to_string(),
            custom_x: None,
            custom_y: None,
            theme: "sakura".to_string(),
            typing_enabled: true,
            always_on_top: true,
            effects_enabled: true,
            autostart: false,
        }
    }
}

pub fn get_config_path() -> Option<PathBuf> {
    dirs::config_dir().map(|p| p.join("neko-type").join("settings.json"))
}

pub fn load_settings() -> AppSettings {
    // Check neko-type path first
    if let Some(path) = get_config_path() {
        if path.exists() {
            if let Ok(content) = fs::read_to_string(&path) {
                if let Ok(settings) = serde_json::from_str::<AppSettings>(&content) {
                    return settings;
                }
            }
        }
    }
    // Fallback to legacy bongo-cat path
    if let Some(config_dir) = dirs::config_dir() {
        let legacy = config_dir.join("bongo-cat").join("settings.json");
        if legacy.exists() {
            if let Ok(content) = fs::read_to_string(&legacy) {
                if let Ok(settings) = serde_json::from_str::<AppSettings>(&content) {
                    return settings;
                }
            }
        }
    }
    AppSettings::default()
}

pub fn save_settings(settings: &AppSettings) -> Result<(), String> {
    if let Some(path) = get_config_path() {
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
        let json = serde_json::to_string_pretty(settings).map_err(|e| e.to_string())?;
        fs::write(&path, json).map_err(|e| e.to_string())?;
        Ok(())
    } else {
        Err("Failed to resolve config directory".to_string())
    }
}
