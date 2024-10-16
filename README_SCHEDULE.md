# 講演者リストについて

- `_schedule`: ここにデータを置く
- `_includes/schedule.html`: 一覧表HTML
- `_layouts/talk.html`: 個別ページHTML
- `_sass/_layout.scss`: CSS

# マークダウンファイルのフィールド

- `layout: talk [defult]`: `_layouts/talk.html` を使ってページを生成するという意味。特別な理由がない限り変更しないこと。
- `inline: false [default]`: `true` かつ `abstract` にテキストが入っているとき、一覧表の中で概要を表示する。それ以外の場合は個別ベージを生成する。
- `date`: 日時 (JST=`+0900`) (例: `2021-09-08 12:30:00+0900`)
- `date_em`: 日付を強調表示するとき `true`
- `time_em`: 時間を強調表示するとき `true`
- `date_tba`: 日時が未定 (TBA) のとき `true` (`date_tba==true` のとき、時間も非表示になる)
- `time_tba`: 時間が未定 (TBA) のとき `true`
- `time_end`: 終了時間 (通常は使用せず、変則的な講演時間の場合に使用する) (例: `14:30:00+0900`)
- `date_comment`: 日時欄の末尾にコメントを追加したいときに使用 (例: `※予定`)
- `name`: 講演者の名前
- `name_en`: (Optional) 講演者の名前の英語表記。英語名のみの場合は `name` に入力し、こちらは使用しない
- `affiliation`: 所属
- `bio`: スピーカー紹介 (現在非表示)
- `website`: スピーカー名前からリンクするWebサイト
- `topic`: 講演のタイトル
- `abstract`: 講演の概要
- `display`: `true` で表示 / `false` で非表示

## Tips

- 文字列の中に `:` のような表示できない文字がある場合、文字列全体をダブルクオーテーション `"` で囲む。 (例: `_schedule/2021-04-21_akari-asai.md`)

