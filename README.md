# ziwei-master · 紫微斗数全能 CLI

**本命排盘 + 流月/流日/流时/流年推算** — 基于 [iztro](https://github.com/SylarLong/iztro) 开源库的一站式紫微斗数命令行工具。

## 功能

| 命令 | 功能 | 来源 |
|------|------|------|
| `chart` | 本命盘 12 宫星曜、四化、大限 | iztro 排盘引擎 |
| `yearly` | 流年推算（含四化、流耀） | iztro horoscope API |
| `monthly` | 流月推算（含四化、流宫映射） | iztro horoscope API |
| `daily` | 流日推算（含四化、流宫映射） | iztro horoscope API |
| `hourly` | 流时推算 | iztro horoscope API |
| `now` | 当前所有运限（大限+小限+流年+流月+流日+流时） | iztro horoscope API |
| `star` | 14 主星知识查询 | 内置知识库 |
| `palace` | 12 宫位信息查询 | 内置知识库 |
| `shichen` | 时辰对照表 | 内置数据 |

## 快速开始

```bash
# 克隆
git clone https://github.com/<your-username>/ziwei-master.git
cd ziwei-master

# 安装依赖
npm install

# 本命排盘
npx tsx cli/ziwei.ts chart 1995 10 14 18 male

# 流月推算 (2026年7月)
npx tsx cli/ziwei.ts monthly 1995 10 14 18 2026 7

# 流日推算 (2026年7月15日)
npx tsx cli/ziwei.ts daily 1995 10 14 18 2026 7 15

# 当前所有运限
npx tsx cli/ziwei.ts now 1995 10 14 18

# 星曜知识
npx tsx cli/ziwei.ts star 紫微
```

### 通过 Python

```bash
python py/ziwei.py chart 1995 10 14 18 male
python py/ziwei.py monthly 1995 10 14 18 2026 7
```

## 参数说明

### chart 命令
```
chart <年> <月> <日> <时> <male|female>
```
- 时：0-23（24小时制）
- 输出：12宫星曜、亮度（庙旺/平/落陷）、四化、大限

### 流运命令
```
monthly <生年> <月> <日> <时> <目标年> <目标月>
daily   <生年> <月> <日> <时> <目标年> <目标月> <目标日>
yearly  <生年> <月> <日> <时> <目标年>
now     <生年> <月> <日> <时>
```
- 流运输出：四化（禄权科忌）、流限十二宫对照本命、流耀（动态星曜）

## 输出示例

```
════════════════════════════════════════════════════
  紫微斗数命盘
  出生：1995-10-14 酉时  性别：男
  农历：一九九五年闰八月二十
  干支：乙亥 丙戌 戊寅 辛酉  五行局：火六局
  命宫：丑  身宫：未
────────────────────────────────────────────────────
  【十二宫星曜】
  命宫     [丑]
    主星：廉贞、七杀(庙旺)
    辅星：文昌、文曲、蜚廉
    大限：6-15岁
...
════════════════════════════════════════════════════
  流月推运
  本命：1995/10/14 酉时
  流月：2026年7月
────────────────────────────────────────────────────
【流月】田宅宫（甲午）
  四化：禄：廉贞 | 权：破军 | 科：武曲 | 忌：太阳
  流限十二宫对照本命宫位：
    命宫     → 田宅
    兄弟宫    → 官禄
    ...
    田宅宫    → 命宫     ◀ 流限在此
```

## 技术栈

- **TypeScript** — 核心 CLI
- **[iztro](https://github.com/SylarLong/iztro)** v2.5.8 — 紫微斗数排盘 + 流运计算
- **tsx** — TypeScript 直接运行

## 许可

MIT License

## 致谢

- [SylarLong/iztro](https://github.com/SylarLong/iztro) — 提供核心排盘与流运计算引擎
- [Renhuai123/ziwei-doushu](https://github.com/Renhuai123/ziwei-doushu) — 倪海厦体系参考
