#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERSION="1.0.0"
ARCH="amd64"
DEB_DIR="$ROOT/dist-deb/neko-type_${VERSION}_${ARCH}"

rm -rf "$ROOT/dist-deb"
mkdir -p "$DEB_DIR/DEBIAN"
mkdir -p "$DEB_DIR/usr/bin"
mkdir -p "$DEB_DIR/usr/share/applications"
mkdir -p "$DEB_DIR/usr/share/icons/hicolor/512x512/apps"
mkdir -p "$DEB_DIR/usr/share/icons/hicolor/128x128/apps"
mkdir -p "$DEB_DIR/usr/share/icons/hicolor/32x32/apps"

# Copy binary
cp "$ROOT/src-tauri/target/release/neko-type" "$DEB_DIR/usr/bin/neko-type"
chmod 755 "$DEB_DIR/usr/bin/neko-type"

# Copy icons
cp "$ROOT/src-tauri/icons/512x512.png" "$DEB_DIR/usr/share/icons/hicolor/512x512/apps/neko-type.png"
cp "$ROOT/src-tauri/icons/128x128.png" "$DEB_DIR/usr/share/icons/hicolor/128x128/apps/neko-type.png"
cp "$ROOT/src-tauri/icons/32x32.png" "$DEB_DIR/usr/share/icons/hicolor/32x32/apps/neko-type.png"

# Desktop entry - Widget
cat << 'EOF' > "$DEB_DIR/usr/share/applications/neko-type.desktop"
[Desktop Entry]
Type=Application
Name=NekoType Desktop Companion
GenericName=Desktop Typing Pet
Comment=Cute Anime Typing Desktop Companion for Ubuntu GNOME
Exec=neko-type
Icon=neko-type
Terminal=false
Categories=Utility;Amusement;
StartupNotify=false
X-GNOME-Autostart-enabled=false
EOF
chmod 644 "$DEB_DIR/usr/share/applications/neko-type.desktop"

# Desktop entry - Settings
cat << 'EOF' > "$DEB_DIR/usr/share/applications/neko-type-settings.desktop"
[Desktop Entry]
Type=Application
Name=NekoType Settings (Bảng Cài Đặt)
GenericName=Desktop Pet Settings
Comment=Configure NekoType Desktop Pet (Themes, Scale, Position, Autostart)
Exec=neko-type --settings
Icon=neko-type
Terminal=false
Categories=Settings;Utility;
StartupNotify=false
EOF
chmod 644 "$DEB_DIR/usr/share/applications/neko-type-settings.desktop"

# Control file
cat << EOF > "$DEB_DIR/DEBIAN/control"
Package: neko-type
Version: ${VERSION}
Section: utils
Priority: optional
Architecture: ${ARCH}
Depends: libwebkit2gtk-4.1-0 | libwebkit2gtk-4.0-37, libgtk-3-0, libx11-6, libxtst6, libxi6
Maintainer: Ngoctien <ngoctien@local>
Description: Cute Anime Typing Desktop Companion for Ubuntu GNOME
 A lightweight native desktop companion widget inspired by Bongo Cat,
 featuring an original anime chibi cat character, layered SVG animations,
 and global keyboard activity detection.
EOF

dpkg-deb --build --root-owner-group "$DEB_DIR" "$ROOT/neko-type_${VERSION}_${ARCH}.deb"
echo "🎉 Package created: $ROOT/neko-type_${VERSION}_${ARCH}.deb"
