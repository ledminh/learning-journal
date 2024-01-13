import { Material } from "@/data/server/types/material";

/**
 * Checks if the given object is a Material.
 * The reason this function only checks for the id property is because it is used to distinguish between Material and DataToCreateMaterial and DataToCreateMaterial doesn't have id.
 * @param material The object to check
 */
export default function isMaterial(material: any): material is Material {
  return (material as Material).id !== undefined;
}
