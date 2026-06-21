import { applicationBlocks } from "./application";
import { marketingBlocks } from "./marketing";
import type { BlockContentMap } from "./types";

export const BLOCKS: BlockContentMap = {
  ...marketingBlocks,
  ...applicationBlocks,
};
