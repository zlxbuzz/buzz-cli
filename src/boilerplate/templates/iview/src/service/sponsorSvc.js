import { get } from "./api";
export const lists = async () => {
  await get("/sponsor/lists");
};
