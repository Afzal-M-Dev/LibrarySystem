using LibraryManagement.ViewModel;

namespace LibraryManagement.Service.ReviewService
{
	public interface IReviewService
	{
		Task<ResponseViewModel> AddReview(ReviewViewModel model);
		Task<ResponseViewModel> DeleteReview(string reviewId);
		Task<ResponseViewModel> GetReviewsByBookId(string bookId);
	}
}
