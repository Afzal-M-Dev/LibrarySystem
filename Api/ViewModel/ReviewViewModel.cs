namespace LibraryManagement.ViewModel
{
	public class ReviewViewModel
	{
		public string? BookId { get; set; }
		public string? UserId { get; set; }
		public int? Rating { get; set; }
		public string? ReviewText { get; set; }
	}

	public class BookRatingViewModel
	{
		public string? Id { get; set; }
		public string? BookId { get; set; }
		public string? UserId { get; set; }
		public string? UserName { get; set; }
		public int? Rating { get; set; }
		public string? Text { get; set; }
		public string? CreatedAt { get; set; }
	}

}
