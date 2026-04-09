#!/usr/bin/env python3
"""
Migrate media files from Google Drive → Google Cloud Storage
Usage: python3 scripts/migrate-to-gcs.py --bucket YOUR_BUCKET_NAME
"""

import os
import re
import sys
import argparse
import requests
import subprocess
from pathlib import Path

# ─── CONFIG ──────────────────────────────────────────────────────────────────

DRIVE_FILES = [
    # (drive_id, filename, category)
    ("1EvGNzQ5tmhG6sf0-WCY6aI3VH7ElYJih", "english-class-outdoor.jpg",       "english-class"),
    ("19QqwZGUpQgAvUwl_ZdiX6VZ3WAlRosFX", "english-class.jpg",               "english-class"),
    ("1wigY74letDLUD-uUSeBtmMxY4Lgq_AnN", "onboarding-gift.jpg",             "company-overview"),
    ("110ZpnhR08VEg0yGXEpK3TFLkU0DJcWd9", "software-quality-speaker.jpg",    "company-overview"),
    ("1d61zh7zySVYgT3IVv2feCuzX38dkMOVN", "tech-talk-mgm.jpg",               "company-overview"),
    ("1xE8O5NKYhkUWVVdLy58JcoJy4I8q9MYU", "mgm-office-danang.jpg",           "company-overview"),
    ("1dKCMJjTeqgcVdIjsmRv6hGBMJ9dpj68Q", "mgm-office-workspace.jpg",        "company-overview"),
    ("14vhCNIqbuOTZl-ljJuIoypIDf_1mjhpa", "mgm-office-team-area.jpg",        "company-overview"),
    ("13HcKoP-xkU6zLAkVG93vzUCtdg-WT9Xk", "instant-noodles.jpg",             "general"),
    ("1ZEsaj7zr0UHGTyOHBv9vKMfSWXIWJ0mi", "piano-at-office.jpg",             "general"),
    ("1PzieFriIyLxMr8Q3lxmnoOlW7hy02C80", "mgm-office-rooftop.jpg",          "company-overview"),
    ("1xE8O5NKYhkUWVVdLy58JcoJy4I8q9MYU", "mgm-office-danang-2.jpg",         "company-overview"),
]

# Add video files here (Drive ID, filename, category)
# Example: ("VIDEO_DRIVE_ID", "office-tour.mp4", "company-overview"),
VIDEO_FILES = [
    # ("84d5a768-b2c5-4876-97a2-edd4e8411263", "office-video.mp4", "company-overview"),  # UUID - get from DB
    # ("00e77590-dfd8-4cb0-b90f-83a4caebfbcb", "outdoor-trip.mp4", "happy-friday"),       # UUID - get from DB
    # ("2c025fe8-db38-40b4-9d25-c4c377bbd8d4", "archery.mp4",      "happy-friday"),       # UUID - get from DB
]

# ─── HELPERS ─────────────────────────────────────────────────────────────────

def download_drive_image(drive_id: str, dest_path: Path):
    """Download image from Google Drive via lh3 (high quality)."""
    url = f"https://lh3.googleusercontent.com/d/{drive_id}=w2000"
    print(f"  ↓ Downloading {drive_id}...")
    r = requests.get(url, timeout=30)
    r.raise_for_status()
    dest_path.write_bytes(r.content)
    print(f"  ✓ Saved {dest_path} ({len(r.content)//1024}KB)")

def download_drive_file(drive_id: str, dest_path: Path):
    """Download file from Google Drive (handles large files with confirmation)."""
    session = requests.Session()
    url = f"https://drive.google.com/uc?export=download&id={drive_id}"
    r = session.get(url, stream=True, timeout=60)

    # Handle virus scan warning for large files
    token = None
    for key, value in r.cookies.items():
        if key.startswith("download_warning"):
            token = value
            break

    if token:
        url = f"https://drive.google.com/uc?export=download&id={drive_id}&confirm={token}"
        r = session.get(url, stream=True, timeout=60)

    print(f"  ↓ Downloading {drive_id}...")
    with open(dest_path, "wb") as f:
        for chunk in r.iter_content(chunk_size=32768):
            if chunk:
                f.write(chunk)
    print(f"  ✓ Saved {dest_path} ({dest_path.stat().st_size//1024}KB)")

def upload_to_gcs(local_path: Path, bucket: str, gcs_path: str) -> str:
    """Upload file to GCS and return public URL."""
    gcs_uri = f"gs://{bucket}/{gcs_path}"
    print(f"  ↑ Uploading to {gcs_uri}...")
    result = subprocess.run(
        ["gsutil", "-h", "Cache-Control:public,max-age=31536000", "cp", str(local_path), gcs_uri],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"  ✗ Error: {result.stderr}")
        return ""
    public_url = f"https://storage.googleapis.com/{bucket}/{gcs_path}"
    print(f"  ✓ {public_url}")
    return public_url

# ─── MAIN ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--bucket", required=True, help="GCS bucket name")
    parser.add_argument("--tmp",    default="/tmp/mgm-media", help="Temp download dir")
    parser.add_argument("--dry-run", action="store_true", help="Show URLs without uploading")
    args = parser.parse_args()

    tmp_dir = Path(args.tmp)
    tmp_dir.mkdir(parents=True, exist_ok=True)

    url_map = {}  # drive_id → gcs_url

    print("\n=== Migrating IMAGES ===")
    for drive_id, filename, category in DRIVE_FILES:
        local_path = tmp_dir / filename
        gcs_path = f"mgm-life/{category}/{filename}"

        if not args.dry_run:
            try:
                download_drive_image(drive_id, local_path)
                url = upload_to_gcs(local_path, args.bucket, gcs_path)
                url_map[drive_id] = url
            except Exception as e:
                print(f"  ✗ Failed {drive_id}: {e}")
                url_map[drive_id] = f"FAILED: {e}"
        else:
            url_map[drive_id] = f"https://storage.googleapis.com/{args.bucket}/{gcs_path}"

    print("\n=== Migrating VIDEOS ===")
    for drive_id, filename, category in VIDEO_FILES:
        local_path = tmp_dir / filename
        gcs_path = f"mgm-life/{category}/{filename}"

        if not args.dry_run:
            try:
                download_drive_file(drive_id, local_path)
                url = upload_to_gcs(local_path, args.bucket, gcs_path)
                url_map[drive_id] = url
            except Exception as e:
                print(f"  ✗ Failed {drive_id}: {e}")
        else:
            url_map[drive_id] = f"https://storage.googleapis.com/{args.bucket}/{gcs_path}"

    print("\n=== URL Mapping (update DB with these) ===")
    print(f"{'Drive ID':<45} {'GCS URL'}")
    print("-" * 120)
    for drive_id, gcs_url in url_map.items():
        print(f"{drive_id:<45} {gcs_url}")

    # Generate SQL update statements
    print("\n=== SQL to update DB mediaUrl ===")
    for drive_id, gcs_url in url_map.items():
        if gcs_url and not gcs_url.startswith("FAILED"):
            print(f"UPDATE mgm_life_items SET media_url = '{gcs_url}' WHERE media_url LIKE '%{drive_id}%';")

if __name__ == "__main__":
    main()
