# 主页维护指南

## 日常更新

在 GitHub 网页上编辑 `_data/homepage.json` 即可更新个人信息、论文、动态、教育和奖励。提交到 main 后沿用仓库原有的 Jekyll / GitHub Pages 构建。无需 Node、React 或数据库。

- `name` / `chinese_name`：姓名；中文名默认留空，请自行填写。
- `email`：当前沿用旧站公开邮箱，请确认是否更换为 HKUST 邮箱。
- `portrait`：头像路径；当前沿用旧站图片。
- `bio` / `background` / `headline`：简介、背景、首页研究标语。
- `topics`：研究方向，每项包括 `title` 和 `text`。
- `publications`：按展示顺序排列。新增条目复制现有记录，填写 `short`、`venue`、`topic`、`title`、`authors`、`summary`、`links`。主题筛选自动从 `topic` 生成。没有论文或代码链接就不添加对应链接。
- `news`：新消息放数组开头；日期以字符串形式填写。
- `education` / `awards` / `talks` / `experience`：对应栏目。

JSON 要求双引号；最后一项后面不加逗号。可运行 `python3 -m json.tool _data/homepage.json` 检查格式。

## 设计修改

`assets/css/research.css` 顶部定义浅色与深色配色变量。调整 `--accent` 可改变强调色，调整 `--bg` 可改变背景。

页面结构位于 `_layouts/research.html`。`_pages/about.md` 仍负责 `/` 路由和旧 `/about/`、`/about.html` 跳转。全部正文由 Jekyll 生成静态 HTML，关闭 JavaScript 仍然可读；JavaScript 仅提供主题切换和筛选功能。

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
