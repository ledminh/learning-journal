// import { Material } from "@prisma/client";

// import prismaClient from "./prismaClient";

// import { AddTagFunction } from "@/types/tag";

// export const addTag: AddTagFunction = async (tag) => {
//   try {
//     const dbTag = await prismaClient.tag.create({
//       data: {
//         name: tag.name,
//         slug: tag.slug,
//       },
//     });
//     return {
//       errorMessage: null,
//       payload: dbTag,
//     };
//   } catch (error: any) {
//     return {
//       errorMessage: error.message,
//       payload: null,
//     };
//   }
// };
