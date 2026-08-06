import { getAllPerfumes } from "@/lib/data";
import CollectionClient from "./CollectionClient";

export default function CollectionPage() {
  const perfumes = getAllPerfumes();
  return <CollectionClient perfumes={perfumes} />;
}
