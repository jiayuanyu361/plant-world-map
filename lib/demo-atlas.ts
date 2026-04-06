import type { Plant, PlantAtlasInfo } from "@/lib/types";

type Season = "春季" | "夏季" | "秋季" | "冬季";

type PlantMeta = {
  label: string;
  aliases: string[];
  season: Season;
  icon: string;
  image?: string;
  viewingSeason: string;
  regionFocus: string;
  habitat: string;
  flowerMeaning?: string;
};

const PLANT_META: Record<string, PlantMeta> = {
  jacaranda: atlas({ label: "蓝花楹", aliases: ["Blue Jacaranda", "jacaranda", "蓝花楹"], season: "春季", icon: "🌸", image: "/plants/atlas/jacaranda.jpg", viewingSeason: "春末至初夏", regionFocus: "南美、地中海沿岸与亚热带城市", habitat: "城市街道与开阔公园", flowerMeaning: "在离别与重逢之间，保留温柔而明亮的记忆" }),
  monstera: atlas({ label: "龟背竹", aliases: ["Monstera Deliciosa", "monstera", "龟背竹"], season: "夏季", icon: "🌿", image: "/plants/atlas/monstera.jpg", viewingSeason: "全年可观，盛夏最茂密", regionFocus: "东南亚、热带美洲与室内园艺空间", habitat: "热带庭园与室内观叶场景" }),
  lavender: atlas({ label: "薰衣草", aliases: ["Lavender", "lavender", "薰衣草"], season: "夏季", icon: "🪻", image: "/plants/atlas/lavender.jpg", viewingSeason: "初夏至盛夏", regionFocus: "法国南部、地中海地区与高原花田", habitat: "花田、坡地与香草园", flowerMeaning: "等待、治愈与温柔的守候" }),
  sakura: atlas({ label: "樱花", aliases: ["Sakura", "Cherry Blossom", "sakura", "樱花"], season: "春季", icon: "🌸", image: "/plants/atlas/sakura.jpg", viewingSeason: "早春至仲春", regionFocus: "日本、韩国、中国东部与温带城市", habitat: "河岸、公园与城市街道", flowerMeaning: "生命、希望与短暂而盛大的相遇" }),
  camellia: atlas({ label: "山茶", aliases: ["Camellia", "camellia", "山茶"], season: "冬季", icon: "🌺", image: "/plants/atlas/camellia.jpg", viewingSeason: "冬末至早春", regionFocus: "华东、华南、日本与温润庭园", habitat: "庭院、山地林缘与茶花园", flowerMeaning: "理想的爱、沉静与坚韧" }),
  ginkgo: atlas({ label: "银杏", aliases: ["Ginkgo", "ginkgo", "银杏"], season: "秋季", icon: "🍂", image: "/plants/atlas/ginkgo.JPG", viewingSeason: "深秋", regionFocus: "中国、韩国、日本与温带城市街道", habitat: "城市行道树与古寺庭院" }),
  eucalyptus: atlas({ label: "尤加利", aliases: ["Eucalyptus", "eucalyptus", "尤加利"], season: "秋季", icon: "🌿", image: "/plants/atlas/eucalyptus.jpeg", viewingSeason: "全年可观，秋季叶色更沉静", regionFocus: "澳大利亚、南非与海岸型城市", habitat: "海岸地带、旷野与庭园" }),
  lotus: atlas({ label: "荷花", aliases: ["Lotus", "lotus", "荷花"], season: "夏季", icon: "🪷", image: "/plants/atlas/lotus.jpg", viewingSeason: "盛夏", regionFocus: "中国江南、东南亚与静水园林", habitat: "湖面、池塘与园林水域", flowerMeaning: "清净、自持与从容生长" }),
  sunflower: atlas({ label: "向日葵", aliases: ["Sunflower", "sunflower", "向日葵"], season: "夏季", icon: "🌻", image: "/plants/atlas/sunflower.jpg", viewingSeason: "盛夏至初秋", regionFocus: "北美、东欧平原与开阔田野", habitat: "花田、农场与旷野", flowerMeaning: "向光而生、热烈与坚定" }),
  rosemary: atlas({ label: "迷迭香", aliases: ["Rosemary", "rosemary", "迷迭香"], season: "秋季", icon: "🌿", image: "/plants/atlas/rosemary.JPG", viewingSeason: "全年可观，秋冬香气更清晰", regionFocus: "地中海、南欧庭院与香草花园", habitat: "香草园、石砌庭院与干燥坡地" }),
  hydrangea: atlas({ label: "绣球", aliases: ["Hydrangea", "hydrangea", "绣球"], season: "夏季", icon: "💠", image: "/plants/atlas/hydrangea.jpg", viewingSeason: "初夏至盛夏", regionFocus: "日本、英国与东亚雨水充沛地区", habitat: "庭院、林缘与山谷", flowerMeaning: "团聚、圆满与细腻心意" }),
  olive: atlas({ label: "橄榄树", aliases: ["Olive Tree", "olive", "橄榄树"], season: "秋季", icon: "🌳", image: "/plants/atlas/olive.jpg", viewingSeason: "秋季果熟期与全年常绿姿态", regionFocus: "地中海沿岸、中东与温暖丘陵", habitat: "果园、山坡与干燥庭院" }),
  aloe: atlas({ label: "芦荟", aliases: ["Aloe Vera", "aloe", "芦荟"], season: "冬季", icon: "🌵", image: "/plants/atlas/aloe.jpg", viewingSeason: "全年可观，冬季状态稳定", regionFocus: "非洲南部、热带庭园与室内阳台", habitat: "多肉花坛、阳台与温暖干燥地区" }),
  osmanthus: atlas({ label: "桂花", aliases: ["Osmanthus", "osmanthus", "桂花"], season: "秋季", icon: "🌼", image: "/plants/atlas/osmanthus.jpg", viewingSeason: "仲秋", regionFocus: "中国南方、东亚庭院与山地城镇", habitat: "庭院、街角与园林", flowerMeaning: "丰盛、喜悦与被秋风记住的香气" }),
  jasmine: atlas({ label: "茉莉", aliases: ["Jasmine", "jasmine", "茉莉"], season: "夏季", icon: "🤍", image: "/plants/atlas/jasmine.jpg", viewingSeason: "夏季夜晚至初秋", regionFocus: "华南、东南亚与温暖院落", habitat: "庭院、阳台与香草边界", flowerMeaning: "纯净、温柔与不张扬的爱" }),
  bougainvillea: atlas({ label: "三角梅", aliases: ["Bougainvillea", "bougainvillea", "三角梅"], season: "夏季", icon: "🌺", image: "/plants/atlas/bougainvillea.jpg", viewingSeason: "夏秋两季", regionFocus: "巴西、南方滨海城市与热带街景", habitat: "街角花墙、屋顶与庭院围栏", flowerMeaning: "热烈、奔放与明亮的生命力" }),
  crabapple: atlas({ label: "海棠", aliases: ["Crabapple", "crabapple", "海棠"], season: "春季", icon: "🌸", image: "/plants/atlas/crabapple.JPG", viewingSeason: "仲春", regionFocus: "中国北方、东亚园林与温带城市", habitat: "园林、街区与古典庭院", flowerMeaning: "温婉、思念与春日相逢" }),
  clematis: atlas({ label: "铁线莲", aliases: ["Clematis", "clematis", "铁线莲"], season: "春季", icon: "🪻", image: "/plants/atlas/clematis.jpg", viewingSeason: "春末至初夏", regionFocus: "欧洲庭园与温带藤架空间", habitat: "花架、墙面与小型庭院", flowerMeaning: "高洁、优雅与被轻轻托起的爱意" }),
  tulip: atlas({ label: "郁金香", aliases: ["Tulip", "tulip", "郁金香"], season: "春季", icon: "🌷", image: "/plants/atlas/tulip.JPG", viewingSeason: "早春至仲春", regionFocus: "荷兰、土耳其与春季花田", habitat: "花田、球根花境与城市公园", flowerMeaning: "告白、祝福与盛放的秩序感" }),
  cedar: atlas({ label: "雪松", aliases: ["Cedar", "cedar", "雪松"], season: "冬季", icon: "🌲", image: "/plants/atlas/cedar.jpg", viewingSeason: "冬季形态最醒目", regionFocus: "黎巴嫩、地中海山地与寒凉庭园", habitat: "山地、纪念性园林与广场" }),
  maple: atlas({ label: "日本红枫", aliases: ["Japanese Maple", "maple", "日本红枫"], season: "秋季", icon: "🍁", image: "/plants/atlas/maple.jpg", viewingSeason: "深秋", regionFocus: "日本、韩国与东亚庭园", habitat: "庭院、溪谷与山地步道" }),
  cactus: atlas({ label: "仙人掌", aliases: ["Cactus", "cactus", "仙人掌"], season: "冬季", icon: "🌵", image: "/plants/atlas/cactus.jpg", viewingSeason: "全年可观，冬季形态感更强", regionFocus: "墨西哥、北非与干旱地区", habitat: "沙漠、岩石园与阳台花盆" }),
  gardenia: atlas({ label: "栀子", aliases: ["Gardenia", "gardenia", "栀子"], season: "夏季", icon: "🤍", image: "/plants/atlas/gardenia.jpg", viewingSeason: "初夏至仲夏", regionFocus: "华南、日本与潮湿庭院", habitat: "庭院、绿篱与庭前花境", flowerMeaning: "守候、纯白与夏夜的洁净气息" }),
  banana: atlas({ label: "芭蕉", aliases: ["Banana Plant", "banana", "芭蕉"], season: "夏季", icon: "🍃", image: "/plants/atlas/banana.jpg", viewingSeason: "盛夏", regionFocus: "东南亚、海岛与热带庭园", habitat: "海岛聚落、庭院与湿热景观" }),
  tea: atlas({ label: "茶树", aliases: ["Tea Plant", "tea", "茶树"], season: "秋季", icon: "🍃", image: "/plants/atlas/tea.jpg", viewingSeason: "春采嫩芽，秋观茶园层次", regionFocus: "中国西南、印度东北与东亚山地", habitat: "山地茶园、雾谷与坡地" }),
  wisteria: atlas({ label: "紫藤", aliases: ["Wisteria", "wisteria", "紫藤"], season: "春季", icon: "🪻", image: "/plants/atlas/wisteria.jpg", viewingSeason: "暮春", regionFocus: "日本、中国与温带廊架庭院", habitat: "廊架、院墙与古树旁", flowerMeaning: "沉醉、依恋与缓慢垂落的浪漫" }),
  azalea: atlas({ label: "杜鹃", aliases: ["Azalea", "azalea", "杜鹃"], season: "春季", icon: "🌺", image: "/plants/atlas/azalea.jpg", viewingSeason: "仲春", regionFocus: "中国西南、朝鲜半岛与山地丘陵", habitat: "山坡、林缘与花境", flowerMeaning: "热烈、奔放与山野的召唤" }),
  magnolia: atlas({ label: "玉兰", aliases: ["Magnolia", "magnolia", "玉兰"], season: "春季", icon: "🌷", image: "/plants/atlas/magnolia.jpg", viewingSeason: "早春", regionFocus: "中国东部、北美与城市庭院", habitat: "街道、公园与私家庭院", flowerMeaning: "高洁、端庄与春天的第一声问候" }),
  peachblossom: atlas({ label: "桃花", aliases: ["Peach Blossom", "peach blossom", "桃花"], season: "春季", icon: "🌸", image: "/plants/atlas/peachblossom.jpg", viewingSeason: "早春", regionFocus: "中国西部山谷、东亚果园与村落", habitat: "山谷、果园与河岸", flowerMeaning: "好运、相逢与柔软明媚的春讯" }),
  waterlily: atlas({ label: "睡莲", aliases: ["Water Lily", "water lily", "睡莲"], season: "夏季", icon: "🪷", image: "/plants/atlas/waterlily.jpg", viewingSeason: "夏季清晨", regionFocus: "东南亚、热带池塘与静水湿地", habitat: "静水池塘、花园水景与湿地", flowerMeaning: "静谧、苏醒与水面上的温柔" }),
  chrysanthemum: atlas({ label: "菊花", aliases: ["Chrysanthemum", "chrysanthemum", "菊花"], season: "秋季", icon: "🌼", image: "/plants/atlas/chrysanthemum.JPG", viewingSeason: "深秋", regionFocus: "中国中原、日本与东亚庭园", habitat: "庭院、花展与节气景观", flowerMeaning: "高洁、长久与秋日的从容" }),
  plumblossom: atlas({ label: "梅花", aliases: ["Plum Blossom", "plum blossom", "梅花"], season: "冬季", icon: "🌸", image: "/plants/atlas/plumblossom.jpg", viewingSeason: "冬末至早春", regionFocus: "江南、东亚园林与寒凉庭院", habitat: "园林、水岸与古典庭院", flowerMeaning: "坚韧、清雅与寒中先开的勇气" }),
  narcissus: atlas({ label: "水仙", aliases: ["Narcissus", "daffodil", "narcissus", "水仙"], season: "冬季", icon: "🌼", image: "/plants/atlas/narcissus.jpg", viewingSeason: "冬季至春节前后", regionFocus: "福建、地中海沿岸与温润室内", habitat: "案头水培、庭院边界与湿润花境", flowerMeaning: "自省、清明与新岁来临的祝愿" }),
  holly: atlas({ label: "冬青", aliases: ["Holly", "holly", "冬青"], season: "冬季", icon: "🍃", image: "/plants/atlas/holly.jpg", viewingSeason: "冬季果熟期", regionFocus: "欧洲、北美与冬季庭园", habitat: "绿篱、庭院与林地边缘" })
};

