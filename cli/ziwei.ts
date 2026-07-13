#!/usr/bin/env npx tsx
/**
 * ziwei-master — 紫微斗数全能 CLI
 *
 * 功能: 本命排盘 + 流月/流日/流时/流年推算
 * 基于 iztro 开源库 (https://github.com/SylarLong/iztro)
 *
 * 用法:
 *   npx tsx cli/ziwei.ts chart 1995 10 14 18 male
 *   npx tsx cli/ziwei.ts monthly 1995 10 14 18 2026 7
 *   npx tsx cli/ziwei.ts daily 1995 10 14 18 2026 7 15
 *   npx tsx cli/ziwei.ts now 1995 10 14 18
 */

import { astro } from 'iztro';

// ── Constants ──
const PNAMES = ['命宫','兄弟宫','夫妻宫','子女宫','财帛宫','疾厄宫','迁移宫','交友宫','官禄宫','田宅宫','福德宫','父母宫'];
const SHORT = ['子时','丑时','寅时','卯时','辰时','巳时','午时','未时','申时','酉时','戌时','亥时'];
const STEMS = '甲乙丙丁戊己庚辛壬癸'.split('');
const BRANCHES = '子丑寅卯辰巳午未申酉戌亥'.split('');

const SD: Record<string, {kw:string,nat:string,el:string}> = {
  '紫微': {kw:'帝王·尊贵·独立', nat:'中性偏吉', el:'土'},
  '天机': {kw:'智慧·机变·谋略', nat:'吉星', el:'木'},
  '太阳': {kw:'阳刚·官贵·慷慨', nat:'吉星', el:'火'},
  '武曲': {kw:'财富·刚毅·果断', nat:'中性', el:'金'},
  '天同': {kw:'温和·享福·随缘', nat:'吉星', el:'水'},
  '廉贞': {kw:'才艺·刑囚·桃花', nat:'凶中带吉', el:'火'},
  '天府': {kw:'财库·稳重·保守', nat:'吉星', el:'土'},
  '太阴': {kw:'柔美·财富·阴柔', nat:'吉星', el:'水'},
  '贪狼': {kw:'欲望·桃花·多才', nat:'中性', el:'木'},
  '巨门': {kw:'口舌·是非·善辩', nat:'凶中带吉', el:'水'},
  '天相': {kw:'辅佐·行政·印绶', nat:'吉星', el:'水'},
  '天梁': {kw:'荫护·医药·长辈', nat:'吉星', el:'土'},
  '七杀': {kw:'将星·果决·孤克', nat:'凶星', el:'金'},
  '破军': {kw:'开创·变动·破坏', nat:'凶星', el:'水'},
};

// ── Helpers ──
function h2s(h: number): number {
  if (h >= 23 || h < 1) return 0;
  if (h < 3) return 1; if (h < 5) return 2; if (h < 7) return 3;
  if (h < 9) return 4; if (h < 11) return 5; if (h < 13) return 6;
  if (h < 15) return 7; if (h < 17) return 8; if (h < 19) return 9;
  if (h < 21) return 10; return 11;
}
function p2(n: number): string { return String(n).padStart(2, '0'); }

