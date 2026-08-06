import { getAllPerfumes } from "@/lib/data";
import CompareClient from "./CompareClient";

export default function ComparePage() {
  const perfumes = getAllPerfumes();
  return <CompareClient perfumes={perfumes} />;
}
