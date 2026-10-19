# 主页维护指南

## 最简单的修改方法

1. 打开 https://github.com/Songyue-Guo/Songyue-Guo.github.io/edit/main/_data/homepage.json 。
2. 修改文字；新增论文或动态时复制一条现有记录，改好后放在对应数组最前面。
3. 点 **Commit changes**，提交到 **main**，等待 GitHub Pages 自动更新。若未更新，查看仓库 Actions 是否为绿色。

日常只需修改这个文件。保留双引号、括号和逗号；数组最后一条后不加逗号。

## 日常更新

在 GitHub 网页上编辑 `_data/homepage.json` 即可更新个人信息、论文、动态、教育和奖励。提交到 main 后沿用仓库原有的 Jekyll / GitHub Pages 构建。无需 Node、React 或数据库。

- `name` / `chinese_name`：姓名；中文名默认留空，请自行填写。
- `email`：统一联系邮箱，当前为 `sguo349@connect.hkust-gz.edu.cn`；首页按钮及页底邮箱自动同步。
- `portrait`：头像路径；当前沿用旧站图片。
- `bio` / `background` / `headline`：简介、背景、首页研究标语。
- `people_links`：老师姓名与主页地址；简介、背景、教育经历和论文作者中的对应姓名自动变成链接。
- `topics`：研究方向，每项包括 `title` 和 `text`。
- `publications`：按展示顺序排列。新增条目复制现有记录，填写 `short`、`venue`、`topic`、`title`、`authors`、`summary`、`links`。主题筛选自动从 `topic` 生成。没有论文或代码链接就不添加对应链接。
- `news`：新消息放数组开头；日期以字符串形式填写。
- `education` / `awards` / `talks` / `experience`：对应栏目。

JSON 要求双引号；最后一项后面不加逗号。可运行 `python3 -m json.tool _data/homepage.json` 检查格式。

## 设计修改

`assets/css/research.css` 顶部定义浅色与深色配色变量。调整 `--accent` 可改变强调色，调整 `--bg` 可改变背景。

页面结构位于 `_layouts/research.html`。`_pages/about.md` 仍负责 `/` 路由和旧 `/about/`、`/about.html` 跳转。全部正文由 Jekyll 生成静态 HTML，关闭 JavaScript 仍然可读；JavaScript 提供主题切换、论文筛选、一次性滚动进入动画和阅读进度。

旧模板、旧图片和原有 Scholar 爬虫均保留。回滚本次 PR 即可恢复原主页。

## 发布前内容核对

1. 确认邮箱、头像和英文简介。
2. 补充博士入学年月及硕士毕业年月；当前使用不依赖未知日期的描述。
3. 补充近期论文完整题名、作者顺序、公开链接与会议信息。
4. 确认研究经历结束时间；旧站只有起始日期的条目保留起始时间，不声称仍在任职。

FQora 元数据来源：HKUST Research Portal，https://researchportal.hkust.edu.hk/en/publications/fqora-towards-fair-and-quality-based-online-data-marketplace/ 。其他历史记录来自原主页。本次没有加入未公开稿件、匿名审稿链接或未核实的录用条目。

## 本地验证

沿用原项目环境执行 `bundle exec jekyll serve`，访问输出地址。检查桌面与手机宽度、主题按钮和论文筛选。此次修改环境没有安装 Jekyll，完整构建仍需在原环境或 GitHub Pages 上检查。

## 设计来源

参考 Owen Ye 的研究条目层级、Frank Dou 的学术内容组织、Sixiang Chen 的个人介绍与研究分区。页面的布局、配色、装饰图形和实现代码重新设计编写，没有复制其源代码或图片。

## 动画维护（2026-10-19）

- 不需要额外动画库。滚动动画使用 IntersectionObserver 和浏览器原生 Web Animations API。
- 进入动画的时长为 640 ms，位移为 22 px，逐项间隔 65 ms（最多延迟 195 ms），在 `assets/js/research.js` 的 `reveal` 中修改。CSS 的 `.reveal-pending` 位移与之对应。
- 悬停、链接下划线、头像边框及短暂的数据流效果位于 CSS 末尾的 Motion 段。数据流只播放三轮。
- 新增论文、研究方向和动态会自动参加动画，无需逐条设置。
- 系统开启“减少动态效果”时停用动画；无 JavaScript、缺少浏览器动画支持或打印时正文仍可见。键盘焦点会立即显示对应条目。
- 内容仍然由 Jekyll 一次生成完整静态 HTML，动画只是阅读时逐项显现，不额外请求论文数据。
- News 可选填 `url`，自动成为可点击消息。
- `_layouts/research.html` 的 CSS / JS URL 使用版本参数，修改资源后可更新此参数避免旧缓存。

## 论文信息核对（2026-10-19）

FQora 保留已核实的完整题名和作者顺序，论文入口更新为用户提供的 ACM 页面。
MEGA 按用户确认加入 NeurIPS 2026 及官方会议链接，使用简称作为标题。当前环境未能读取官方页面，完整题名、作者顺序与其他链接待核对后填入；`authors` 留空时不显示作者行。简述沿用该研究的医学问答证据选择方向。
