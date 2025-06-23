---
layout: talk
date: 2025-05-07 12:00:00+0900
time_em: false
inline: false
name: 前川政司
name_en: Seiji Maekawa
affiliation: Megagon Labs
bio: 2019年大阪大学大学院博士前期課程修了、同年NTTドコモ入社。2020年に退社し、大阪大学大学院博士後期課程に進学。2023年にMegagon Labs, Inc.入社し、現在Research Scientistとして勤務。主に大規模言語モデルの包括的な文脈理解や長文理解の能力の検証やretrieval augmentationを用いた改善に取り組んでいる。
website: https://seijimaekawa.github.io/
topic: "Holistic Reasoning with Long-Context LMs: A Benchmark for Database Operations on Massive Textual Data"
abstract: テキスト情報の急増により、効率的な整理・理解手法の必要性が高まっている。RAG（Retrieval-Augmented Generation）モデルは情報検索には優れるが、複数文書にまたがる全体的推論（holistic reasoning）には弱く、LCLM（Long-Context Language Models）もその能力はまだ十分に明らかになっていない。本研究では、LCLMの全体的推論能力を評価する新たなフレームワーク「HoloBench」を提案する。文脈の長さ、情報量、情報の分布、クエリの複雑さなどの要素を調整し、モデル性能を体系的に分析する。実験の結果、情報量が文脈の長さ以上に性能へ影響を与えることが明らかとなった。また、クエリの複雑さも重要な要因であり、特にクエリの種類によって影響の大きさが異なる。最大値・最小値を求めるようなクエリはLCLMにとって比較的容易であり、RAGが苦手とするタスクにも強い傾向を示した。一方で、複数の情報断片を統合する必要のあるタスクでは、文脈が長くなるほど精度が低下する傾向が見られた。さらに、関連情報のグルーピングは一般的に性能を向上させるが、その最適な配置はモデルごとに異なる。本研究は、LCLMによる長文理解における進展と、依然として残る課題を示している。
display: true
---
[[動画]](https://www.youtube.com/watch?v=UAAcrgIADSQ) [[スライド]](https://github.com/seijimaekawa/seijimaekawa.github.io/blob/test/files/HoloBenchColloquiumJPN.pdf) [[論文]](https://arxiv.org/abs/2410.11996) (ICLR 2025)
