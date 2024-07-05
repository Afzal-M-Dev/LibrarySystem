using LibraryManagement.Utils;
using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.ViewModel
{
	public class RegisterViewModel
	{
		public string? FirstName { get; set; }
		public string? LastName { get; set;}

		[Required]
		public string Username { get; set; }
		public string? Email { get; set; }

		[Required]
		public string Password { get; set; }

		[Required]
		public Role Role { get; set; }
		public string? Address { get; set; }
		public string? Contact { get; set; }
	}
}
