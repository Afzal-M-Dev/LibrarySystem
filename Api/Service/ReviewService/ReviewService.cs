using LibraryManagement.Data.Repositories;
using LibraryManagement.Entities;
using LibraryManagement.ExceptionFilter;
using LibraryManagement.Migrations;
using LibraryManagement.ViewModel;
using Microsoft.AspNetCore.Identity;

namespace LibraryManagement.Service.ReviewService
{
	public class ReviewService : IReviewService
	{
		private readonly IReviewRepository _reviewRepo;
		private readonly UserManager<AppUser> _userManager;
		public ReviewService(IReviewRepository reviewRepo, UserManager<AppUser> userManager)
        {
            _reviewRepo = reviewRepo;
			_userManager = userManager;
        }

        public async Task<ResponseViewModel> AddReview(ReviewViewModel model)
        {
			try
			{
				var existingReview = await _reviewRepo.GetByBookAndUserAsync(model.BookId, model.UserId);
				if (existingReview != null)
				{
					throw new CustomException("You have already reviewd this book");
				}

				var review = new Review
				{
					BookId = model.BookId,
					UserId = model.UserId,
					Rating = model.Rating,
					ReviewText = model.ReviewText,
					Id = Guid.NewGuid().ToString(),
					CreatedAt = DateTime.Now,
					IsActive = true,
				};

				bool isReviewInserted = await _reviewRepo.AddAsync(review);
				if (isReviewInserted)
				{
					return new ResponseViewModel { IsSuccess = true, Message = "Review added successfully." };
				}
				throw new CustomException("Failed to add review.");
			}
			catch(Exception ex)
			{
				throw new CustomException($"Error: {ex.Message}");
			}
			
        }
		public async Task<ResponseViewModel> DeleteReview(string reviewId)
		{
			try
			{
				var reviewToDelete = await _reviewRepo.GetByIdAsync(reviewId);
				if (reviewToDelete == null)
				{
					throw new CustomException("Review not found.");
				}

				var success = await _reviewRepo.DeleteAsync(reviewToDelete);
				if (success)
				{
					return new ResponseViewModel { IsSuccess = true, Message = "Review deleted successfully." };
				}
				else
				{
					throw new CustomException("Failed to delete the review");
				}
			}
			catch (Exception ex)
			{
				throw new CustomException($"Error: {ex.Message}");
			}
		}
		public async Task<ResponseViewModel> GetReviewsByBookId(string bookId)
		{
			try
			{
				var reviews = await _reviewRepo.GetReviewsByBookIdAsync(bookId);
				reviews  = reviews.OrderByDescending(review => review.CreatedAt).ToList();
				var viewModels = new List<BookRatingViewModel>();

				foreach (var review in reviews)
				{
					var user = await _userManager.FindByIdAsync(review.UserId);
					var viewModel = new BookRatingViewModel
					{
						Id = review.Id,
						BookId = review.BookId,
						UserId = review.UserId,
						UserName = user != null ? $"{user.FirstName} {user.LastName}" : "",
						Rating = review.Rating,
						Text = review.ReviewText,
						CreatedAt = review.CreatedAt.Value.ToString("yyyy-MM-dd HH:mm")
					};

					viewModels.Add(viewModel);
				}

				return new ResponseViewModel
				{
					IsSuccess = true,
					StatusCode = 200,
					Message = "Reviews retrieved successfully.",
					Data = viewModels
				};
			}
			catch(Exception ex)
			{
				throw new CustomException($"Error: {ex.Message}");
			}
		}

	}
}
