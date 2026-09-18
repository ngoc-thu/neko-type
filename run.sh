#!/usr/bin/env bash
# NekoType Control & Launch Manager
# Supports start, stop, toggle, restart, status, package

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PATH="$HOME/.cargo/bin:$PATH"
export DISPLAY="${DISPLAY:-:1}"

EXE="$SCRIPT_DIR/src-tauri/target/release/neko-type"
ACTION="${1:-start}"

is_running() {
    pgrep -x "neko-type" > /dev/null 2>&1
}

get_pid() {
    pgrep -x "neko-type" 2>/dev/null
}

start_widget() {
    if is_running; then
        echo "🐾 NekoType is already running (PID: $(get_pid))."
        return 0
    fi

    if [ ! -f "$EXE" ]; then
        echo "⚙️ Building release binary..."
        cd "$SCRIPT_DIR"
        pnpm tauri build --no-bundle
    fi

    echo "🚀 Starting NekoType desktop widget..."
    DISPLAY="${DISPLAY:-:1}" setsid "$EXE" </dev/null >/dev/null 2>&1 &
    sleep 0.8

    if is_running; then
        echo "✨ NekoType started successfully (PID: $(get_pid))!"
        echo "👉 Look at the bottom-right corner of your desktop (beside the dock)."
    else
        echo "❌ Failed to start NekoType."
        exit 1
    fi
}

stop_widget() {
    if is_running; then
        PID=$(get_pid)
        echo "🛑 Stopping NekoType (PID: $PID)..."
        kill "$PID" 2>/dev/null || pkill -9 -f "neko-type"
        sleep 0.5
        echo "💤 NekoType stopped."
    else
        echo "💤 NekoType is not currently running."
    fi
}

toggle_widget() {
    if is_running; then
        stop_widget
    else
        start_widget
    fi
}

status_widget() {
    if is_running; then
        echo "🟢 NekoType is RUNNING (PID: $(get_pid))."
    else
        echo "⚪ NekoType is STOPPED."
    fi
}

package_widget() {
    echo "📦 Packaging NekoType into Ubuntu .deb package..."
    cd "$SCRIPT_DIR"
    ./package_deb.sh
}

settings_widget() {
    if is_running; then
        stop_widget
        sleep 0.3
    fi
    echo "⚙️ Launching NekoType with Settings Panel..."
    DISPLAY="${DISPLAY:-:1}" setsid "$EXE" --settings </dev/null >/dev/null 2>&1 &
    sleep 0.8
    echo "✨ NekoType Settings Panel opened!"
}

case "$ACTION" in
    start)
        start_widget
        ;;
    stop)
        stop_widget
        ;;
    toggle)
        toggle_widget
        ;;
    restart)
        stop_widget
        sleep 0.5
        start_widget
        ;;
    status)
        status_widget
        ;;
    settings)
        settings_widget
        ;;
    package)
        package_widget
        ;;
    *)
        echo "Usage: $0 {start|stop|toggle|restart|status|settings|package}"
        exit 1
        ;;
esac