const ALIAS_MAP = Object.fromEntries(
  Object.entries(PLANT_META).flatMap(([key, metaInfo]) =>
    [key, metaInfo.label, ...metaInfo.aliases].map((alias) => [normalizeText(alias), key])
  )
) as Record<string, keyof typeof PLANT_META>;

const SEASON_STYLE: Record<Season, { bg: string; glow: string; chip: string; text: string }> = {
  春季: { bg: "#fff1f5", glow: "#f5d6e2", chip: "#d67697", text: "#64374c" },
  夏季: { bg: "#eef8ef", glow: "#d5ebd5", chip: "#5e8a56", text: "#345034" },
  秋季: { bg: "#fff7ec", glow: "#f2e0bb", chip: "#bd8f3d", text: "#5f4a22" },
  冬季: { bg: "#f4f7fb", glow: "#d8e2f0", chip: "#6b88ad", text: "#33485f" }
};

const GENERATED_IMAGE_CACHE = new Map<string, string>();

const DEMO_PLANTS: Plant[] = [
  createDemoPlant("demo-001", "jacaranda", "蓝紫色花冠在街道上像一片轻盈云雾，是春末最有记忆点的城市树景。", -34.6037, -58.3816, ["观花", "乔木", "城市"], 0, 8, "demo-user-01"),
  createDemoPlant("demo-002", "monstera", "巨大的裂叶像热带岛屿的风，在室内空间里也能保持蓬勃的生命力。", 1.3521, 103.8198, ["热带", "观叶", "室内"], 0, 6, "demo-user-02"),
  createDemoPlant("demo-003", "lavender", "整片花田在风里起伏，带着清新的草本香气，是最适合夏季远行的植物景观。", 43.834, 5.792, ["芳香", "观花", "花田"], 1, 11, "demo-user-03"),
  createDemoPlant("demo-004", "sakura", "花期很短，却总能把一个城市的春天定格成共同记忆。", 35.6762, 139.6503, ["观花", "城市", "温带"], 1, 8, "demo-user-04"),
  createDemoPlant("demo-005", "camellia", "花色饱满，叶面油亮，冬春交替时依然能在庭院里保持鲜明存在感。", 30.2741, 120.1551, ["庭院", "观花", "常绿"], 2, 15, "demo-user-05"),
  createDemoPlant("demo-006", "ginkgo", "金黄色叶片在秋季最动人，是许多城市街道最具辨识度的树种之一。", 37.5665, 126.978, ["秋色", "乔木", "城市"], 2, 10, "demo-user-01"),
  createDemoPlant("demo-007", "eucalyptus", "灰绿色叶片和干净的树形，让海岸城市显得轻盈而安静。", -37.8136, 144.9631, ["芳香", "乔木", "海岸"], 3, 14, "demo-user-06"),
  createDemoPlant("demo-008", "lotus", "挺水而生，花与叶层层展开，是东方园林里最经典的夏日景致。", 31.2989, 120.5853, ["水生", "观花", "池塘"], 3, 8, "demo-user-07"),
  createDemoPlant("demo-009", "sunflower", "大片花盘随日照转动，常被用来记录田野与公路旅途的明亮瞬间。", 38.5, -98.0, ["花田", "观花", "高辨识度"], 4, 10, "demo-user-08"),
  createDemoPlant("demo-010", "rosemary", "细长叶片带有清冽草本香气，是地中海厨房和石砌庭院共同塑造出的味道。", 37.9838, 23.7275, ["香草", "庭院", "芳香"], 4, 4, "demo-user-02"),
  createDemoPlant("demo-011", "hydrangea", "层层花球在雨季里显得格外丰盈，是东亚庭园最受欢迎的夏季花木之一。", 32.7503, 129.8777, ["观花", "庭院", "雨季"], 5, 12, "demo-user-03"),
  createDemoPlant("demo-012", "olive", "银绿色叶片和古老树干一起构成了南欧景观最安静的背景。", 35.2401, 24.8093, ["果树", "地中海", "耐旱"], 5, 7, "demo-user-04"),
  createDemoPlant("demo-013", "aloe", "叶片厚实、边缘带齿，既有药用印象，也常见于干燥地区的庭园景观。", -33.9249, 18.4241, ["多肉", "耐旱", "药用"], 6, 13, "demo-user-05"),
  createDemoPlant("demo-014", "osmanthus", "秋夜里最容易被气味记住的植物，花很小，却总能先于视线抵达。", 25.2736, 110.29, ["芳香", "庭院", "城市"], 6, 9, "demo-user-06"),
  createDemoPlant("demo-015", "jasmine", "花朵洁白、香气柔和，在南方城市和院落里都很常见。", 21.0278, 105.8342, ["芳香", "观花", "庭院"], 7, 16, "demo-user-07"),
  createDemoPlant("demo-016", "bougainvillea", "枝条舒展、色彩明亮，常把街角和屋顶边缘点缀得非常热烈。", -22.9068, -43.1729, ["热带", "观花", "街景"], 7, 6, "demo-user-08"),
  createDemoPlant("demo-017", "crabapple", "花瓣轻盈，适合在春季街区和古典园林里制造层层叠叠的柔软感。", 30.5728, 104.0668, ["观花", "园林", "春景"], 8, 12, "demo-user-01"),
  createDemoPlant("demo-018", "clematis", "藤蔓攀援能力强，花形优雅，是极具装饰性的立体庭园植物。", 51.5072, -0.1276, ["藤本", "观花", "庭院"], 8, 9, "demo-user-02"),
  createDemoPlant("demo-019", "tulip", "颜色整齐、花型干净，是最能代表春天秩序感的花卉之一。", 52.3676, 4.9041, ["观花", "花田", "球根"], 9, 15, "demo-user-03"),
  createDemoPlant("demo-020", "cedar", "高耸而稳定，常作为山地或公共空间里的骨架型树种。", 33.8938, 35.5018, ["针叶", "乔木", "山地"], 9, 8, "demo-user-04"),
  createDemoPlant("demo-021", "maple", "细裂叶在季节变化里层次丰富，是秋色庭院里最具观赏性的彩叶树之一。", 35.0116, 135.7681, ["彩叶", "乔木", "庭院"], 10, 14, "demo-user-05"),
  createDemoPlant("demo-022", "cactus", "极端干燥环境中的代表植物，轮廓清晰，生命力强。", 19.4326, -99.1332, ["耐旱", "沙漠", "多肉"], 10, 6, "demo-user-06"),
  createDemoPlant("demo-023", "gardenia", "花瓣厚润、香味洁净，是华南庭院里辨识度很高的白花植物。", 23.1291, 113.2644, ["芳香", "白花", "庭院"], 11, 10, "demo-user-07"),
  createDemoPlant("demo-024", "banana", "宽大的叶片总能带来湿润热带的氛围，也常出现在海岛聚落中。", -8.6705, 115.2126, ["热带", "观叶", "海岛"], 11, 5, "demo-user-08"),
  createDemoPlant("demo-025", "tea", "整齐的茶行铺满山地坡面，是最典型的植物生产景观之一。", 27.036, 88.2627, ["经济植物", "山地", "常绿"], 12, 13, "demo-user-09"),
  createDemoPlant("demo-026", "wisteria", "瀑布状花串垂下时，能让廊架和老院子瞬间拥有戏剧性的浪漫。", 34.6937, 135.5023, ["藤本", "观花", "庭院"], 12, 7, "demo-user-10"),
  createDemoPlant("demo-027", "azalea", "成片开放时颜色浓烈，是山地春景里最醒目的灌木之一。", 25.0438, 102.7103, ["观花", "山地", "灌木"], 13, 12, "demo-user-11"),
  createDemoPlant("demo-028", "magnolia", "枝头先开大花再展叶，是初春城市街道最优雅的信号。", 31.2304, 121.4737, ["观花", "乔木", "城市"], 13, 9, "demo-user-12"),
  createDemoPlant("demo-029", "peachblossom", "柔软的粉色花云沿着山谷铺开，是高原春季最有节庆感的景致之一。", 29.6548, 94.3499, ["观花", "山谷", "春景"], 14, 10, "demo-user-13"),
  createDemoPlant("demo-030", "waterlily", "水面浮叶舒展，花朵像漂浮在晨雾上的色块，适合炎热季节的静水景观。", 13.7563, 100.5018, ["水生", "池塘", "观花"], 14, 6, "demo-user-14"),
  createDemoPlant("demo-031", "chrysanthemum", "花型繁复、颜色沉静，是秋季节庆与园艺展览里最常见的主角。", 34.7973, 114.3076, ["观花", "节气", "庭院"], 15, 12, "demo-user-15"),
  createDemoPlant("demo-032", "plumblossom", "寒意未尽时便率先开花，是冬末最有精神气的树种之一。", 32.0603, 118.7969, ["观花", "冬景", "园林"], 15, 8, "demo-user-16"),
  createDemoPlant("demo-033", "narcissus", "水边与案头都常见，花形简洁，是冬季最适合室内外过渡观赏的花卉之一。", 24.5133, 117.6471, ["球根", "观花", "庭院"], 16, 10, "demo-user-17"),
  createDemoPlant("demo-034", "holly", "常绿叶片与鲜明果色让它在冬季景观里格外醒目，常见于欧洲庭园。", 55.9533, -3.1883, ["常绿", "庭院", "果景"], 16, 6, "demo-user-18")
];

