export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="bg-gray-300 h-48 w-full"></div>
      <div className="p-6">
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>
        <div className="h-10 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  );
}