"""
1_extract_features.py
=====================
Feature extraction pipeline for Arabic Sign Language (ArSL) YOLO dataset.

For each image in train/valid/test splits:
  1. Reads the corresponding YOLO label file to get the class index.
  2. Crops the image to the bounding box (+ 10 % margin).
  3. Runs MediaPipe Hands on the cropped region.
  4. Normalises 21 hand landmarks and computes 78 features that are
     **identical** to those used in handsign-service.ts.
  5. Appends the feature row (f0..f77, label, split) to a per-split CSV.

Feature vector layout (78 total)
---------------------------------
  f0  .. f62  → normalised XYZ for landmarks 0-20   (21 × 3 = 63 values)
  f63 .. f77  → cosine angles along 5 finger chains   (5 × 3 = 15 values)

Normalization (mirrors handsign-service.ts exactly):
  • Subtract wrist (landmark 0) from every point.
  • Scale by Euclidean distance from origin to point 9 (middle MCP).

Usage
-----
  # Run from AI/modelling/ directory:
  python 1_extract_features.py

  # Custom dataset root:
  python 1_extract_features.py --dataset ../data/Arabic Sign Language ArSL dataset

Output
------
  AI/modelling/data/features_train.csv
  AI/modelling/data/features_valid.csv
  AI/modelling/data/features_test.csv
"""

import argparse
import csv
import math
import os
import sys
from collections import defaultdict
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
from tqdm import tqdm

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

# YOLO class index → web label string
# Mirrors the mapping required by the web application (public/models/label_map.json)
CLASS_INDEX_TO_LABEL: dict[int, str] = {
    0:  "aleff",
    1:  "bb",
    2:  "ta",
    3:  "thaa",
    4:  "jeem",
    5:  "haa",
    6:  "khaa",
    7:  "dal",
    8:  "thal",
    9:  "ra",
    10: "zay",
    11: "seen",
    12: "sheen",
    13: "saad",
    14: "dhad",
    15: "taa",
    16: "dha",
    17: "ain",
    18: "ghain",
    19: "fa",
    20: "gaaf",
    21: "kaaf",
    22: "laam",
    23: "meem",
    24: "nun",
    25: "ha",
    26: "waw",
    27: "ya",
}

# 5 finger chains used for angle computation (identical to handsign-service.ts)
FINGER_CHAINS: list[list[int]] = [
    [0, 1, 2, 3, 4],    # thumb
    [0, 5, 6, 7, 8],    # index
    [0, 9, 10, 11, 12], # middle
    [0, 13, 14, 15, 16],# ring
    [0, 17, 18, 19, 20],# pinky
]

# Bounding-box crop margin (fraction of box dimension added on each side)
CROP_MARGIN: float = 0.10

# CSV column names
FEATURE_COLS: list[str] = [f"f{i}" for i in range(78)]
CSV_COLS: list[str] = FEATURE_COLS + ["label", "split"]

# ---------------------------------------------------------------------------
# Feature extraction (must stay in sync with handsign-service.ts)
# ---------------------------------------------------------------------------

def normalize_landmarks(
    landmarks: list[tuple[float, float, float]]
) -> list[list[float]] | None:
    """
    Normalise 21 hand landmarks exactly as done in handsign-service.ts:
      1. Subtract wrist (landmark 0) from all points.
      2. Divide by the Euclidean distance from origin to point 9.

    Returns None if the scale is degenerate (< 1e-6).
    """
    wx, wy, wz = landmarks[0]
    points = [[x - wx, y - wy, z - wz] for x, y, z in landmarks]
    mx, my, mz = points[9]
    scale = math.sqrt(mx * mx + my * my + mz * mz)
    if scale < 1e-6:
        return None
    return [[x / scale, y / scale, z / scale] for x, y, z in points]


def compute_angles(points: list[list[float]]) -> list[float]:
    """
    Compute 15 cosine angles (3 per finger chain × 5 chains) from normalised
    landmarks. Mirrors the angle computation in handsign-service.ts.

    For each interior joint B in a chain A-B-C:
        angle = dot(A-B, C-B) / (|A-B| × |C-B| + ε)

    Returns a list of 15 floats in [-1, 1].
    """
    angles: list[float] = []
    for chain in FINGER_CHAINS:
        for i in range(1, len(chain) - 1):
            a = np.array(points[chain[i - 1]])
            b = np.array(points[chain[i]])
            c = np.array(points[chain[i + 1]])
            ba = a - b
            bc = c - b
            dot = float(np.dot(ba, bc))
            mag = float(np.linalg.norm(ba) * np.linalg.norm(bc)) + 1e-8
            angles.append(float(np.clip(dot / mag, -1.0, 1.0)))
    return angles  # length 15