export function buildHomepagePlants(plants: Plant[]) {
  const merged = new Map<string, Plant>();

  for (const plant of plants.map(withPlantImage)) {
    if (hasRealPlantImage(plant)) {
      merged.set(normalizeKey(plant.name), plant);
    }
  }

  for (const plant of DEMO_PLANTS.map(withPlantImage)) {
    const key = normalizeKey(plant.name);
    if (hasRealPlantImage(plant) && !merged.has(key)) {
      merged.set(key, plant);
    }
  }

  return [...merged.values()]
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
    .slice(0, 36);
}

export function withPlantImage(plant: Plant): Plant {
  const meta = getPlantMeta(plant.name);
  const atlas = mergeAtlasInfo(plant.atlas ?? null, meta);

  return {
    ...plant,
    description: plant.description,
    image_url: resolvePlantImage(plant),
    tags: mergeTags(plant.tags ?? [], atlas?.season ?? meta?.season),
    atlas
  };
}
export function resolvePlantImage(plant: Pick<Plant, "name" | "image_url">) {
  if (plant.image_url && isStableLocalImage(plant.image_url)) {
    return plant.image_url;
  }

  return getPlantImageUrl(plant.name);
}

export function getPlantImageUrl(name: string) {
  const meta = getPlantMeta(name);

  if (!meta) {
    return "/plants/generic.svg";
  }

  if (meta.image) {
    return meta.image;
  }

  if (!GENERATED_IMAGE_CACHE.has(meta.label)) {
    GENERATED_IMAGE_CACHE.set(meta.label, createAtlasSvg(meta));
  }

  return GENERATED_IMAGE_CACHE.get(meta.label) ?? "/plants/generic.svg";
}

