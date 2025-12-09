import { ArticleDetail } from "../screens/(tabs)/home/types/article";

export type RootStackParamList = {
  MainTabs: undefined;
  KnowledgeCenter: undefined;
  KnowledgeDetail: { article: ArticleDetail};
};