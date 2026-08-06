import { getAllPerfumes } from "@/lib/data";
import HomeClient from "./HomeClient";

export default function Home() {
  const perfumes = getAllPerfumes();
  return <HomeClient perfumes={perfumes} />;
}
