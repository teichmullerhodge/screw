#!/usr/bin/env bash
set -e

OUT=build/main
OBJ_DIR=build/obj

mkdir -p "$OBJ_DIR"

echo "[+] Compiling ASM."

OBJS=()

while IFS= read -r asm; do
    obj="$OBJ_DIR/$(echo "$asm" | sed 's|/|_|g' | sed 's|.asm$|.o|')"
    echo "    nasm $asm -> $obj"
    nasm -f elf64 "$asm" -o "$obj"
    OBJS+=("$obj")
done < <(find . -name "*.asm")

echo "[+] Linking."
ld "${OBJS[@]}" -o "$OUT"

echo "[✓] Build done: $OUT"

