use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Workarea {
    pub x: i32,
    pub y: i32,
    pub width: i32,
    pub height: i32,
}

impl Default for Workarea {
    fn default() -> Self {
        Self {
            x: 0,
            y: 31,
            width: 1920,
            height: 1007,
        }
    }
}

pub fn get_workarea() -> Workarea {
    // Try querying _NET_WORKAREA via xprop
    if let Ok(output) = Command::new("xprop").args(["-root", "_NET_WORKAREA"]).output() {
        if output.status.success() {
            let text = String::from_utf8_lossy(&output.stdout);
            // Format: _NET_WORKAREA(CARDINAL) = x, y, width, height, ...
            if let Some(eq_pos) = text.find('=') {
                let parts: Vec<i32> = text[eq_pos + 1..]
                    .split(',')
                    .filter_map(|s| s.trim().parse::<i32>().ok())
                    .collect();
                if parts.len() >= 4 {
                    return Workarea {
                        x: parts[0],
                        y: parts[1],
                        width: parts[2],
                        height: parts[3],
                    };
                }
            }
        }
    }

    Workarea::default()
}

pub fn calculate_widget_position(
    preset: &str,
    widget_width: i32,
    widget_height: i32,
    custom_x: Option<i32>,
    custom_y: Option<i32>,
) -> (i32, i32) {
    let workarea = get_workarea();
    let margin = 20;

    match preset {
        "bottom-left" => {
            let x = workarea.x + margin;
            let y = workarea.y + workarea.height - widget_height;
            (x, y)
        }
        "bottom-center" => {
            let x = workarea.x + (workarea.width - widget_width) / 2;
            let y = workarea.y + workarea.height - widget_height;
            (x, y)
        }
        "custom" => {
            let x = custom_x.unwrap_or(workarea.x + workarea.width - widget_width - margin);
            let y = custom_y.unwrap_or(workarea.y + workarea.height - widget_height);
            (x, y)
        }
        _ => {
            // "bottom-right" is default
            let x = workarea.x + workarea.width - widget_width - margin;
            let y = workarea.y + workarea.height - widget_height;
            (x, y)
        }
    }
}