export function hasRealPlantImage(plant: Pick<Plant, "name" | "image_url">) {
  if (plant.image_url && isRealPhotoUrl(plant.image_url)) {
    return true;
  }

  const meta = getPlantMeta(plant.name);
  return Boolean(meta?.image && isRealPhotoUrl(meta.image));
}

export function filterPlantsWithRealImages(plants: Plant[]) {
  return plants.map(withPlantImage).filter((plant) => hasRealPlantImage(plant));
}
export function getPlantInsights(plantOrName: string | Pick<Plant, "name" | "atlas">) {
  const name = typeof plantOrName === "string" ? plantOrName : plantOrName.name;
  const atlas = typeof plantOrName === "string" ? null : plantOrName.atlas ?? null;
  const meta = getPlantMeta(name);
  const merged = mergeAtlasInfo(atlas, meta);

  if (!merged && !meta) {
    return null;
  }

  return {
    season: merged?.season ?? meta?.season ?? null,
    viewingSeason: merged?.viewing_season ?? meta?.viewingSeason ?? null,
    regionFocus: merged?.region_focus ?? meta?.regionFocus ?? null,
    habitat: merged?.habitat ?? meta?.habitat ?? null,
    flowerMeaning: merged?.flower_meaning ?? meta?.flowerMeaning ?? null,
    scientificName: merged?.scientific_name ?? null
  };
}

