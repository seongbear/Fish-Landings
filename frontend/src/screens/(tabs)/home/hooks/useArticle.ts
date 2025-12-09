// src/hooks/useArticle.ts
import { use, useEffect, useState } from "react";
import { Article, ArticleCategory, ArticleDetail } from "../types/article";
import { fetchArticleById, fetchArticleCategories, fetchArticleList } from "../../../../api/articleApi";

// Custom hook to fetch and manage article list
export function useArticleList(){
    const [articles, setArticles] = useState<Article[]>([]);
    useEffect(() => {
        let isMounted = true; // Prevent state updates on unmounted component

        async function loadArticles() {
            try {
                const response = await fetchArticleList();
                if (isMounted) {
                    setArticles(response);
                }
            } catch (error) {
                console.error("Error loading articles:", error);
            }
        }

        loadArticles();
        return () => {
            isMounted = false;
        }
    }, []);

    return { articles };
}

// Custom hook to fetch and manage a single article by ID
export function useArticleById(articleId: string ){
    const [ArticleDetail, setArticleDetail] = useState<ArticleDetail>();
    useEffect(() => {
        let isMounted = true; 
        async function loadArticleDetail() {
            try {
                const response = await fetchArticleById(articleId);
                if (isMounted) {
                    setArticleDetail(response);
                }
            } catch (error) {
                console.error("Error loading article:", error);
            }
        }

        loadArticleDetail();
        return () => {
            isMounted = false;
        }   
    }, [articleId]);

    return { ArticleDetail };
}

// Custom hook to fetch and manage article categories
export function useArticleCategories(){
    const [categories, setCategories] = useState<ArticleCategory[]>([]);
    useEffect(() => {
        let isMounted = true;
        async function loadCategories() {
            try {
                const response = await fetchArticleCategories();
                if (isMounted) {
                    setCategories(response);
                }   
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        }

        loadCategories();
        return () => {
            isMounted = false;
        }
    }, []);

    return { categories };
}