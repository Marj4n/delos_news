import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import {
  getSelectedArticle as getSelectedArticleFromStorage,
  setSelectedArticle as setSelectedArticleInStorage,
} from "@/lib/utils";
import { ApiResponseType } from "@/types/api";

interface ArticleContextType {
  article: ApiResponseType | null;
  setArticle: (article: ApiResponseType | null) => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider = ({ children }: { children: ReactNode }) => {
  const [article, setArticle] = useState<ApiResponseType | null>(null);

  useEffect(() => {
    const selectedArticle = getSelectedArticleFromStorage();
    setArticle(selectedArticle);
  }, []);

  const updateArticle = (newArticle: ApiResponseType | null) => {
    setArticle(newArticle);
    setSelectedArticleInStorage(newArticle!!);
  };

  return (
    <ArticleContext.Provider value={{ article, setArticle: updateArticle }}>
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticle = (): ArticleContextType => {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error("useArticle must be used within an ArticleProvider");
  }
  return context;
};
