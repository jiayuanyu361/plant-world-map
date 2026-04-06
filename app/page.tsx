import { HomePageClient } from "@/components/home-page-client";
import { getApprovedPlants } from "@/lib/data/plants";
import { buildHomepagePlants } from "@/lib/demo-atlas";

export default async function HomePage() {
  const plants = buildHomepagePlants(await getApprovedPlants());

  return <HomePageClient plants={plants} />;
}
