export default function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
      {/* Body */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-32"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
}