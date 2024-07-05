using LibraryManagement.Entities;
using LibraryManagement.ViewModel;

namespace LibraryManagement.Service.UserService
{
	public interface IUserService
	{
		Task<string> GenerateToken(AppUser user);
		Task<ResponseViewModel> UserRegistration(RegisterViewModel model);
		Task<ResponseViewModel> Login(LoginViewModel model);
		Task<ResponseViewModel> Logout();
		Task<ResponseViewModel> UpdateUserProfile(UserViewModel user);
		Task<ResponseViewModel> UpdateUserPassword(UpdatePasswordViewModel updatePassword);
	}
}
