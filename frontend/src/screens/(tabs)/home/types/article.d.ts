export interface Article {
    id: string;
    title: string;
    imageUrl: [string];
    latestUpdateDate: string;
    author: string;
    summary: string;
    category: string;
}

export interface ArticleDetail extends Article {
    content: string;
}

export interface ArticleCategory {
    id: string;
    name: string;
}