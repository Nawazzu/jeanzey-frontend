import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonProductPage = () => {
  return (
    <div className="bg-white text-gray-900 min-h-screen border-t border-gray-200 px-4 md:px-10 lg:px-16 py-16">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Image Section Skeleton */}
        <div className="flex-1 flex flex-col-reverse gap-4 sm:flex-row relative">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 sm:w-[18%]">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton 
                key={i} 
                height={130} 
                width="100%" 
                borderRadius={12}
                baseColor="#f3f4f6" 
                highlightColor="#e5e7eb"
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="w-full sm:w-[80%]">
            <Skeleton 
              height={700} 
              borderRadius={16}
              baseColor="#f3f4f6" 
              highlightColor="#e5e7eb"
            />
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="flex-1 space-y-8">
          {/* Title */}
          <Skeleton 
            height={40} 
            width="80%"
            baseColor="#f3f4f6" 
            highlightColor="#e5e7eb"
          />

          {/* Rating */}
          <Skeleton 
            height={16} 
            width="30%"
            baseColor="#f3f4f6" 
            highlightColor="#e5e7eb"
          />

          {/* Price */}
          <Skeleton 
            height={36} 
            width="25%"
            baseColor="#f3f4f6" 
            highlightColor="#e5e7eb"
          />

          {/* Description */}
          <div className="space-y-2">
            <Skeleton 
              height={14} 
              count={3}
              baseColor="#f3f4f6" 
              highlightColor="#e5e7eb"
            />
          </div>

          {/* Size Buttons */}
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton 
                key={i} 
                height={40} 
                width={60}
                borderRadius={8}
                baseColor="#f3f4f6" 
                highlightColor="#e5e7eb"
              />
            ))}
          </div>

          {/* Add to Cart Button */}
          <Skeleton 
            height={48} 
            width={180}
            borderRadius={6}
            baseColor="#f3f4f6" 
            highlightColor="#e5e7eb"
          />
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductPage;