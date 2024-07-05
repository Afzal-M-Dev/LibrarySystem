using LibraryManagement.Data.Repositories;
using LibraryManagement.Entities;
using LibraryManagement.ExceptionFilter;
using LibraryManagement.Migrations;
using LibraryManagement.Utils;
using LibraryManagement.ViewModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Service.BookService
{
	public class BookService : IBookService
	{
		private readonly IBookRepository _bookRepo;
		private readonly UserManager<AppUser> _userManager;
		public BookService(IBookRepository bookRepo, UserManager<AppUser> userManager)
        {
            _bookRepo = bookRepo;
			_userManager = userManager;
        }

		public async Task<ResponseViewModel> AddBook(AddBookViewModel bookViewModel)
		{
			await CheckForDuplicateBookAsync(bookViewModel);
			var book = new Book
			{
				Id = Guid.NewGuid().ToString(),
				Title = bookViewModel.Title,
				Author = bookViewModel.Author,
				Description = bookViewModel.Description,
				Publisher = bookViewModel.Publisher,
				PublicationDate = bookViewModel.PublicationDate,
				Category = bookViewModel.Category,
				ISBN = bookViewModel.ISBN,
				PageCount = bookViewModel.PageCount,
				IsActive = true,
				CreatedAt = DateTime.Now,
				Status = BookStatus.Available,
			};

			if (bookViewModel.CoverImage != null)
			{
				book.CoverImage = await ProcessAndSaveImage(bookViewModel.CoverImage);
			}

			var success = await _bookRepo.AddAsync(book);
			if (success)
			{
				return new ResponseViewModel { IsSuccess = true, Message = "Book added successfully.", Data = book.Id };
			}
			else
			{
				throw new CustomException("Failed to add book.");
			}
		}
		public async Task<ResponseViewModel> UpdateBook(AddBookViewModel bookDTO)
		{
			try
			{
				var existingBook = await _bookRepo.GetByIdAsync(bookDTO.Id);
				if (existingBook == null)
				{
					throw new CustomException("Book not found.");
				}
				await CheckForDuplicateBookAsync(bookDTO, bookDTO.Id);

				// Update properties based on DTO values
				existingBook.Title = bookDTO.Title;
				existingBook.Author = bookDTO.Author;
				existingBook.Description = bookDTO.Description;
				existingBook.Publisher = bookDTO.Publisher;
				existingBook.PublicationDate = bookDTO.PublicationDate;
				existingBook.Category = bookDTO.Category;
				existingBook.ISBN = bookDTO.ISBN;
				existingBook.PageCount = bookDTO.PageCount;

				// Update cover image if provided
				if (bookDTO.CoverImage != null)
				{
					existingBook.CoverImage = await ProcessAndSaveImage(bookDTO.CoverImage);
				}

				// Save changes
				var success = await _bookRepo.UpdateAsync(existingBook);
				if (success)
				{
					return new ResponseViewModel { IsSuccess = true, Message = "Book updated successfully." };
				}
				else
				{
					throw new CustomException("Failed to update book.");
				}
			}
			catch (Exception ex)
			{
				throw new CustomException($"Error: {ex.Message}");
			}
		}
		public async Task<ResponseViewModel> DeleteBook(string bookId)
		{
			try
			{
				var bookToDelete = await _bookRepo.GetByIdAsync(bookId);
				if (bookToDelete == null)
				{
					throw new CustomException("Book not found.");
				}

				var success = await _bookRepo.DeleteAsync(bookToDelete);
				if (success)
				{
					return new ResponseViewModel { IsSuccess = true, Message = "Book deleted successfully." };
				}
				else
				{
					throw new CustomException("Failed to delete book.");
				}
			}
			catch (Exception ex)
			{
				throw new CustomException($"Error: {ex.Message}");
			}
		}
		public async Task<ResponseViewModel> GetBookById(string baseUri, string id)
		{
			var bookObj = await _bookRepo.GetByIdAsync(id);
			if (bookObj == null)
			{
				throw new CustomException("Book not Found");
			}
			var bookViewModel = new BookViewModel
			{
				Id = bookObj.Id,
				Title = bookObj.Title,
				Author = bookObj.Author,
				PageCount = bookObj.PageCount,
				PublicationDate = bookObj.PublicationDate.Value.ToString("yyyy-MM-dd"),
				Publisher = bookObj.Publisher,
				Status = bookObj.Status,
				ISBN = bookObj.ISBN,
				CoverImage = $"{baseUri}/covers/{bookObj.CoverImage}",
				Description = bookObj.Description,
				Category = bookObj.Category,
				UserId = bookObj.UserId,
				CheckOutDate = bookObj.CheckoutDate.HasValue ? bookObj.CheckoutDate.Value.ToString("yyyy-MM-dd") : null,
				DueDate = bookObj.DueDate.HasValue ? bookObj.DueDate.Value.ToString("yyyy-MM-dd") : null,
			};
			return new ResponseViewModel { IsSuccess = true, Message = "Book Found Successfully", Data = bookViewModel };
		}
		public async Task<ResponseViewModel> BookDataTable(int start = 0, int length = 10, string? sortColumnName = "", string? sortDirection = "", string? searchValue = "", string baseuri = "")
		{
			try
			{ 
			    var booksObj = await _bookRepo.GetAllAsync();
				if (!string.IsNullOrEmpty(sortColumnName) && sortColumnName != "0")
				{
					if (sortDirection == "asc")
					{
						booksObj = booksObj.OrderByDescending(x => x.GetType().GetProperty(sortColumnName)?.GetValue(x)).ToList();
					}
					else
					{
						booksObj = booksObj.OrderBy(x => x.GetType().GetProperty(sortColumnName)?.GetValue(x)).ToList();
					}
				}
				else
				{
					booksObj = booksObj.OrderByDescending(x => x.CreatedAt).ToList();
				}

				// Filtering
				if (!string.IsNullOrEmpty(searchValue))
				{
					booksObj = booksObj.Where(x =>
						x.Title.ToLower().Contains(searchValue.ToLower()) ||
						x.Author.ToLower().Contains(searchValue.ToLower()));
				}

				int totalRecords = booksObj.Count();

				// Pagination
				if (length != -1)
				{
					booksObj = booksObj.Skip(start * length).Take(length);
				}

				int totalRecordsAfterFiltering = booksObj.Count();
				var bookViewModels = booksObj.Select(book => new BookDataTableView
				{
					Id = book.Id,
					Title = book.Title,
					Author = book.Author,
					Status = book.Status,
					CoverImage = $"{baseuri}/covers/{book.CoverImage}" ,
																	   
				}).ToList();

				return new ResponseViewModel { IsSuccess = true, StatusCode = 200, Message = "Records found.", Data = new { list = bookViewModels, totalRecords = totalRecords, recordsFiltered = totalRecordsAfterFiltering } };
			}
			catch (Exception ex)
			{
				return new ResponseViewModel { IsSuccess = false, StatusCode = 500, Message = $"Error: {ex.Message}" };
			}
		}
		public async Task<ResponseViewModel> CheckOutBookDataTable(int start = 0, int length = 10, string? sortColumnName = "", string? sortDirection = "", string? searchValue = "", string baseuri = "", string? customerId = "")
		{
			try
			{
				var books = await _bookRepo.GetAllAsync();
				var checkedOutBooks = new List<Book>();
				// Filter by checked out books
				if (string.IsNullOrEmpty(customerId))
					checkedOutBooks = books.Where(b => b.UserId != null && b.Status == BookStatus.CheckedOut).ToList();
				else
					checkedOutBooks = books.Where(b => b.UserId == customerId && b.Status == BookStatus.CheckedOut).ToList();
				if (!string.IsNullOrEmpty(sortColumnName) && sortColumnName != "0")
				{
					if (sortDirection == "asc")
					{
						checkedOutBooks = checkedOutBooks.OrderByDescending(x => x.GetType().GetProperty(sortColumnName)?.GetValue(x)).ToList();
					}
					else
					{
						checkedOutBooks = checkedOutBooks.OrderBy(x => x.GetType().GetProperty(sortColumnName)?.GetValue(x)).ToList();
					}
				}
				// Filtering
				if (!string.IsNullOrEmpty(searchValue))
				{
					checkedOutBooks = checkedOutBooks.Where(x =>
						x.Title.ToLower().Contains(searchValue.ToLower()) ||
						x.Author.ToLower().Contains(searchValue.ToLower())) // Assuming UserId is stored for tracking
						.ToList();
				}
				int totalRecords = checkedOutBooks.Count();
				// Pagination
				if (length != -1)
				{
					checkedOutBooks = checkedOutBooks.Skip(start * length).Take(length).ToList();
				}
				int totalRecordsAfterFiltering = checkedOutBooks.Count();
				var checkOutBookViewModels = new List<CheckOutBooks>();
				foreach (var book in checkedOutBooks)
				{
					var user = await _userManager.FindByIdAsync(book.UserId);
					var userName = user != null ? $"{user.FirstName} {user.LastName}" : "Unknown User";

					checkOutBookViewModels.Add(new CheckOutBooks
					{
						Id = book.Id,
						Title = book.Title,
						Author = book.Author,
						CoverImage = $"{baseuri}/covers/{book.CoverImage}",
						UserName = userName,
						UserId = book.UserId,
						CheckOutDate = book.CheckoutDate.HasValue ? book.CheckoutDate.Value.ToString("yyyy-MM-dd") : null,
						DueDate = book.DueDate.HasValue ? book.DueDate.Value.ToString("yyyy-MM-dd") : null,
						isLate = book.DueDate.HasValue && DateTime.Now > book.DueDate.Value
					});
				}
				return new ResponseViewModel { IsSuccess = true, StatusCode = 200, Message = "Records found.", Data = new { list = checkOutBookViewModels, totalRecords = totalRecords, recordsFiltered = totalRecordsAfterFiltering } };
			}
			catch (Exception ex)
			{
				return new ResponseViewModel { IsSuccess = false, StatusCode = 500, Message = $"Error: {ex.Message}" };
			}
		}
		private async Task CheckForDuplicateBookAsync(AddBookViewModel bookViewModel, string currentBookId = null)
		{
			var existingBooks = await _bookRepo.GetAllAsync();

			// Exclude the current book if updating
			var booksToCheck = string.IsNullOrEmpty(currentBookId)
				? existingBooks
				: existingBooks.Where(b => b.Id != currentBookId);

			// Check for duplicate Title
			if (booksToCheck.Any(b => b.Title == bookViewModel.Title))
			{
				throw new CustomException("A book with the same Title already exists.");
			}

			// Check for duplicate ISBN
			if (booksToCheck.Any(b => b.ISBN == bookViewModel.ISBN))
			{
				throw new CustomException("A book with the same ISBN already exists.");
			}
		}


		//For Laibrarian
		public async Task<ResponseViewModel> GetBookCountsForLibrarian()
		{
			try
			{
				int totalBooks = await _bookRepo.CountAsync(x => x.IsActive == true);
				int checkedOutBooks = await _bookRepo.CountAsync(x=>x.IsActive == true && x.Status == BookStatus.CheckedOut);
				return new ResponseViewModel {	IsSuccess = true, StatusCode = 200,	Message = "Book counts retrieved successfully.", Data = new { TotalBooks = totalBooks, CheckedOutBooks = checkedOutBooks } };
			}
			catch (Exception ex)
			{
				throw new CustomException($"Error: {ex.Message}");
			}
		}

		//For Customer 
		public async Task<ResponseViewModel> GetBookCountsForCustomer(string customerId)
		{
			try
			{
				int availableBooks = await _bookRepo.CountAsync(b => b.Status == BookStatus.Available);
				int checkedBooksByMe = await _bookRepo.CountAsync(b => b.UserId == customerId && b.Status == BookStatus.CheckedOut);
				return new ResponseViewModel { IsSuccess = true, StatusCode = 200, Message = "Book counts retrieved successfully.", Data = new { checkedBooksByMe = checkedBooksByMe, availableBooks = availableBooks } };
			}
			catch (Exception ex)
			{
				throw new CustomException($"Error: {ex.Message}");
			}
		}
		public async Task<ResponseViewModel> CheckOutBook(string bookId, string userId)
		{
			try
			{
				var bookObj = await _bookRepo.GetByIdAsync(bookId);
				if (bookObj == null)
				{
					throw new CustomException("Book Not Found");
				}

				// Check if the book is already checked out or not available
				if (!string.IsNullOrEmpty(bookObj.UserId) || bookObj.Status != BookStatus.Available)
				{
					throw new CustomException("Failed to check out book. It is already checked out or not available.");
				}

				// Update book properties for checkout
				bookObj.UserId = userId;
				bookObj.CheckoutDate = DateTime.Now;
				bookObj.DueDate = DateTime.Now.AddDays(5);
				bookObj.Status = BookStatus.CheckedOut;

				// Save changes to the database
				var success = await _bookRepo.UpdateAsync(bookObj);
				if (success)
				{
					return new ResponseViewModel { IsSuccess = true, StatusCode = 200, Message = "Book checked out successfully." };
				}

				throw new CustomException("Something went wrong while updating the book.");
			}
			catch (Exception ex)
			{
				throw new CustomException($"Error: {ex.Message}");
			}
		}
		public async Task<ResponseViewModel> ReturnBook(string bookId, string userId)
		{
			try
			{
				var bookObj = await _bookRepo.GetByIdAsync(bookId);
				if (bookObj == null)
				{
					throw new CustomException("Book Not Found");
				}

				// Check if the book is currently checked out by the provided userId
				if (bookObj.UserId != userId || bookObj.Status != BookStatus.CheckedOut)
				{
					throw new CustomException("Failed to return book. It is either not checked out or checked out by another user.");
				}

				// Update book status and clear checkout details
				bookObj.Status = BookStatus.Available;
				bookObj.UserId = null;
				bookObj.CheckoutDate = null;
				bookObj.DueDate = null;

				// Save changes to the database
				var success = await _bookRepo.UpdateAsync(bookObj);
				if (success)
				{
					return new ResponseViewModel { IsSuccess = true, StatusCode = 200, Message = "Book returned successfully." };
				}

				throw new CustomException("Something went wrong while updating the book.");
			}
			catch (Exception ex)
			{
				throw new CustomException($"Error: {ex.Message}");
			}
		}

		#region File Directory
		public void CreateDirectory(string path)
		{
			var rootDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
			var dir = Path.Combine(rootDir, path);

			if (!Directory.Exists(dir))
			{
				Directory.CreateDirectory(dir);
			}
		}
		private async Task<string> ProcessAndSaveImage(IFormFile imageFile)
		{
			if (!imageFile.ContentType.StartsWith("image/"))
			{
				throw new CustomException("Only images are allowed.");
			}

			string imgName = "cover_" + DateTimeOffset.UtcNow.Ticks + Path.GetExtension(imageFile.FileName);
			string fileDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/covers", imgName);

			CreateDirectory("covers");
			using (var stream = new FileStream(fileDir, FileMode.Create))
			{
				await imageFile.CopyToAsync(stream);
			}

			return imgName;
		}

		#endregion

	}
}
