# Atlas 导入说明

这套目录用于把外部植物数据整理成可以进入 Plant World Map 的稳定内容。

## 目录结构

- `data/atlas/inbox/`
  放待导入的 JSON 批次文件。
- `data/atlas/external/`
  放外部来源的原始或半结构化 JSON。
- `data/atlas/generated/`
  脚本生成的标准化 JSON 和导入报告。
- `supabase/atlas-import.generated.sql`
  可直接放进 Supabase SQL Editor 执行的植物导入 SQL。
- `supabase/atlas-catalog.generated.sql`
  可直接写入 `atlas_entries` 图谱表的 catalog SQL。
- `supabase/atlas-catalog.sql`
  长期维护用的图谱表结构。
- `supabase/atlas-sync.sql`
  把已审核图谱同步到前台 `plants` 展示池的数据库函数。

## 推荐工作流

1. 从外部来源拉取候选植物数据
   - GBIF：分布、学名、地区
   - Wikimedia Commons：稳定图片
   - iNaturalist：观察图与许可信息

2. 先做人工清洗
   - 保留中文名、英文名、学名
   - 选择 1 张最合适的本地图片
   - 明确季节、地区、标签、花语

3. 如果是 Commons 这类原始 JSON，先运行：

```bash
npm run atlas:commons
```

4. 把清洗后的 JSON 放到 `data/atlas/inbox/`

5. 运行：

```bash
npm run atlas:import
```

6. 查看输出：
   - `data/atlas/generated/atlas-import-report.json`
   - `data/atlas/generated/atlas-import-ready.json`
   - `supabase/atlas-import.generated.sql`
   - `supabase/atlas-catalog.generated.sql`

7. 数据库执行顺序建议：
   - 先执行 `supabase/atlas-catalog.sql`
   - 再执行 `supabase/atlas-sync.sql`
   - 再执行 `supabase/atlas-catalog.generated.sql`
   - 最后执行：

```sql
select public.sync_approved_atlas_entries();
```

这样 `atlas_entries` 中已审核且未同步的图谱会自动进入前台 `plants` 表。

## Commons 适配输入示例

原始样例文件：

- `data/atlas/external/commons.sample.json`

运行后会生成：

- `data/atlas/inbox/commons-batch.json`

## JSON 字段示例

```json
{
  "slug": "camellia-hangzhou",
  "name": "山茶",
  "scientific_name": "Camellia japonica",
  "description": "冬末到早春最有存在感的园林花木之一。",
  "image_url": "/plants/atlas/camellia.jpg",
  "latitude": 30.2741,
  "longitude": 120.1551,
  "tags": ["观花", "庭院", "常绿"],
  "season": "冬季",
  "region": "华东",
  "flower_meaning": "理想的爱、沉静与坚韧",
  "source": "manual-curation",
  "source_url": "https://commons.wikimedia.org/",
  "image_license": "本地审核后使用",
  "image_attribution": "curated local atlas"
}
```

## 回退

当前版本的图谱代码快照已保存到：

- `backups/demo-atlas.2026-04-06.ts`

如果新的导入方案不满意，可以直接恢复这个文件。
