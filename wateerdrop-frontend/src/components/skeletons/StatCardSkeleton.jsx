export default function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center animate-pulse">
      <div className="p-4 rounded-full bg-gray-200 mr-4">
        <div className="h-8 w-8"></div>
      </div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
}