export function getPlantMarkerTone(plant: Pick<Plant, "name" | "tags">) {
  const tags = plant.tags ?? [];
  if (tags.includes("水生") || tags.includes("池塘")) return "water";
  if (tags.includes("多肉") || tags.includes("耐旱") || tags.includes("沙漠")) return "desert";
  if (tags.includes("乔木") || tags.includes("针叶") || tags.includes("果树") || tags.includes("常绿")) return "tree";
  if (tags.includes("观叶") || tags.includes("藤本") || tags.includes("香草") || tags.includes("芳香")) return "foliage";
  if (tags.includes("观花") || tags.includes("白花") || tags.includes("球根") || tags.includes("花田")) return "flower";
  return "botanical";
}
export function getPlantMarkerEmoji(plant: Pick<Plant, "name" | "tags">) {
  const meta = getPlantMeta(plant.name);
  if (meta?.icon) {
    return meta.icon;
  }

  const tags = plant.tags ?? [];
  if (tags.includes("观花") || tags.includes("白花") || tags.includes("春季")) return "🌸";
  if (tags.includes("多肉") || tags.includes("沙漠") || tags.includes("耐旱")) return "🌵";
  if (tags.includes("藤本") || tags.includes("芳香") || tags.includes("香草")) return "🌿";
  if (tags.includes("花田")) return "🌼";
  if (tags.includes("乔木") || tags.includes("针叶")) return "🌳";
  return "🌱";
}

