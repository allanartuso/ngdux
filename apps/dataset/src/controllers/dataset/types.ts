export interface TrainingItem {
  messages: {
    role: string;
    content: any;
  }[];
}

export interface DatasetItem {
  finalTrainingItem: TrainingItem;
  success: boolean;
  dataset: {
    instruction: string;
    system_message: string;
  };
}
