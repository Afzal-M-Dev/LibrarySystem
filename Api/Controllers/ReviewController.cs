using LibraryManagement.Service.ReviewService;
using LibraryManagement.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ReviewController : ControllerBase
	{
		private readonly IReviewService _reviewService;
        public ReviewController(IReviewService reviewService)
        {
			_reviewService = reviewService;   
        }

		[Authorize(Roles = "Customer")]
		[HttpPost("AddReview")]
		public async Task<IActionResult> AddReview(ReviewViewModel review)
		{
			var response = await _reviewService.AddReview(review);
			return Ok(response);
		}

		[Authorize(Roles = "Customer")]
		[HttpDelete("DeleteReview")]
		public async Task<IActionResult> DeleteReview(string reviewId)
		{
			var response = await _reviewService.DeleteReview(reviewId);
			return Ok(response);
		}

		[HttpGet("GetReviewsByBookId")]
		public async Task<IActionResult> GetReviewsByBookId(string bookId)
		{
			var response = await _reviewService.GetReviewsByBookId(bookId);
			return Ok(response);
		}


	}
}
