import { formatDate } from "../utils/formatDate";
import { useState } from "react";

const ImageWithFallback = ({ src, fallbackSrc, alt, className }) => {
  const [imageSrc, setImageSrc] = useState(src);

  const handleError = () => {
    setImageSrc(fallbackSrc);
  };

  return (
    <img src={imageSrc} alt={alt} onError={handleError} className={className} />
  );
};

export default function NewsCard({ article }) {
  return (
    <div className="bg-white shadow-md rounded-lg flex flex-col">
      <ImageWithFallback
        src={article.image}
        fallbackSrc="https://picsum.photos/300"
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold mb-2">{article.title}</h2>
        <p className="text-gray-600 text-sm mb-2">{article.description}</p>
        <p className="text-gray-600 text-sm mb-4 flex-grow">
          {article.content}
        </p>
        <div className="mt-auto">
          <p className="text-gray-600 text-sm mb-1 font-bold">
            Published on {formatDate(article.publishedAt)}
          </p>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Read more
          </a>
        </div>
      </div>
    </div>
  );
}
