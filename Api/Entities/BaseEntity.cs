namespace LibraryManagement.Entities
{
	public class BaseEntity
	{
		public bool? IsActive { get; set; }
		public DateTime? CreatedAt { get; set; }
		public DateTime? UpdatedAt { get; set; }
		public DateTime? DeletedAt { get; set; }
	}
}
