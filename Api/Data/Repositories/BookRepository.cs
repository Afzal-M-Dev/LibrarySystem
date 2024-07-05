using LibraryManagement.Entities;
using LibraryManagement.Utils;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace LibraryManagement.Data.Repositories
{
	public interface IBookRepository
	{
		Task<Book> GetByIdAsync(string id);
		Task<bool> AddAsync(Book book);
		Task<int> CountAsync(Expression<Func<Book, bool>> predicate);
		Task<bool> UpdateAsync(Book book);
		Task<bool> DeleteAsync(Book book);
		Task<IEnumerable<Book>> GetAllAsync();
		Task<int> GetTotalBooksAsync();

	}
	public class BookRepository : IBookRepository
	{
		private readonly AppDbContext _context;

		public BookRepository(AppDbContext context)
		{
			_context = context;
		}

		public async Task<Book> GetByIdAsync(string id)
		{
			return await _context.Books.FindAsync(id);
		}

		public async Task<bool> AddAsync(Book book)
		{
			try
			{
				await _context.Books.AddAsync(book);
				await _context.SaveChangesAsync();
				return true;
			}
			catch (Exception)
			{
				return false;
			}
		}

		public async Task<bool> UpdateAsync(Book book)
		{
			try
			{
				_context.Books.Update(book);
				await _context.SaveChangesAsync();
				return true;
			}
			catch (Exception)
			{
				return false;
			}
		}

		public async Task<bool> DeleteAsync(Book book)
		{
			try
			{
				_context.Books.Remove(book);
				await _context.SaveChangesAsync();
				return true;
			}
			catch (Exception)
			{
				return false;
			}
		}

		public async Task<IEnumerable<Book>> GetAllAsync()
		{
			return await _context.Books.ToListAsync();
		}

		public async Task<int> GetTotalBooksAsync()
		{
			return await _context.Books.CountAsync();
		}

		public async Task<int> CountAsync(Expression<Func<Book, bool>> predicate)
		{
			return await _context.Books.CountAsync(predicate);
		}
	}
}