function atlas(metaInfo: PlantMeta): PlantMeta {
  return metaInfo;
}

function createDemoPlant(
  id: string,
  key: keyof typeof PLANT_META,
  description: string,
  latitude: number,
  longitude: number,
  tags: string[],
  dayOffset: number,
  hour: number,
  createdBy: string
): Plant {
  const info = PLANT_META[key];

  return {
    id,
    name: info.label,
    description,
    image_url: null,
    latitude,
    longitude,
    tags: mergeTags(tags, info.season),
    status: "approved",
    created_at: createTimestamp(dayOffset, hour),
    created_by: createdBy,
    atlas: mergeAtlasInfo(null, info),
    user_profiles: null
  };
}

function getPlantMeta(name: string) {
  const key = ALIAS_MAP[normalizeText(name)];
  return key ? PLANT_META[key] : null;
}

function mergeTags(tags: string[], season?: string | null) {
  return [...new Set([season, ...tags].filter(Boolean) as string[])];
}

function mergeAtlasInfo(atlas: PlantAtlasInfo | null | undefined, meta?: PlantMeta | null): PlantAtlasInfo | null {
  const merged: PlantAtlasInfo = {
    scientific_name: atlas?.scientific_name ?? null,
    season: atlas?.season ?? meta?.season ?? null,
    viewing_season: atlas?.viewing_season ?? meta?.viewingSeason ?? null,
    region: atlas?.region ?? null,
    region_focus: atlas?.region_focus ?? meta?.regionFocus ?? null,
    habitat: atlas?.habitat ?? meta?.habitat ?? null,
    flower_meaning: atlas?.flower_meaning ?? meta?.flowerMeaning ?? null
  };

  return Object.values(merged).some((value) => value) ? merged : null;
}