// ── Chart formatting ──
function fmtChart(al: any): string[] {
  const L: string[] = [];
  const g = al.gender;
  L.push('═'.repeat(52));
  L.push('  紫微斗数命盘');
  L.push('  出生：' + al.solarDate + ' ' + al.time + '  性别：' + g);
  L.push('  农历：' + al.lunarDate);
  L.push('  干支：' + al.chineseDate + '  五行局：' + al.fiveElementsClass);
  L.push('  命宫：' + al.earthlyBranchOfSoulPalace + '  身宫：' + al.earthlyBranchOfBodyPalace);
  L.push('  生肖：' + al.zodiac + '  星座：' + al.sign);
  L.push('─'.repeat(52));
  L.push('  【十二宫星曜】');

  // Find ming palace index
  const mingP = al.palaces.findIndex((pp: any) => pp.name === '命宮');
  for (let i = 0; i < 12; i++) {
    const p = al.palace(i);
    if (!p) continue;
    const ms = p.majorStars ?? [];
    const os = [...(p.minorStars ?? []), ...(p.adjectiveStars ?? [])].filter(Boolean);

    let hdr = '  ' + (p.name || PNAMES[i]).padEnd(6) + ' [' + p.earthlyBranch + ']';
    if (p.isBodyPalace) hdr += ' 身宫';
    if (i === mingP && !p.isBodyPalace) hdr += ' 命宫';
    L.push(hdr);

    if (ms.length > 0) {
      const si = ms.map((s: any) => {
        let n = s.name;
        if (s.siHua) n += '[' + s.siHua + ']';
        if (s.brightness) n += '(' + (s.brightness === 'bright' ? '庙旺' : s.brightness === 'dim' ? '落陷' : '平') + ')';
        return n;
      });
      L.push('    主星：' + si.join('、'));
    } else {
      L.push('    主星：无');
    }
    if (os.length > 0) L.push('    辅星：' + os.map((s: any) => s.name).join('、'));
    if (p.decadal) L.push('    大限：' + p.decadal.range[0] + '-' + p.decadal.range[1] + '岁');
  }

  // Mark ming palace

  // Four transformations
  L.push('─'.repeat(52));
  L.push('  【四化】');
  const sm: Record<string, string> = {};
  for (let i = 0; i < 12; i++) {
    const p = al.palace(i);
    if (!p) continue;
    for (const s of [...(p.majorStars ?? []), ...(p.minorStars ?? [])]) {
      if (s.siHua) sm[s.name] = s.siHua;
    }
  }
  if (Object.keys(sm).length > 0) {
    L.push('  ' + Object.entries(sm).map(([n, sh]) => n + '化' + sh).join('、'));
  } else {
    L.push('  无四化');
  }
  L.push('═'.repeat(52));
  return L;
}

// ── Horoscope formatting ──
function fmtScope(item: any, label: string): string[] {
  const L: string[] = [];
  const idx = item.index ?? -1;
  const pn = idx >= 0 && idx < 12 ? PNAMES[idx] : '?';
  L.push('【' + label + '】' + pn + '（' + (item.heavenlyStem ?? '') + (item.earthlyBranch ?? '') + '）');
  if (item.mutagen?.length) {
    const m4 = ['禄','权','科','忌'];
    L.push('  四化：' + item.mutagen.map((m: string, i: number) => m4[i] + '：' + m).join(' | '));
  }
  if (item.palaceNames?.length === 12) {
    L.push('  流限十二宫对照本命宫位：');
    for (let i = 0; i < 12; i++) {
      const f = i === idx ? ' ◀ 流限在此' : '';
      L.push('    ' + PNAMES[i].padEnd(6) + ' → ' + (item.palaceNames[i] ?? '').padEnd(6) + f);
    }
  }
  if (item.stars?.length) {
    const flat = item.stars.flat().filter(Boolean).map((s: any) => s.name).filter(Boolean);
    if (flat.length) L.push('  流耀：' + flat.join('、'));
  }
  return L;
}

