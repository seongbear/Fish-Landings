import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { Article, ArticleCategory, ArticleDetail } from "../screens/(tabs)/home/types/article";

// Fetch a list of articles from Firestore
export const fetchArticleList = async (): Promise<Article[]> => {
    try{
        // Reference the 'articles' collection
        const querySnapshot = await getDocs(collection(firestore, "article"));
        
        // Map the documents to your Article type
        const articles: Article[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                imageUrl: data.imageUrl,
                author: data.author,
                latestUpdateDate: data.latestUpdateDate, // Ensure you handle Timestamp conversion if needed
                summary: data.summary,
                category: data.category,
            } as Article;
       });
        return articles
    }
    catch (error) {
        console.error("Error fetching articles: ", error);
        return [];
    }
}

// Fetch article details by ID from Firestore
export const fetchArticleById = async (articleId: string): Promise<ArticleDetail> => {
    try {
        const docRef = doc(firestore, "article", articleId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                title: data.title,
                imageUrl: data.imageUrl,
                author: data.author,
                latestUpdateDate: data.latestUpdateDate, // Ensure you handle Timestamp conversion if needed
                summary: data.summary,
                category: data.category,
                content: data.content,
            } as ArticleDetail;
        } else {
            throw new Error("Article not found");
        }
    } catch (error) {
        console.error("Error fetching article: ", error);
        throw error;
    }
}

// Fetch article categories from Firestore
export const fetchArticleCategories = async (): Promise<ArticleCategory[]> => {
    try {
        const querySnapshot = await getDocs(collection(firestore, "article_category"));   
        const categories: ArticleCategory[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
            } as ArticleCategory;
       });
        return categories;
    } catch (error) {
        console.error("Error fetching categories: ", error);
        return [];
    }
}