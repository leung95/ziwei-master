#!/usr/bin/env python3
"""
ziwei-master — Python 包装器

用法:
  python py/ziwei.py chart 1995 10 14 18 male
  python py/ziwei.py monthly 1995 10 14 18 2026 7
  python py/ziwei.py daily 1995 10 14 18 2026 7 15
  python py/ziwei.py now 1995 10 14 18
  python py/ziwei.py star 紫微
  python py/ziwei.py palace 命宫
"""
import subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NPX = r"C:\Users\steven\AppData\Local\hermes\node\npx.cmd"
CLI = ROOT / "cli" / "ziwei.ts"

def run(args):
    cmd = [NPX, "tsx", str(CLI)] + args
    r = subprocess.run(cmd, cwd=str(ROOT), capture_output=True, text=True, timeout=60)
    if r.returncode:
        raise RuntimeError(r.stderr.strip() or r.stdout.strip())
    return r.stdout

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return
    try:
        print(run(sys.argv[1:]))
    except Exception as e:
        print(f"错误: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