def extract_features(
    landmarks: list[tuple[float, float, float]]
) -> list[float] | None:
    """
    Build the 78-dimensional feature vector from raw MediaPipe landmarks.

    Layout:
        f0..f62  → normalised XYZ (21 × 3 = 63)
        f63..f77 → cosine joint angles (5 chains × 3 = 15)

    Returns None if normalisation fails.
    """
    points = normalize_landmarks(landmarks)
    if points is None:
        return None
    flat: list[float] = [v for pt in points for v in pt]  # 63
    angles: list[float] = compute_angles(points)           # 15
    return flat + angles  # 78


# ---------------------------------------------------------------------------
# YOLO label parsing
# ---------------------------------------------------------------------------

def parse_yolo_label(label_path: Path) -> tuple[int, float, float, float, float] | None:
    """
    Read a YOLO label file and return (class_index, cx, cy, w, h) for the
    first (or only) annotation line.

    Returns None if the file is missing or empty.
    """
    if not label_path.exists():
        return None
    with label_path.open() as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            parts = line.split()
            if len(parts) < 5:
                continue
            cls_idx = int(parts[0])
            cx, cy, w, h = float(parts[1]), float(parts[2]), float(parts[3]), float(parts[4])
            return cls_idx, cx, cy, w, h
    return None


# ---------------------------------------------------------------------------
# Image crop helper
# ---------------------------------------------------------------------------

def crop_with_margin(
    image: np.ndarray,
    cx: float,
    cy: float,
    w: float,
    h: float,
    margin: float = CROP_MARGIN,
) -> np.ndarray:
    """
    Crop *image* to the YOLO bounding box expanded by *margin* on each side.
    Clamps coordinates to image boundaries.

    Parameters
    ----------
    image : np.ndarray   BGR image (H × W × 3)
    cx, cy, w, h        YOLO normalised centre + dimensions (0-1 range)
    margin              fractional margin to add on each side

    Returns
    -------
    Cropped BGR image (may be small if the box is at the edge).
    """
    img_h, img_w = image.shape[:2]

    # Convert normalised → pixel, add margin
    x1 = (cx - w / 2 - margin * w) * img_w
    y1 = (cy - h / 2 - margin * h) * img_h
    x2 = (cx + w / 2 + margin * w) * img_w
    y2 = (cy + h / 2 + margin * h) * img_h

    # Clamp to image bounds
    x1 = max(0, int(x1))
    y1 = max(0, int(y1))
    x2 = min(img_w, int(x2))
    y2 = min(img_h, int(y2))

    return image[y1:y2, x1:x2]


# ---------------------------------------------------------------------------
# MediaPipe helper
# ---------------------------------------------------------------------------

def build_mediapipe_hands() -> mp.solutions.hands.Hands:  # type: ignore[attr-defined]
    """
    Create a MediaPipe Hands object configured for single still images.
    """
    return mp.solutions.hands.Hands(  # type: ignore[attr-defined]
        static_image_mode=True,
        max_num_hands=1,
        min_detection_confidence=0.3,
    )


def detect_hand_landmarks(
    hands_detector: mp.solutions.hands.Hands,  # type: ignore[attr-defined]
    bgr_image: np.ndarray,
) -> list[tuple[float, float, float]] | None:
    """
    Run MediaPipe on a BGR image and return a list of 21 (x, y, z) tuples,
    or None if no hand is detected.
    """
    rgb = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2RGB)
    result = hands_detector.process(rgb)
    if not result.multi_hand_landmarks:
        return None
    hand = result.multi_hand_landmarks[0]
    return [(lm.x, lm.y, lm.z) for lm in hand.landmark]


# ---------------------------------------------------------------------------
# Per-split processing
# ---------------------------------------------------------------------------

