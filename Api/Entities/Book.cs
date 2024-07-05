using LibraryManagement.Utils;

namespace LibraryManagement.Entities
{
	public class Book : BaseEntity
	{
		public string? Id { get; set; }
		public string? Title { get; set; }
		public string? Author { get; set; }
		public string? Description { get; set; }
		public string? CoverImage { get; set; }
		public string? Publisher { get; set; }
		public DateTime? PublicationDate { get; set; }
		public string? Category { get; set; }
		public string? ISBN { get; set; }
		public int? PageCount { get; set; }
		public BookStatus Status { get; set; }
		public string? UserId { get; set; }
		public DateTime? CheckoutDate { get; set; }
		public DateTime? DueDate { get; set; }
	}

}