function createTimestamp(dayOffset: number, hour: number) {
  const base = new Date(Date.UTC(2026, 3, 2, hour, 0, 0));
  base.setUTCDate(base.getUTCDate() - dayOffset);
  return base.toISOString();
}

function isStableLocalImage(url: string) {
  return url.startsWith("/plants/") || url.startsWith("data:image/");
}

function isRealPhotoUrl(url: string) {
  const normalized = url.toLowerCase();
  return normalized.endsWith(".jpg") || normalized.endsWith(".jpeg") || normalized.endsWith(".png") || normalized.endsWith(".webp");
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function normalizeKey(value: string) {
  const normalized = normalizeText(value);
  return ALIAS_MAP[normalized] ?? normalized;
}

function createAtlasSvg(meta: PlantMeta) {
  const seasonStyle = SEASON_STYLE[meta.season];
  const label = escapeXml(meta.label);
  const season = escapeXml(meta.season);
  const icon = escapeXml(meta.icon);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" role="img" aria-label="${label}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${seasonStyle.bg}" />
          <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stop-color="${seasonStyle.glow}" stop-opacity="0.95" />
          <stop offset="100%" stop-color="${seasonStyle.glow}" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="480" rx="44" fill="url(#bg)" />
      <circle cx="498" cy="98" r="104" fill="${seasonStyle.glow}" opacity="0.35" />
      <circle cx="320" cy="214" r="142" fill="url(#glow)" />
      <circle cx="144" cy="124" r="46" fill="#ffffff" opacity="0.42" />
      <circle cx="152" cy="132" r="18" fill="#ffffff" opacity="0.68" />
      <g transform="translate(320 222)">
        <circle r="112" fill="#ffffff" opacity="0.32" />
        <text y="34" text-anchor="middle" font-size="132">${icon}</text>
      </g>
      <g transform="translate(28 28)">
        <rect width="92" height="34" rx="17" fill="#ffffff" opacity="0.76" />
        <text x="46" y="22" text-anchor="middle" font-family="'Microsoft YaHei','PingFang SC','Segoe UI',sans-serif" font-size="15" letter-spacing="1" fill="${seasonStyle.text}">${season}</text>
      </g>
      <g transform="translate(34 398)">
        <rect width="228" height="42" rx="21" fill="#ffffff" opacity="0.4" />
        <text x="20" y="27" font-family="'Microsoft YaHei','PingFang SC','Segoe UI',sans-serif" font-size="22" font-weight="700" fill="${seasonStyle.text}">${label}</text>
      </g>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.replace(/\s{2,}/g, " ").trim())}`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}





