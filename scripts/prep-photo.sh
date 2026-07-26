#!/bin/sh
set -eu

# Готовит снимок для витрины: ресайз до 1200 px по длинной стороне и копирайт
# в метаданные. Оригинал не меняется, его держим в originals/ (вне git).
#   ./scripts/prep-photo.sh originals/DSC_0413.jpg roza/05

HOLDER='Рая Драга'
# Уходит в XMP WebStatement каждого снимка, поэтому ссылка нужна долгоживущая:
# адрес витрины сменится вместе с названием и доменом, а этот файл — нет.
SITE='https://github.com/omaul/store/blob/main/LICENSE-CONTENT'

src=${1:-}
name=${2:-}
if [ -z "$src" ] || [ -z "$name" ]; then
  echo "usage: $0 <оригинал> <имя-без-расширения>" >&2
  exit 1
fi
[ -f "$src" ] || { echo "нет файла: $src" >&2; exit 1; }

root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
out="$root/public/assets/items/$name.jpg"
year=$(date +%Y)
notice="© $year $HOLDER. Все права защищены."
terms='Копирование, перепубликация, коммерческое использование и использование для обучения моделей машинного обучения запрещены без письменного разрешения правообладателя.'

sips -s format jpeg -s formatOptions 85 -Z 1200 "$src" --out "$out" >/dev/null

if command -v exiftool >/dev/null 2>&1; then
  # -all= сначала вычищает всё, включая GPS и серийник камеры из оригинала
  exiftool -q -overwrite_original -all= \
    -EXIF:Copyright="$notice" -EXIF:Artist="$HOLDER" \
    -IPTC:CopyrightNotice="$notice" -IPTC:By-line="$HOLDER" \
    -XMP-dc:rights="$notice" -XMP-dc:creator="$HOLDER" \
    -XMP-xmpRights:Marked=True \
    -XMP-xmpRights:UsageTerms="$terms" \
    -XMP-xmpRights:WebStatement="$SITE" \
    "$out"
else
  sips -s copyright "$notice" "$out" >/dev/null
  echo "! exiftool не установлен: записан только EXIF Copyright, а GPS и данные" >&2
  echo "  камеры из оригинала не вычищены. brew install exiftool, потом заново." >&2
fi

sips -g pixelWidth -g pixelHeight -g copyright "$out"