// ── Help ──
function showHelp(): void {
  console.log([
    '',
    ' ╔══════════════════════════════════════╗',
    ' ║   ziwei-master · 紫微斗数全能 CLI   ║',
    ' ╚══════════════════════════════════════╝',
    '',
    ' 【本命排盘】',
    '   npx tsx cli/ziwei.ts chart <年> <月> <日> <时> <male|female>',
    '   例: npx tsx cli/ziwei.ts chart 1995 10 14 18 male',
    '',
    ' 【流运推算】（基于 iztro horoscope API）',
    '   npx tsx cli/ziwei.ts now     <生年> <月> <日> <时>',
    '   npx tsx cli/ziwei.ts yearly  <生年> <月> <日> <时> <目标年>',
    '   npx tsx cli/ziwei.ts monthly <生年> <月> <日> <时> <目标年> <月>',
    '   npx tsx cli/ziwei.ts daily   <生年> <月> <日> <时> <目标年> <月> <日>',
    '   npx tsx cli/ziwei.ts hourly  <生年> <月> <日> <时> <目标年> <月> <日> <目标时>',
    '   例: npx tsx cli/ziwei.ts monthly 1995 10 14 18 2026 7',
    '',
    ' 【知识查询】',
    '   npx tsx cli/ziwei.ts star    <星名>',
    '   npx tsx cli/ziwei.ts palace  <宫名>',
    '   npx tsx cli/ziwei.ts shichen',
    '',
    ' 【Python 包装】',
    '   python py/ziwei.py <命令> [参数...]',
    '',
  ].join('\n'));
}

