using LibraryManagement.Utils;

namespace LibraryManagement.ViewModel
{
	public class AddBookViewModel
	{
		public string? Id { get; set; }
		public string? Title { get; set; }
		public string? Author { get; set; }
		public string? Description { get; set; }
		public IFormFile? CoverImage { get; set; }
		public string? Publisher { get; set; }
		public DateTime? PublicationDate { get; set; }
		public string? Category { get; set; }
		public string? ISBN { get; set; }
		public int? PageCount { get; set; }
	}

	public class BookViewModel
	{
		public string? Id { get; set; }
		public string? Title { get; set; }
		public string? Author { get; set; }
		public string? Description { get; set; }
		public string? CoverImage { get; set; }
		public string? Publisher { get; set; }
		public string? PublicationDate { get; set; }
		public string? Category { get; set; }
		public string? ISBN { get; set; }
		public int? PageCount { get; set; }
		public BookStatus? Status { get; set; }
		public string? UserId { get; set; }
		public string? CheckOutDate { get; set; }
		public string? DueDate { get; set; }
	}

	public class BookDataTableView
	{
		public string? Id { get; set; }
		public string? Title { get; set; }
		public string? Author { get; set; }
		public string? CoverImage { get; set; }
		public BookStatus? Status { get; set; }
	}

	public class CheckOutBooks
	{
		public string? Id { get; set; }
		public string? Title { get; set; }
		public string? Author { get; set; }
		public string? CoverImage { get; set; }
		public string? UserId { get; set; }
		public string? UserName { get; set; }
		public string? CheckOutDate { get; set; }
		public string? DueDate { get; set; }
		public bool? isLate { get; set; }
	}
}
