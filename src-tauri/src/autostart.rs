use std::env;
use std::fs;
use std::path::PathBuf;

fn get_autostart_path() -> Option<PathBuf> {
    dirs::config_dir().map(|p| p.join("autostart").join("neko-type.desktop"))
}

pub fn set_autostart(enable: bool) -> Result<(), String> {
    // Clean up old legacy autostart file if present
    if let Some(config_dir) = dirs::config_dir() {
        let old_path = config_dir.join("autostart").join("bongo-cat-widget.desktop");
        if old_path.exists() {
            let _ = fs::remove_file(old_path);
        }
    }

    let autostart_path = match get_autostart_path() {
        Some(p) => p,
        None => return Err("Could not determine autostart directory".to_string()),
    };

    if enable {
        if let Some(parent) = autostart_path.parent() {
            let _ = fs::create_dir_all(parent);
        }

        let exe_path = env::current_exe()
            .map_err(|e| format!("Could not get current executable path: {}", e))?;
        let exe_str = exe_path.to_string_lossy();

        let desktop_entry = format!(
            "[Desktop Entry]\n\
            Type=Application\n\
            Name=NekoType Desktop Widget\n\
            Comment=Cute Anime Typing Desktop Companion\n\
            Exec={}\n\
            Hidden=false\n\
            NoDisplay=false\n\
            X-GNOME-Autostart-enabled=true\n\
            StartupNotify=false\n\
            Terminal=false\n",
            exe_str
        );

        fs::write(&autostart_path, desktop_entry)
            .map_err(|e| format!("Failed to write autostart desktop entry: {}", e))?;
    } else {
        if autostart_path.exists() {
            let _ = fs::remove_file(&autostart_path);
        }
    }
    Ok(())
}

#[allow(dead_code)]
pub fn is_autostart_enabled() -> bool {
    get_autostart_path().map(|p| p.exists()).unwrap_or(false)
}