def process_split(
    split_name: str,
    images_dir: Path,
    labels_dir: Path,
    output_csv: Path,
    hands_detector: mp.solutions.hands.Hands,  # type: ignore[attr-defined]
) -> dict[str, dict[str, int]]:
    """
    Process all images in *images_dir*, extract features, and write rows to
    *output_csv*.

    Returns
    -------
    stats : dict mapping label → {'ok': int, 'fail': int}
    """
    image_files = sorted(
        p for p in images_dir.iterdir()
        if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
    )

    if not image_files:
        print(f"  [WARN] No images found in {images_dir}")
        return {}

    output_csv.parent.mkdir(parents=True, exist_ok=True)

    stats: dict[str, dict[str, int]] = defaultdict(lambda: {"ok": 0, "fail": 0})

    with output_csv.open("w", newline="", encoding="utf-8") as csv_fh:
        writer = csv.writer(csv_fh)
        writer.writerow(CSV_COLS)

        for img_path in tqdm(image_files, desc=f"  {split_name:5s}", unit="img"):
            # --- Resolve YOLO label file ---
            label_path = labels_dir / (img_path.stem + ".txt")
            annotation = parse_yolo_label(label_path)

            if annotation is None:
                # No annotation → skip silently (no class known)
                continue

            cls_idx, cx, cy, w, h = annotation

            # --- Map class index to label string ---
            label = CLASS_INDEX_TO_LABEL.get(cls_idx)
            if label is None:
                tqdm.write(
                    f"  [WARN] Unknown class index {cls_idx} in {label_path.name}, skipping."
                )
                continue

            # --- Load image ---
            image = cv2.imread(str(img_path))
            if image is None:
                tqdm.write(f"  [WARN] Could not read image {img_path.name}, skipping.")
                stats[label]["fail"] += 1
                continue

            # --- Crop to bounding box + margin ---
            cropped = crop_with_margin(image, cx, cy, w, h)
            if cropped.size == 0:
                tqdm.write(f"  [WARN] Empty crop for {img_path.name}, skipping.")
                stats[label]["fail"] += 1
                continue

            # --- MediaPipe hand detection ---
            try:
                landmarks = detect_hand_landmarks(hands_detector, cropped)
            except Exception as exc:  # noqa: BLE001
                tqdm.write(f"  [WARN] MediaPipe error on {img_path.name}: {exc}")
                stats[label]["fail"] += 1
                continue

            if landmarks is None:
                # No hand detected in crop
                stats[label]["fail"] += 1
                continue

            # --- Feature extraction ---
            features = extract_features(landmarks)
            if features is None:
                tqdm.write(
                    f"  [WARN] Feature extraction returned None for {img_path.name}, skipping."
                )
                stats[label]["fail"] += 1
                continue

            # --- Write row ---
            writer.writerow(features + [label, split_name])
            stats[label]["ok"] += 1

    return stats


# ---------------------------------------------------------------------------
# Statistics display
# ---------------------------------------------------------------------------

def print_stats(split_name: str, stats: dict[str, dict[str, int]]) -> None:
    """Pretty-print per-class extraction statistics for one split."""
    if not stats:
        print(f"\n  {split_name}: no data processed.")
        return

    total_ok = sum(v["ok"] for v in stats.values())
    total_fail = sum(v["fail"] for v in stats.values())

    print(f"\n{'='*60}")
    print(f"  Split: {split_name}   OK={total_ok}   FAIL={total_fail}")
    print(f"{'='*60}")
    print(f"  {'Label':<12}  {'OK':>6}  {'FAIL':>6}  {'Success%':>9}")
    print(f"  {'-'*42}")

    for label in sorted(stats.keys()):
        ok = stats[label]["ok"]
        fail = stats[label]["fail"]
        total = ok + fail
        pct = 100.0 * ok / total if total > 0 else 0.0
        print(f"  {label:<12}  {ok:>6}  {fail:>6}  {pct:>8.1f}%")

    print(f"{'='*60}\n")


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def main() -> None:
    """
    Parse arguments, set up paths, and run the full feature extraction pipeline
    for all three dataset splits (train, valid, test).
    """
    parser = argparse.ArgumentParser(
        description="Extract 78-dim hand features from the ArSL YOLO dataset."
    )
    parser.add_argument(
        "--dataset",
        type=str,
        default=str(
            Path(__file__).resolve().parent.parent
            / "data"
            / "Arabic Sign Language ArSL dataset"
        ),
        help="Root directory of the YOLO dataset (contains train/, valid/, test/).",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=str(Path(__file__).resolve().parent / "data"),
        help="Output directory for CSV feature files.",
    )
    args = parser.parse_args()

    dataset_root = Path(args.dataset)
    output_dir = Path(args.output)

    print(f"\nDataset root : {dataset_root}")
    print(f"Output dir   : {output_dir}\n")

    if not dataset_root.exists():
        print(f"[ERROR] Dataset directory not found: {dataset_root}")
        sys.exit(1)

    splits = [
        ("train", dataset_root / "train" / "images", dataset_root / "train" / "labels"),
        ("valid", dataset_root / "valid" / "images", dataset_root / "valid" / "labels"),
        ("test",  dataset_root / "test"  / "images", dataset_root / "test"  / "labels"),
    ]

    # Initialise MediaPipe once and reuse across all splits
    print("Initialising MediaPipe Hands …\n")
    with build_mediapipe_hands() as hands_detector:
        for split_name, images_dir, labels_dir in splits:
            if not images_dir.exists():
                print(f"[SKIP] Split '{split_name}' not found at {images_dir}")
                continue

            output_csv = output_dir / f"features_{split_name}.csv"
            print(f"Processing split '{split_name}' …")
            print(f"  Images : {images_dir}")
            print(f"  Labels : {labels_dir}")
            print(f"  Output : {output_csv}")

            stats = process_split(
                split_name=split_name,
                images_dir=images_dir,
                labels_dir=labels_dir,
                output_csv=output_csv,
                hands_detector=hands_detector,
            )
            print_stats(split_name, stats)

    print("Feature extraction complete.")


if __name__ == "__main__":
    main()
