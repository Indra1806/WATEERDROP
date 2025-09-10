export default function FeatureCardSkeleton() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}