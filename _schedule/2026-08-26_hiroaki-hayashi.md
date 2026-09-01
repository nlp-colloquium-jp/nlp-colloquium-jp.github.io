---
layout: talk
date: 2026-08-26 11:00:00+0900
time_end: 12:00:00+0900
time_em: true
inline: false
name: 林佑明
name_en: Hiroaki Hayashi
affiliation: Salesforce Research
bio: カーネギーメロン大学で博士号を取得後、Salesforce AI Research所属。
website: https://hiroakih.me/
topic: LLMs Get Lost In Multi-Turn Conversation
abstract: 大規模言語モデルは広く対話型のアプリケーションとして使われる。そのユーザーの中には要件がはっきりしている場合だけでなく、はじめは不完全な情報の中やり取りしながら意図をはっきりさせる層もいる。一方でこれまでのLLM評価は「1回のやり取りで、条件が全部そろった指示」という前提のもとでされることが大半だった。そこで本研究では、既存の評価データから「意図が複数回のやり取りでそろう指示」を生成し、同じ指示が1回のやり取り（シングルターン）と、複数回のやり取り（マルチターン）でLLMに与えられたときの性能差を調べた。結果、論文発表時点でオープン／クローズド問わずすべてのLLMにおいて、マルチターンだと性能が大きく落ちることを示した。
display: true
---

[[動画]](https://youtu.be/jwgZ6wDbtL0) [[スライド]](https://hiroakih.me/assets/talks/lost-in-conv-jp.pdf) [[論文]](https://arxiv.org/abs/2505.06120) (ICLR 2026 Outstanding Paper)
