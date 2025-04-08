
import { Star, StarHalf } from "lucide-react";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface RestaurantReviewsProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

const RestaurantReviews = ({ reviews, averageRating, reviewCount }: RestaurantReviewsProps) => {
  // Format date from ISO string to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-yellow-400 text-yellow-400" size={18} />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-yellow-400 text-yellow-400" size={18} />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300" size={18} />);
    }

    return stars;
  };

  return (
    <div>
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex flex-col items-center md:mr-8">
            <div className="text-4xl font-bold text-gray-800">{averageRating.toFixed(1)}</div>
            <div className="flex mt-2">{renderStars(averageRating)}</div>
            <div className="text-sm text-gray-600 mt-1">{reviewCount} reviews</div>
          </div>
          
          <div className="flex-1 mt-6 md:mt-0">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                // Calculate percentage of reviews with this rating
                const count = reviews.filter((r) => Math.floor(r.rating) === star).length;
                const percentage = (count / reviews.length) * 100 || 0;
                
                return (
                  <div key={star} className="flex items-center">
                    <div className="w-12 text-sm text-right mr-2">{star} stars</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-xs text-left ml-2">{Math.round(percentage)}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 text-gray-800">Customer Reviews</h2>
      
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{review.userName}</h3>
              <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
            </div>
            
            <div className="flex mt-1">{renderStars(review.rating)}</div>
            
            <p className="mt-2 text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantReviews;
