# 刘松鸣 · 个人主页

> 沈阳理工大学在读学生 · 爱山、爱旅行、爱猫

一个**绿色像素风**的个人主页：纯手写 HTML + CSS + 原生 JavaScript，
没有构建步骤、没有 npm 依赖、没有外部 CDN，克隆下来双击就能打开。

![零依赖](https://img.shields.io/badge/dependencies-0-56b862)
![许可证](https://img.shields.io/badge/license-MIT-17351f)

---

## ✨ 有什么

- 🟩 **像素风设计**：3px 硬描边、硬投影、无圆角，配自托管的像素字体（Press Start 2P）
- 🎨 **深浅双主题**：默认清新绿，可切到「夜森林」，选择记在 localStorage
- 🖼️ **纯代码像素插画**：山、松树、云、太阳和一只小猫，全部由 SVG 矩形生成，可无限缩放不糊
- ⌨️ **打字机标题**：`山脉 / 湖泊 / 旅行 / 猫` 循环
- 🪄 **滚动揭示 + 条纹进度条**：基于 `IntersectionObserver`
- 📱 **响应式**：桌面双栏 → 平板单栏 → 手机抽屉菜单
- ♿ **无障碍**：语义标签、跳转链接、焦点样式、`aria-*`、`prefers-reduced-motion`
- 🐱 **小彩蛋**：点一下首屏插画里的小猫

---

## 📁 目录结构

```
.
├── index.html                    # 页面结构与全部文案（主要改这里）
├── assets/
│   ├── css/style.css             # 样式：配色变量、像素风组件、响应式
│   ├── js/main.js                # 交互：主题、菜单、打字机、滚动动画、复制邮箱
│   ├── img/
│   │   ├── hero-scene.svg        # 首屏像素插画（雪山大猫）
│   │   └── icon-*.svg            # 松树 / 山 / 猫爪 / 树叶 / 太阳 / 地图钉
│   └── fonts/
│       ├── press-start-2p-latin.woff2
│       └── OFL.txt               # 字体授权（SIL Open Font License）
├── guess_number.py               # 之前的猜数字小游戏（保留未动）
├── .nojekyll
├── .github/workflows/deploy.yml  # GitHub Pages 自动部署
├── .gitignore
├── LICENSE
└── README.md
```

---

## ✏️ 改成你自己的

所有文案都在 `index.html`，按 Ctrl+F 搜关键词替换：

| 想改什么 | 搜索 | 说明 |
| --- | --- | --- |
| 名字 | `刘松鸣` / `LIU SONGMING` | 出现在 `<title>`、顶栏、首屏 `<h1>`、页脚、meta |
| 学校 | `沈阳理工大学` | 首屏、关于、角色卡、页脚 |
| 邮箱 | `hello@example.com` | **这是占位邮箱，一定要换成你自己的**，共 4 处（含 `mailto:` 和 `data-copy`） |
| GitHub 链接 | `github.com/liufangdu/1122` | 首屏 chip、联系卡片、`og:url` |
| 打字机词 | `ROLES`（在 `assets/js/main.js`） | 现在是 `['山脉','湖泊','旅行','猫']` |
| 关于我 | `id="about"` | 四段自述 + 签名 |
| 角色卡 | `stat-list` | 学校 / 身份 / 坐标 / 爱好 / 状态 |
| 三个爱好 | `id="hobbies"` | 旅行 / 自然景观 / 撸猫 |
| 旅途清单 | `id="travel"` | **六张卡片目前都是「想去」的示例地点**，请换成你真正去过或想去的地方 |
| 技能条 | `--w: 65%` | 改百分比即可，数值同时改旁边的 `65` |
| 配色 | `:root` 里的 `--leaf` `--bg` `--line` | 改一处全站生效 |

### 换掉首屏那只猫

插画是 `assets/img/hero-scene.svg`，由像素网格生成，每一行是一个 `<rect>`。
如果不想要猫，用编辑器打开删掉描边里的深色矩形即可；想重画也可以用
`.preview/gen_sprites.py` 那套脚本（开发用，未纳入版本库）。

---

## 🚀 本地预览

直接双击 `index.html` 就能看（完全可用）。

更推荐起一个静态服务器，路径行为与线上一致：

```bash
python -m http.server 8080
# 然后打开 http://localhost:8080
```

---

## 🌐 部署到 GitHub Pages

仓库 `liufangdu/1122` 已经内置了自动部署工作流，只需两步：

1. 仓库 → **Settings** → **Pages**
   → **Source** 选 **GitHub Actions**
2. 推送 `main` 分支，等 Actions 里的 `Deploy to GitHub Pages` 跑完

站点地址：**https://liufangdu.github.io/1122/**

> 想用自定义域名：Pages 设置里填域名，并在仓库根目录加一个 `CNAME` 文件，
> 内容写你的域名（不带 `https://`）。
>
> 不想用 Actions：删掉 `.github` 文件夹，Pages 的 Source 改选
> **Deploy from a branch** → `main` / `/ (root)`。

---

## 🎨 换个配色

改 `assets/css/style.css` 顶部：

```css
:root {
  --bg:   #eef8e6;   /* 页面底色（清新草绿） */
  --line: #17351f;   /* 所有描边和投影的颜色 */
  --leaf: #56b862;   /* 主色 */
  --leaf-soft: #b6e7bd;
  --px: 3px;         /* 描边粗细，调大更「像素」 */
}
```

想要默认深色：把 `index.html` 里的 `data-theme="light"` 改成 `"dark"`
（改成 `"auto"` 则跟随访客系统设置）。优先级是
**手动切换（localStorage） > `<html data-theme>` > 系统偏好**。

---

## 📄 许可

代码部分 [MIT](LICENSE)。像素字体为
[SIL Open Font License 1.1](assets/fonts/OFL.txt)，可免费商用。

如果这个页面帮到你，点个 ⭐ 就好。
