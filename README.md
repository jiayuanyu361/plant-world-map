# Plant World Map

一个完整的全栈 Web 应用示例，技术栈如下：

- 前端：Next.js App Router + Tailwind CSS + Leaflet + OpenStreetMap
- 后端：Supabase（PostgreSQL + Auth + Storage）

## 已实现功能

- 地图首页：展示全球地图，并从 Supabase 获取 `approved` 植物数据
- 植物详情页：名称、图片、描述、标签、评论
- 提交植物：登录用户提交后写入 Supabase，状态为 `pending`
- 用户系统：Supabase Auth 登录 / 注册
- 评论系统：登录用户可发表评论
- Admin 后台：审核 `pending` 植物并 approve / reject
- 数据库 SQL：位于 `supabase/schema.sql`

## 1. 创建 Supabase 项目

1. 打开 Supabase，新建项目。
2. 进入 SQL Editor。
3. 执行 [supabase/schema.sql](/E:/AICoding/plant-world-map/supabase/schema.sql) 里的 SQL。
4. 到 Authentication 开启 Email 登录。
5. 到 Storage 确认已经存在 `plant-images` bucket。

如果你已经有自己的 SQL，可以把 [supabase/schema.sql](/E:/AICoding/plant-world-map/supabase/schema.sql) 替换成你的版本，再把查询字段按你的表结构微调。

## 2. 配置环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

填写以下内容：

```env
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 Supabase anon key
```

## 3. 安装依赖

如果你之前已经装过 Mapbox 版本依赖，执行：

```bash
npm uninstall mapbox-gl @types/mapbox-gl
npm install leaflet @types/leaflet
```

如果是第一次安装，直接执行：

```bash
npm install
```

## 4. 本地运行

```bash
npm run dev
```

启动后访问：

```text
http://localhost:3000
```

## 5. 设置管理员

注册一个普通账号后，在 Supabase SQL Editor 执行：

```sql
update public.user_profiles
set is_admin = true
where id = '你的用户 uuid';
```

然后重新登录，就可以访问 `/admin`。

## 6. 目录说明

- [app/page.tsx](/E:/AICoding/plant-world-map/app/page.tsx)：地图首页
- [components/map-view.tsx](/E:/AICoding/plant-world-map/components/map-view.tsx)：Leaflet 地图组件
- [app/plants/[id]/page.tsx](/E:/AICoding/plant-world-map/app/plants/[id]/page.tsx)：植物详情页
- [app/submit/page.tsx](/E:/AICoding/plant-world-map/app/submit/page.tsx)：提交植物
- [app/auth/page.tsx](/E:/AICoding/plant-world-map/app/auth/page.tsx)：登录 / 注册
- [app/admin/page.tsx](/E:/AICoding/plant-world-map/app/admin/page.tsx)：审核后台
- [lib/actions.ts](/E:/AICoding/plant-world-map/lib/actions.ts)：Server Actions
- [lib/data/plants.ts](/E:/AICoding/plant-world-map/lib/data/plants.ts)：Supabase 数据查询
- [supabase/schema.sql](/E:/AICoding/plant-world-map/supabase/schema.sql)：数据库结构

## 7. 说明

- 地图已改为 Leaflet + OpenStreetMap，不再需要 Mapbox token。
- 如果你把你的原始 SQL 发我，我可以继续帮你把字段、RLS、索引和页面查询完全对齐。
