#!/usr/bin/env python3
"""
Updates README.md with current repository statistics.
Run this script before committing or set up as a GitHub Action.
"""

import os
import re
from pathlib import Path

# Directories to exclude from stats
EXCLUDE_DIRS = {'node_modules', '.git', '.claude', '__pycache__', 'cli'}

def should_exclude(path: Path) -> bool:
    """Check if path should be excluded."""
    parts = path.parts
    return any(excluded in parts for excluded in EXCLUDE_DIRS)

def count_files(root_dir: Path, pattern: str) -> int:
    """Count files matching a glob pattern, excluding certain directories."""
    count = 0
    for file in root_dir.rglob(pattern):
        if not should_exclude(file):
            count += 1
    return count

def count_lines(root_dir: Path, extensions: list[str]) -> int:
    """Count total lines in files with given extensions."""
    total = 0
    for ext in extensions:
        for file in root_dir.rglob(f"*{ext}"):
            if should_exclude(file):
                continue
            try:
                total += len(file.read_text(encoding="utf-8").splitlines())
            except (UnicodeDecodeError, PermissionError):
                pass
    return total

def count_skills_in_dir(root_dir: Path, subdir: str) -> int:
    """Count skills in a specific directory."""
    dir_path = root_dir / subdir
    if not dir_path.exists():
        return 0
    count = 0
    for file in dir_path.rglob("SKILL.md"):
        if not should_exclude(file):
            count += 1
    return count

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
    js_scripts = count_files(root_dir, "*.js")
    total_lines = count_lines(root_dir, [".md", ".py", ".js"])

    # Count skills by category
    frontend_skills = count_skills_in_dir(root_dir, "frontend")
    general_skills = count_skills_in_dir(root_dir, "general")
    auth_skills = count_skills_in_dir(root_dir, "auth")

    # Determine categories
    categories = []
    if frontend_skills > 0:
        categories.append("Frontend")
    if general_skills > 0:
        categories.append("General")
    if auth_skills > 0:
        categories.append("Auth")

    category_str = f"{len(categories)} ({', '.join(categories)})"

    print(f"[STATS] Current Stats:")
    print(f"   Skills: {total_skills}")
    print(f"   Docs: {doc_files}")
    print(f"   Python Scripts: {py_scripts}")
    print(f"   JS Scripts: {js_scripts}")
    print(f"   Lines: {total_lines}")
    print(f"   Frontend: {frontend_skills}, General: {general_skills}, Auth: {auth_skills}")

    # Read README
    content = readme_path.read_text(encoding="utf-8")

    # Update stats table
    replacements = [
        (r'(\| 🎯 \*\*Total Skills\*\*\s*\|)\s*\d+\s*\|', f'\\1 {total_skills} |'),
        (r'(\| 📄 \*\*Documentation Files\*\*\s*\|)\s*\d+\s*\|', f'\\1 {doc_files} |'),
        (r'(\| 🐍 \*\*Utility Scripts\*\*\s*\|)\s*\d+\s*\|', f'\\1 {py_scripts + js_scripts} |'),
        (r'(\| 📝 \*\*Lines of Content\*\*\s*\|)\s*[\d,]+\+?\s*\|', f'\\1 {format_number(total_lines)} |'),
        (r'(\| 📂 \*\*Categories\*\*\s*\|)\s*[^\|]+\|', f'\\1 {category_str} |'),
    ]

    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)

    # Update distribution chart
    if total_skills > 0:
        frontend_pct = int((frontend_skills / total_skills) * 100)
        general_pct = int((general_skills / total_skills) * 100)
        auth_pct = int((auth_skills / total_skills) * 100)

        # Generate bar charts (24 chars max width)
        frontend_bar = "█" * max(1, int(24 * frontend_pct / 100)) if frontend_skills > 0 else ""
        general_bar = "█" * max(1, int(24 * general_pct / 100)) if general_skills > 0 else ""
        auth_bar = "█" * max(1, int(24 * auth_pct / 100)) if auth_skills > 0 else ""

        # Update the ASCII chart lines
        content = re.sub(
            r'Frontend Skills\s+█*\s+\d+ skills? \(\d+%\)',
            f'Frontend Skills     {frontend_bar.ljust(18)}  {frontend_skills} skill{"s" if frontend_skills != 1 else ""} ({frontend_pct}%)',
            content
        )
        content = re.sub(
            r'General Skills\s+█*\s+\d+ skills? \(\d+%\)',
            f'General Skills      {general_bar.ljust(18)}  {general_skills} skill{"s" if general_skills != 1 else ""} ({general_pct}%)',
            content
        )

        # Add or update Auth line if it exists
        if auth_skills > 0:
            if 'Auth Skills' not in content:
                # Add auth line after General Skills line
                content = re.sub(
                    r'(General Skills\s+█+\s+\d+ skills? \(\d+%\))',
                    f'\\1\n\nAuth Skills         {auth_bar.ljust(18)}  {auth_skills} skill{"s" if auth_skills != 1 else ""} ({auth_pct}%)',
                    content
                )
            else:
                content = re.sub(
                    r'Auth Skills\s+█*\s+\d+ skills? \(\d+%\)',
                    f'Auth Skills         {auth_bar.ljust(18)}  {auth_skills} skill{"s" if auth_skills != 1 else ""} ({auth_pct}%)',
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
