use rdev::{listen, Event, EventType};
use serde::Serialize;
use std::collections::VecDeque;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter};

pub static TYPING_ENABLED: AtomicBool = AtomicBool::new(true);

#[derive(Debug, Clone, Serialize)]
pub struct TypingPayload {
    pub paw: String,
    pub kps: f32,
    pub fast: bool,
}

pub fn start_keyboard_listener(app_handle: AppHandle) {
    thread::spawn(move || {
        let history = Arc::new(Mutex::new(VecDeque::<Instant>::new()));
        let last_press_time = Arc::new(Mutex::new(Instant::now() - Duration::from_secs(10)));
        let last_paw = Arc::new(Mutex::new("right".to_string()));

        let app_clone = app_handle.clone();
        let history_clone = Arc::clone(&history);
        let last_press_clone = Arc::clone(&last_press_time);
        let last_paw_clone = Arc::clone(&last_paw);

        let callback = move |event: Event| {
            if !TYPING_ENABLED.load(Ordering::Relaxed) {
                return;
            }

            if let EventType::KeyPress(_) = event.event_type {
                let now = Instant::now();

                // Throttle key repeat slightly (min 25ms between discrete paw taps)
                {
                    let mut last_press = last_press_clone.lock().unwrap();
                    if now.duration_since(*last_press) < Duration::from_millis(25) {
                        return;
                    }
                    *last_press = now;
                }

                // Alternate left/right paw
                let paw = {
                    let mut paw_guard = last_paw_clone.lock().unwrap();
                    let next_paw = if *paw_guard == "left" {
                        "right".to_string()
                    } else {
                        "left".to_string()
                    };
                    *paw_guard = next_paw.clone();
                    next_paw
                };

                // Calculate keystrokes per second (KPS)
                let (kps, fast) = {
                    let mut hist = history_clone.lock().unwrap();
                    hist.push_back(now);
                    let cutoff = now - Duration::from_secs(1);
                    while let Some(&front) = hist.front() {
                        if front < cutoff {
                            hist.pop_front();
                        } else {
                            break;
                        }
                    }
                    let count = hist.len();
                    let kps_val = count as f32;
                    let is_fast = count >= 6;
                    (kps_val, is_fast)
                };

                let payload = TypingPayload { paw, kps, fast };
                let _ = app_clone.emit("typing-event", payload);
            }
        };

        if let Err(error) = listen(callback) {
            eprintln!("Error listening to global keyboard events: {:?}", error);
        }
    });
}
