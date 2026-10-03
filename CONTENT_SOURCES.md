# 内容来源与维护备注

整理日期：2026-09-30。

## 个人资料

主要来源：用户上传的两页中文简历。上传照片已保持原比例压缩成 JPG，去除图像元数据，用于主页头像。

- 邮箱以用户最新指定的 `chuan.zhou@student.unimelb.edu.au` 为准。
- 当前学位、机构和时间采用简历：墨尔本大学统计学博士，2025 年 9 月至今。
- [OpenReview 个人资料](https://openreview.net/profile?id=~Chuan_Zhou5) 中的教育摘要尚为北大硕士，未用于覆盖简历里的最新经历。该资料中的博士导师、北大学习经历和论文列表相互匹配，用于核对学术账号链接。
- [Google Scholar](https://scholar.google.com/citations?user=Ceo75WwAAAAJ&hl=en) 链接来自上述 OpenReview 资料。
- 按用户要求移除个人 OpenReview、ORCID 链接、Research experience 和 Education 区块；不再生成或发布 CV。个人简介以 `templates/index.html` 中的后续人工编辑内容为准。
- 主页的简短研究方向说明是根据简历概括的英文表述，不额外声称实验成果。

## 论文链接

| 论文 | 公开出处 |
| --- | --- |
| LogiConBench | https://openreview.net/forum?id=ULEHJkolxB |
| Open-World LLM Logical Reasoning | https://openreview.net/forum?id=hEcxsQkZpW |
| Towards Robust Travel Time Estimation | https://doi.org/10.1145/3770855.3817802 |
| Uplift Modeling with Delayed Feedback | https://ojs.aaai.org/index.php/AAAI/article/view/38686 |
| A Self-Triggered Agentic Push Recommendation System | https://arxiv.org/pdf/2608.01949；DOI: 10.1145/3773078.3831932 |
| Counterfactual Implicit Feedback Modeling | https://openreview.net/forum?id=PlcH6HJku4 |
| A Two-Stage Pretraining-Finetuning Framework | https://arxiv.org/html/2501.08888v1；DOI: 10.1145/3690624.3709161 |
| Phased Instruction Fine-Tuning | https://aclanthology.org/2024.findings-acl.341/ |
| UMVUE-DR | 使用简历信息；未添加未核实的下载链接 |

Phased IFT 的代码地址 `https://github.com/xubuvd/PhasedSFT` 见该论文的公开 arXiv 版本。

### 待作者核对的一处差异

**LogiConBench 的作者次序：** 用户简历在末尾列出 `Wei Lin, Haoxuan Li, Bo Li, Zhouchen Lin`，OpenReview 个人资料页面列出 `Wei Lin, Bo Li, Haoxuan Li, Zhouchen Lin`。当前网站**按用户简历保留**。直接获取 OpenReview 最终 PDF 的请求返回 403，未据此声称核实了最终出版版顺序。后续可确认最终版后修改 `data/publications.json`，再重新构建主页。

会议、年份、共同一作和 Oral 标记均沿用简历；没有擅自扩充其他检索到但不在简历中的论文。

## 模板

- [Minimal Light](https://github.com/yaoyao-liu/minimal-light)
- [原静态 HTML](https://raw.githubusercontent.com/yaoyao-liu/minimal-light/master/html_source_file/index.html)
- 授权：CC0-1.0。原文保存于 `LICENSES/minimal-light-CC0-1.0.txt`。
- 改动：响应式页面布局、绿色与米白配色、照片处理、导航、静态论文生成、无 JavaScript 回退、GitHub Pages 自动构建与检查。

## 验证范围

自动检查覆盖页面内资源与站内链接、所有论文筛选、320 / 390 / 768 / 1024 / 1440 px 页面宽度、手机菜单及 Escape 关闭、关闭 JavaScript 的全文可读性，以及 GitHub Pages 项目子路径。

外站可能有验证码、访问地区限制或出版商登录要求；添加论文页链接不表示保证每个外站或 PDF 在所有网络环境都可直接下载。GitHub Actions 通过 `.github/workflows/pages.yml` 构建并发布 `_site/`。
