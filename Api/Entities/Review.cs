namespace LibraryManagement.Entities
{
	public class Review : BaseEntity
	{
		public string? Id { get; set; }
		public string? BookId { get; set; }
		public string? UserId { get; set; }
		public int? Rating { get; set; } 
		public string? ReviewText { get; set; }
	}

}
