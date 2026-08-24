export type LearningModule = {
  id: number;
  title: string;
  slug: string;
  reading_time: number | null;
  fiba_rule_reference: string | null;
  category_name: string;
  category_slug: string;
};

export type LearningModuleDetail = LearningModule & {
  content: string;
};

export type LearningModulesResponse = {
  modules: LearningModule[];
};

export type LearningModuleResponse = {
  module: LearningModuleDetail;
};