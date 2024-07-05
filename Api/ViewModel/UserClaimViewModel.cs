using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.ViewModel
{
	public class UserClaimViewModel
	{
		public string? Id { get; set; }
		public string? Name { get; set; }
		public string? Email { get; set; }
		public string? Contact { get; set; }
		public string? Address { get; set; }
		public string? Role { get; set; }
		public string? Token { get; set; }
		public string? FirstName { get; set; }
		public string? LastName { get; set; }
		public string? TokenExpiry { get; set; }
	}

	public class UserViewModel
	{
		public string? Id { get; set; }
		public string? FirstName { get; set; }
		public string? LastName { get; set; }
		public string? Contact { get; set; }
		public string? Address { get; set; }
		public string? Email { get; set; }
	}

	public class UpdatePasswordViewModel
	{
		[Required]
		public string Id { get; set; } = string.Empty;

		[Required]
		public string? OldPassword { get; set; }

		[Required]
		public string? NewPassword { get; set; }

		[Required]
		[Compare("NewPassword")]
		public string? ConfirmPassword { get; set; }
	}
}
