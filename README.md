# Chuan Zhou · Academic Homepage

英文个人学术主页，以 [Minimal Light](https://github.com/yaoyao-liu/minimal-light) 的静态 HTML 版本为基础，重新设计了排版、配色、导航与论文展示。使用你提供的照片，包含英文简介、论文和学术服务。个人链接仅保留 Email 和 Google Scholar。

网站为纯静态 HTML / CSS / JavaScript，可部署到 GitHub Pages。访问网站不依赖 Python、Node、数据库、外部字体或 CDN。Python 用于生成页面；Playwright 仅用于检查页面。

## 本地预览

在此文件夹运行：

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

访问 <http://localhost:4173>。也可以直接打开 `index.html`。

- `index.html`：英文主页，桌面和移动端均适配。
- `artifacts/desktop.png`、`artifacts/mobile.png`：运行检查后生成的页面截图，不发布。

## 发布到 username.github.io

1. 在 GitHub 创建一个公开仓库，名称为 **你的用户名.github.io**。例如，用户名为 `alice`，仓库名应为 `alice.github.io`。
2. 将本项目文件提交到仓库的 `main` 分支。保留 `.github/workflows/pages.yml`；不上传 `node_modules`、`_site`、`artifacts`。
3. 打开仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。
4. 打开 **Actions → Deploy academic homepage**。首次推送已触发构建；如在开启 Pages 前失败，点击 **Run workflow** 重新运行。
5. 成功后访问 `https://你的用户名.github.io/`。后续每次推送到 `main`，网页都会重新生成并发布。

如果使用普通仓库名（如 `homepage`），页面位于 `https://你的用户名.github.io/homepage/`；本项目已使用相对资源路径，支持这种部署方式。

命令行上传示例（将 `YOUR_USERNAME` 替换为实际用户名，先在 GitHub 创建空仓库）：

```bash
git init
git add .
git commit -m "Create academic homepage"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
git push -u origin main
```

线上主页：<https://zhouchuancn.github.io/>。推送到 `main` 后由 GitHub Actions 自动检查和发布。

## 编辑网页文字

日常改文字只需要编辑下面两个文件。在 TRAE 中打开文件，按 **⌘F** 搜索网页上原来的句子，修改文字并保存。HTML 中保留 `<p>`、`<h2>`、`<a>` 等标签及其属性，只修改标签之间的文字。

| 内容 | 修改文件 |
| --- | --- |
| 论文、作者、年份、会议、论文链接、精选标记 | `data/publications.json` |
| 标题、个人信息、英文简介、联系方式和学术服务 | `templates/index.html` |
| 首页配色、字号、布局 | `assets/css/style.css` |
| 照片 | `assets/images/chuan-zhou.jpg` |

例如，想把 “About me” 改成 “Biography”，找到这一行：

```html
<h2 id="about-heading" class="intro-heading">About me</h2>
```

将 `About me` 改为 `Biography`，保留其他部分。修改邮箱时，同时更新 `mailto:` 后面的地址和页面展示的地址。删除栏目时，同时移除桌面导航 `.desktop-nav` 和手机导航 `#mobile-nav` 中的对应链接，并更新相关的页面检查。

论文信息在 `data/publications.json` 中修改：`title` 为题目，`authors` 为作者列表，`year` 为年份，`venue` 为会议，`links` 为原文等链接。保留 JSON 中的英文双引号、逗号和括号。

修改并保存后，在项目目录的终端运行：

```bash
python3 scripts/build.py
```

然后刷新 <http://localhost:4173>。如果预览服务没有运行，先按“本地预览”中的命令启动。修改文字和生成网页仅需 Python 3，无需安装 npm 依赖。

**根目录的 `index.html` 是自动生成的文件，应修改 `templates/index.html`**，否则下次生成时会覆盖改动。模板中的 `__PUBLICATIONS__`、`__PUBLICATION_COUNT__`、`__SELECTED_COUNT__` 由构建程序填充，请保留。

网站上线后，也可以直接在 GitHub 打开上述模板或论文数据文件，点击铅笔图标编辑并提交。GitHub Actions 会自动生成和更新网站。

论文数据中的 `selected: true` 表示列入精选，`topic` 可使用 `causal`、`llm`、`recommendation`，多个主题以空格分隔。论文总数、精选数和“查看全部”的数量文案会自动更新。

## 可选的浏览器检查

```bash
npm ci
npm run browser:install
npm run build
npm run check
```

浏览器安装在项目的 `node_modules/.cache/ms-playwright`，也可复用 macOS 已缓存的独立 Playwright 浏览器。检查使用临时配置。Linux CI 自动通过 `npm run browser:install -- --with-deps` 安装系统依赖。

`npm run build` 与 `python3 scripts/build.py` 等价。构建把页面写到根目录，并将公开文件整理到 `_site/`。`npm run check` 自行启动临时服务，验证实际发布目录，并自动关闭。

## 内容与来源

- 简介、论文、共同一作、Oral 标记以提供的中文简历及后续修改为依据；已按要求移除 Education 区块及其导航入口。
- 邮箱按用户指定更新为 `chuan.zhou@student.unimelb.edu.au`。
- Google Scholar 通过匹配教育经历和论文的公开资料确认。已移除个人 OpenReview、ORCID 链接，以及研究经历部分。
- 已接入有公开出处的论文链接。UMVUE-DR 未添加未经核实的论文下载地址。
- 不提供 CV 页面或下载；原中文简历未随网站发布。
- 核对链接及个别来源差异见 [CONTENT_SOURCES.md](CONTENT_SOURCES.md)。

## 模板致谢

参考并改编自 Yaoyao Liu 的 [Minimal Light](https://github.com/yaoyao-liu/minimal-light)（CC0-1.0）。原始许可证保存在 `LICENSES/minimal-light-CC0-1.0.txt`；页面保留模板致谢。照片与个人内容不自动继承模板许可证。
