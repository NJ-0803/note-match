import { getAllPerfumes } from "@/lib/data";
import CatalogueClient from "./CatalogueClient";

export default function CataloguePage() {
  const perfumes = getAllPerfumes();
  return <CatalogueClient perfumes={perfumes} />;
}
