import { Material } from "@/data/server/types/material";

export default function isMaterial(material: any): material is Material {
  return (material as Material).id !== undefined;
}
