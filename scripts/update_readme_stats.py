#!/usr/bin/env python3
"""
Updates README.md with current repository statistics.
Run this script before committing or set up as a GitHub Action.
"""

import os
import re
from pathlib import Path

def count_files(root_dir: Path, pattern: str) -> int:
    """Count files matching a glob pattern."""
    return len(list(root_dir.rglob(pattern)))

def count_lines(root_dir: Path, extensions: list[str]) -> int:
    """Count total lines in files with given extensions."""
    total = 0
    for ext in extensions:
        for file in root_dir.rglob(f"*{ext}"):
            try:
                total += len(file.read_text(encoding="utf-8").splitlines())
            except (UnicodeDecodeError, PermissionError):
                pass
    return total

def count_frontend_skills(root_dir: Path) -> int:
    """Count skills in frontend directory."""
    frontend_path = root_dir / "frontend"
    if not frontend_path.exists():
        return 0
    return len(list(frontend_path.rglob("SKILL.md")))

def count_general_skills(root_dir: Path) -> int:
    """Count skills in general directory."""
    general_path = root_dir / "general"
    if not general_path.exists():
        return 0
    return len(list(general_path.rglob("SKILL.md")))

def format_number(n: int) -> str:
    """Format number with commas and + for large numbers."""
    if n >= 1000:
        return f"{n:,}+"
    return str(n)

def update_readme(root_dir: Path):
    """Update README.md with current stats."""
    readme_path = root_dir / "README.md"

    if not readme_path.exists():
        print("README.md not found!")
        return False

    # Gather stats
    total_skills = count_files(root_dir, "SKILL.md")
    doc_files = count_files(root_dir, "*.md")
    py_scripts = count_files(root_dir, "*.py")
    total_lines = count_lines(root_dir, [".md", ".py"])
    frontend_skills = count_frontend_skills(root_dir)
    general_skills = count_general_skills(root_dir)

    print(f"[STATS] Current Stats:")
    print(f"   Skills: {total_skills}")
    print(f"   Docs: {doc_files}")
    print(f"   Scripts: {py_scripts}")
    print(f"   Lines: {total_lines}")
    print(f"   Frontend: {frontend_skills}, General: {general_skills}")

    # Read README
    content = readme_path.read_text(encoding="utf-8")

    # Update stats table
    # Pattern matches the table rows
    replacements = [
        (r'(\| 🎯 \*\*Total Skills\*\*\s*\|)\s*\d+\s*\|', f'\\1 {total_skills} |'),
        (r'(\| 📄 \*\*Documentation Files\*\*\s*\|)\s*\d+\s*\|', f'\\1 {doc_files} |'),
        (r'(\| 🐍 \*\*Utility Scripts\*\*\s*\|)\s*\d+\s*\|', f'\\1 {py_scripts} |'),
        (r'(\| 📝 \*\*Lines of Content\*\*\s*\|)\s*[\d,]+\+?\s*\|', f'\\1 {format_number(total_lines)} |'),
    ]

    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)

    # Update distribution chart
    frontend_pct = int((frontend_skills / total_skills) * 100) if total_skills > 0 else 0
    general_pct = 100 - frontend_pct

    # Generate bar charts (24 chars max width)
    frontend_bar = "█" * int(24 * frontend_pct / 100)
    general_bar = "█" * int(24 * general_pct / 100)

    # Update the ASCII chart lines
    content = re.sub(
        r'Frontend Skills\s+█+\s+\d+ skills \(\d+%\)',
        f'Frontend Skills     {frontend_bar.ljust(24)}  {frontend_skills} skills ({frontend_pct}%)',
        content
    )
    content = re.sub(
        r'General Skills\s+█+\s+\d+ skills \(\d+%\)',
        f'General Skills      {general_bar.ljust(24)}  {general_skills} skills ({general_pct}%)',
        content
    )

    # Write updated README
    readme_path.write_text(content, encoding="utf-8")
    print("[OK] README.md updated successfully!")
    return True

def main():
    # Fix Windows console encoding
    import sys
    if sys.platform == "win32":
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')

    # Find repository root (where README.md is)
    script_dir = Path(__file__).parent
    root_dir = script_dir.parent

    # Verify we're in the right place
    if not (root_dir / "README.md").exists():
        # Try current working directory
        root_dir = Path.cwd()

    if not (root_dir / "README.md").exists():
        print("[ERROR] Could not find README.md. Run from repository root.")
        return 1

    print(f"[INFO] Repository: {root_dir}")
    update_readme(root_dir)
    return 0

if __name__ == "__main__":
    exit(main())
