using Microsoft.AspNetCore.Identity;

namespace LibraryManagement.Entities
{
	public class AppUser : IdentityUser
	{
		public bool? IsActive { get; set; }
		public DateTime? CreatedAt { get; set; }
		public DateTime? UpdatedAt { get; set; }
		public DateTime? DeletedAt { get; set; }
		public string? Address { get; set; }
		public string? FirstName { get; set; }
		public string? LastName { get; set; }
	}
}