// ── Main ──
async function main(): Promise<void> {
  const a = process.argv.slice(2);
  if (!a.length || a[0] === 'help') { showHelp(); return; }
  const cmd = a[0];

  // Star knowledge
  if (cmd === 'star') {
    const n = a[1];
    const d = SD[n];
    if (!d) { console.error('未知星曜。可用：' + Object.keys(SD).join('、')); process.exit(1); }
    console.log(n + '\n特性：' + d.kw + '\n吉凶：' + d.nat + '\n五行：' + d.el);
    return;
  }

  // Palace info
  if (cmd === 'palace') {
    const n = a[1];
    const idx = PNAMES.indexOf(n);
    if (idx < 0) { console.error('未知宫位。可用：' + PNAMES.join('、')); process.exit(1); }
    console.log(n + '（' + BRANCHES[(idx + 2) % 12] + '宫）');
    console.log('对宫：' + PNAMES[(idx + 6) % 12] + '（' + BRANCHES[(idx + 8) % 12] + '宫）');
    return;
  }

  // Shichen table
  if (cmd === 'shichen') {
    console.log('时辰对照表（24小时制 → 时辰索引）：');
    SHORT.forEach((s, i) => console.log('  ' + i + ' ' + s));
    return;
  }

  // Commands requiring birth info
  const by = parseInt(a[1]), bm = parseInt(a[2]), bd = parseInt(a[3]), bh = parseInt(a[4]);
  if (!by || !bm || !bd || isNaN(bh)) {
    console.error('用法：命令 年 月 日 时 [参数...]');
    process.exit(1);
  }
  const sc = h2s(bh);
  const bds = by + '-' + p2(bm) + '-' + p2(bd);

  // Chart
  if (cmd === 'chart') {
    const gender = (a[5] || 'male') === 'male' ? '男' : '女';
    const al = astro.bySolar(bds, sc, gender, true, 'zh-CN');
    console.log(fmtChart(al).join('\n'));

    // Star descriptions in ming palace
    const mingPalace = al.palaces.find((p: any) => p.name === '命宫');
    if (mingPalace && a.includes('--detailed')) {
      console.log('  【命宫主星知识】');
      for (const s of (mingPalace.majorStars ?? [])) {
        const d = SD[s.name];
        if (d) console.log('  ' + s.name + '：' + d.kw + '（' + d.nat + '，五行' + d.el + '）');
      }
      console.log('═'.repeat(52));
    }
    return;
  }

  // Horoscope commands
  const al = astro.bySolar(bds, sc, '男', true, 'zh-CN');

  if (cmd === 'now') {
    const h = al.horoscope();
    const L: string[] = ['═'.repeat(52)];
    L.push('  紫微斗数流运推算');
    L.push('  本命：' + by + '/' + bm + '/' + bd + ' ' + SHORT[sc]);
    L.push('  当前：' + h.solarDate + '（' + h.lunarDate + '）');
    L.push('─'.repeat(52));
    if (h.decadal) L.push(...fmtScope(h.decadal, '大限'));
    if (h.age) L.push(...fmtScope(h.age, '小限(' + (h.age.nominalAge ?? '?') + '岁)'));
    if (h.yearly) L.push(...fmtScope(h.yearly, '流年'));
    if (h.monthly) L.push(...fmtScope(h.monthly, '流月'));
    if (h.daily) L.push(...fmtScope(h.daily, '流日'));
    if (h.hourly) L.push(...fmtScope(h.hourly, '流时'));
    L.push('═'.repeat(52));
    console.log(L.join('\n'));
    return;
  }

  if (cmd === 'yearly') {
    const ty = parseInt(a[5]);
    if (!ty) { console.error('需要目标年'); process.exit(1); }
    const h = al.horoscope(ty + '-01-01');
    const L: string[] = ['═'.repeat(52)];
    L.push('  流年推运');
    L.push('  本命：' + by + '/' + bm + '/' + bd + ' ' + SHORT[sc]);
    L.push('  流年：' + ty + '年');
    L.push('─'.repeat(52));
    L.push(...fmtScope(h.yearly, '流年'));
    L.push('═'.repeat(52));
    console.log(L.join('\n'));
    return;
  }

  if (cmd === 'monthly') {
    const ty = parseInt(a[5]), tm = parseInt(a[6]);
    if (!ty || !tm) { console.error('需要目标年月'); process.exit(1); }
    const h = al.horoscope(ty + '-' + p2(tm) + '-01');
    const L: string[] = ['═'.repeat(52)];
    L.push('  流月推运');
    L.push('  本命：' + by + '/' + bm + '/' + bd + ' ' + SHORT[sc]);
    L.push('  流月：' + ty + '年' + tm + '月');
    L.push('─'.repeat(52));
    L.push(...fmtScope(h.monthly, '流月'));
    L.push('═'.repeat(52));
    console.log(L.join('\n'));
    return;
  }

  if (cmd === 'daily') {
    const ty = parseInt(a[5]), tm = parseInt(a[6]), td = parseInt(a[7]);
    if (!ty || !tm || !td) { console.error('需要目标年月日'); process.exit(1); }
    const ts = ty + '-' + p2(tm) + '-' + p2(td);
    const h = al.horoscope(ts);
    const L: string[] = ['═'.repeat(52)];
    L.push('  流日推运');
    L.push('  本命：' + by + '/' + bm + '/' + bd + ' ' + SHORT[sc]);
    L.push('  流日：' + ts + '（' + h.lunarDate + '）');
    L.push('─'.repeat(52));
    L.push(...fmtScope(h.daily, '流日'));
    L.push('═'.repeat(52));
    console.log(L.join('\n'));
    return;
  }

  if (cmd === 'hourly') {
    const ty = parseInt(a[5]), tm = parseInt(a[6]), td = parseInt(a[7]), th = parseInt(a[8]);
    if (!ty || !tm || !td || isNaN(th)) { console.error('需要目标年月日时'); process.exit(1); }
    const ts = ty + '-' + p2(tm) + '-' + p2(td);
    const tsc = h2s(th);
    const h = al.horoscope(ts, tsc);
    const L: string[] = ['═'.repeat(52)];
    L.push('  流时推运');
    L.push('  本命：' + by + '/' + bm + '/' + bd + ' ' + SHORT[sc]);
    L.push('  流时：' + ts + ' ' + SHORT[tsc]);
    L.push('─'.repeat(52));
    L.push(...fmtScope(h.hourly, '流时'));
    L.push('═'.repeat(52));
    console.log(L.join('\n'));
    return;
  }

  console.error('未知命令：' + cmd + '。可用：chart, now, yearly, monthly, daily, hourly, star, palace, shichen');
  process.exit(1);
}

main().catch(e => { console.error('错误:', e); process.exit(1); });
