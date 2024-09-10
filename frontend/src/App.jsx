import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import NewsList from "./components/NewsList";
import ErrorBoundary from "./components/ErrorBoundary";
import { SearchFallback, NewsListFallback } from "./utils/errorFallbackUIs";
import NewsForm from "./components/NewsForm";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const handleQueryChange = (queryObj) => {
    let searchParams = new URLSearchParams();

    if (queryObj.searchTerm) searchParams.append("q", queryObj.searchTerm);
    if (queryObj.language) searchParams.append("lang", queryObj.language);
    if (queryObj.country) searchParams.append("country", queryObj.country);

    let fullQueryURL = searchParams.toString()
      ? `?${searchParams.toString()}`
      : "";
    //`${API_BASE_URL}/api/search?q=${searchQuery}`
    setSearchQuery(fullQueryURL);
  };

  return (
    <>
      <Header />
      <ErrorBoundary fallbackUI={<SearchFallback />}>
        <NewsForm handleQueryChange={handleQueryChange} />
      </ErrorBoundary>
      <ErrorBoundary fallbackUI={<NewsListFallback />}>
        <NewsList searchQuery={searchQuery} />
      </ErrorBoundary>
    </>
  );
}

export default App;
