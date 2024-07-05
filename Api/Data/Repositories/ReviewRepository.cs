using LibraryManagement.Entities;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Data.Repositories
{
	public interface IReviewRepository
	{
		Task<bool> AddAsync(Review review);
		Task<bool> DeleteAsync(Review review);
		Task<Review> GetByIdAsync(string reviewId);
		Task<Review> GetByBookAndUserAsync(string bookId, string userId);
		Task<IEnumerable<Review>> GetReviewsByBookIdAsync(string bookId);
	}
	public class ReviewRepository : IReviewRepository
	{
		private readonly AppDbContext _context;
        public ReviewRepository(AppDbContext context)
        {
			_context = context;
        }

		public async Task<bool> AddAsync(Review review)
		{
			try
			{
				_context.Reviews.Add(review);
				await _context.SaveChangesAsync();
				return true;
			}
			catch
			{
				return false;
			}
		}

		public async Task<bool> DeleteAsync(Review review)
		{
			try
			{
				_context.Reviews.Remove(review);
				await _context.SaveChangesAsync();
				return true;
			}
			catch (Exception)
			{
				return false;
			}
		}

		public async Task<Review> GetByIdAsync(string reviewId)
		{
			return await _context.Reviews.FindAsync(reviewId);
		}
		public async Task<IEnumerable<Review>> GetReviewsByBookIdAsync(string bookId)
		{
			return await _context.Reviews
				.Where(r => r.BookId == bookId)
				.ToListAsync();
		}

		public async Task<Review> GetByBookAndUserAsync(string bookId, string userId)
		{
			return await _context.Reviews
				.FirstOrDefaultAsync(r => r.BookId == bookId && r.UserId == userId);
		}

	}
}
