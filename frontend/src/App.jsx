import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import NewsList from "./components/NewsList";
import { useDebounce } from "./hooks/useDebounce";
import ErrorBoundary from "./components/ErrorBoundary";
import { SearchFallback, NewsListFallback } from "./utils/errorFallbackUIs";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1500);
  return (
    <>
      <Header />
      <ErrorBoundary fallbackUI={<SearchFallback />}>
        <SearchBar onSearch={setSearchQuery} />
      </ErrorBoundary>
      <ErrorBoundary fallbackUI={<NewsListFallback />}>
        <NewsList searchQuery={debouncedSearchQuery} />
      </ErrorBoundary>
    </>
  );
}

export default App;
