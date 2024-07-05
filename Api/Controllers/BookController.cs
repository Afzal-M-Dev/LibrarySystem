using LibraryManagement.Service.BookService;
using LibraryManagement.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class BookController : ControllerBase
	{
		private readonly IBookService _bookService;
        public BookController(IBookService bookService)
        { 
			_bookService = bookService;
        }

		[HttpGet("GetBookById")]
		public async Task<IActionResult> GetBookById(string bookId)
		{
			var baseUri = $"{Request.Scheme}://{Request.Host}";
			var response = await _bookService.GetBookById(baseUri, bookId);
			return Ok(response);
		}

		[Authorize(Roles = "Librarian")]
		[HttpPost("AddBook")]
		public async Task<IActionResult> AddBook([FromForm] AddBookViewModel bookViewModel)
		{
			var response = await _bookService.AddBook(bookViewModel);
			return Ok(response);
		}

		[Authorize(Roles = "Librarian")]
		[HttpPut("UpdateBook")]
		public async Task<IActionResult> UpdateBook([FromForm] AddBookViewModel bookViewModel)
		{
			var response = await _bookService.UpdateBook(bookViewModel);
			return Ok(response);
		}

		[Authorize(Roles = "Librarian")]
		[HttpDelete("DeleteBook")]
		public async Task<IActionResult> DeleteBook(string bookId)
		{
			var response = await _bookService.DeleteBook(bookId);
			return Ok(response);
		}

		[Authorize(Roles = "Librarian")]
		[HttpGet("DashboardBookCountsForLibrarian")]
		public async Task<IActionResult> GetDashboardBookCountsForLibrarian()
		{
			var response = await _bookService.GetBookCountsForLibrarian();
			return Ok(response);
		}

		[Authorize(Roles = "Customer")]
		[HttpGet("DashboardBookCountsForCustomer")]
		public async Task<IActionResult> GetDashboardBookCountsForCustomer(string customerId)
		{
			var response = await _bookService.GetBookCountsForCustomer(customerId);
			return Ok(response);
		}

		[HttpPost]
		[Route("BookDataTable")]
		public async Task<IActionResult> BookDataTable(int start = 0, int length = 10, string? sortColumnName = "", string? sortDirection = "", string? searchValue = "")
		{
			var baseUri = $"{Request.Scheme}://{Request.Host}";
			var response = await _bookService.BookDataTable(start, length, sortColumnName, sortDirection, searchValue, baseUri);
			return Ok(response);
		}

		[HttpPost]
		[Route("CheckOutBookDataTable")]
		public async Task<IActionResult> CheckOutBookDataTable(int start = 0, int length = 10, string? sortColumnName = "", string? sortDirection = "", string? searchValue = "", string? customerId = "")
		{
			var baseUri = $"{Request.Scheme}://{Request.Host}";
			var response = await _bookService.CheckOutBookDataTable(start, length, sortColumnName, sortDirection, searchValue, baseUri, customerId);
			return Ok(response);
		}

		[HttpPost("BookCheckOut")]
		public async Task<IActionResult> BookCheckOut(string bookId, string userId)
		{
			var response = await _bookService.CheckOutBook(bookId, userId);
			return Ok(response);
		}

		[HttpPost("BookReturned")]
		public async Task<IActionResult> BookReturned(string bookId, string userId)
		{
			var response = await _bookService.ReturnBook(bookId, userId);
			return Ok(response);
		}


	}
}
