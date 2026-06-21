import { buttonsExamples } from "./buttons";
import { chartsExamples } from "./charts";
import { dataDisplayExamples } from "./data-display";
import { dateTimeExamples } from "./date-time";
import { feedbackExamples } from "./feedback";
import { formsExamples } from "./forms";
import { navigationExamples } from "./navigation";
import { overlaysExamples } from "./overlays";
import { premiumExamples } from "./premium";
import type { ExampleMap } from "./types";

export const EXAMPLES: ExampleMap = {
  ...buttonsExamples,
  ...formsExamples,
  ...dataDisplayExamples,
  ...feedbackExamples,
  ...overlaysExamples,
  ...navigationExamples,
  ...dateTimeExamples,
  ...chartsExamples,
  ...premiumExamples,
};
