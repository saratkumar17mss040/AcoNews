import { useEffect, useState, memo } from "react";
import NewsCard from "./NewsCard";
import Pagination from "./Pagination";
import useScrollToTop from "../hooks/useScrollToTop";
// import { delay } from "../utils/formatDate";
import { PaginationFallback } from "../utils/errorFallbackUIs";

// this is how vite imports env vars
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import ErrorBoundary from "./ErrorBoundary";

function NewsList({ searchQuery }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const scrollToTop = useScrollToTop();

  // place to simulate ErrorBoundary of NewsList fallback UI
  // throw new Error("Failed to fetch news");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // await delay(1000);
        let url = "";
        if (currentPage > 0 && !searchQuery) {
          url = `${API_BASE_URL}/api/headlines?page=${currentPage}`;
        } else {
          url = searchQuery
            ? `${API_BASE_URL}/api/search?q=${searchQuery}`
            : `${API_BASE_URL}/api/headlines`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const newsData = await response.json();
        console.log(newsData);
        setNews(newsData.data);
        setTotalPages(newsData.totalPages);
        scrollToTop();
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    console.log("fetching news");
    fetchNews();
  }, [searchQuery, currentPage, scrollToTop]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 text-3xl font-bold">
        Loading news...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-3xl font-bold">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {news.length > 0 ? (
          news.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 text-3xl font-bold">
            No news available.
          </div>
        )}
      </div>
      <ErrorBoundary fallbackUI={<PaginationFallback />}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </ErrorBoundary>
    </div>
  );
}

export default memo(NewsList);
