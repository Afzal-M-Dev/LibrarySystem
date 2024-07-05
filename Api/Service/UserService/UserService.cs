using LibraryManagement.Data.Repositories;
using LibraryManagement.Entities;
using LibraryManagement.ExceptionFilter;
using LibraryManagement.Utils;
using LibraryManagement.ViewModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LibraryManagement.Service.UserService
{
	public class UserService : IUserService
	{
		private readonly UserManager<AppUser> _userManager;
		private readonly IConfiguration _configuration;
		private readonly SignInManager<AppUser> _signInManager;
		private readonly IUserRepository _userRepo;

		public UserService(UserManager<AppUser> userManager, IUserRepository userRepo, SignInManager<AppUser> signInManager, IConfiguration configuration)
        {
			_userManager = userManager;
			_configuration = configuration;
			_signInManager = signInManager;
			_userRepo = userRepo;
		}

		#region UserAuthentication
		public async Task<ResponseViewModel> UserRegistration(RegisterViewModel model)
		{
			var user = new AppUser { UserName = model.Username, Email = model.Email, IsActive = true, CreatedAt = DateTime.Now, Address = model.Address, PhoneNumber = model.Contact, FirstName = model.FirstName, LastName = model.LastName};
			var result = await _userManager.CreateAsync(user, model.Password);
			if (!result.Succeeded)
			{
				var errorMessage = result.Errors.FirstOrDefault()?.Description; 
				if (result.Errors.Any(e => e.Code == "DuplicateUserName"))
				{
					errorMessage = "Username '" + model.Username + "' is already taken.";
				}
				return new ResponseViewModel { IsSuccess = false, StatusCode = 400, Message = errorMessage ?? "User creation failed.", Data = result.Errors.Select(e => e.Description).ToList()};
			}

			if (!Enum.IsDefined(typeof(Role), model.Role))
			{
				return new ResponseViewModel { IsSuccess = false, StatusCode = 400, Message = "Invalid role specified."};
			}
			await _userManager.AddToRoleAsync(user, model.Role.ToString());
			return new ResponseViewModel { IsSuccess = true, StatusCode = 200, Message = "User registered successfully." };
		}
		public async Task<ResponseViewModel> Login(LoginViewModel model)
		{
			var user = await _userManager.FindByNameAsync(model.Username);
			if (user == null)
			{
				return new ResponseViewModel { IsSuccess = false, StatusCode = 404, Message = "User not found." };
			}

			var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, lockoutOnFailure: false);
			if (!result.Succeeded)
			{
				return new ResponseViewModel { IsSuccess = false, StatusCode = 401, Message = "Invalid login attempt." };
			}

			var userClaims = await GenerateClaims(user);
			return new ResponseViewModel { IsSuccess = true, StatusCode = 200, Message = "Login successful.", Data = userClaims };
		}
		public async Task<ResponseViewModel> Logout()
		{
			await _signInManager.SignOutAsync();
			return new ResponseViewModel { IsSuccess = true, StatusCode = 200, Message = "Logout successful." };
		}

		#endregion

		#region UserClaims And JWT Token

		public async Task<string> GenerateToken(AppUser user)
		{
			var claims = new List<Claim>
			{
				new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
				new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
				new Claim(ClaimTypes.NameIdentifier, user.Id)
			};

			var roles = await _userManager.GetRolesAsync(user);
			if (roles.Count > 0)
			{
				claims.Add(new Claim(ClaimTypes.Role, roles[0])); 
			}

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var token = new JwtSecurityToken(
				issuer: _configuration["Jwt:Issuer"],
				audience: _configuration["Jwt:Audience"],
				claims: claims,
				expires: DateTime.UtcNow.AddDays(1), 
				signingCredentials: creds);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
		public async Task<UserClaimViewModel> GenerateClaims(AppUser user)
		{
			var token = await GenerateToken(user);
			var roles = await _userManager.GetRolesAsync(user);

			var userClaimViewModel = new UserClaimViewModel
			{
				Id = user.Id,
				Name = user.UserName,
				Email = user.Email,
				Contact = user.PhoneNumber,
				Address = user.Address,
				Role = roles.FirstOrDefault(),
				Token = token,
				FirstName = user.FirstName,
				LastName = user.LastName,
			};
			userClaimViewModel.TokenExpiry = DateTime.Now.AddDays(1).ToString();
			return userClaimViewModel;
		}

		#endregion

		#region User
		public async Task<ResponseViewModel> UpdateUserProfile(UserViewModel user)
		{
			var userObj = await _userRepo.GetUserByIdAsync(user.Id);
			if (userObj == null)
			{
				throw new CustomException("User Not Found");
			}

			userObj.FirstName = user.FirstName;
			userObj.LastName = user.LastName;
			userObj.PhoneNumber = user.Contact;
			userObj.Address = user.Address;
			userObj.Email = user.Email;
			await _userRepo.UpdateUserAsync(userObj);
			var updatedClaims = await GenerateClaims(userObj);
			return new ResponseViewModel { IsSuccess = true, Message = "User profile updated successfully.", Data = updatedClaims };
		}
		public async Task<ResponseViewModel> UpdateUserPassword(UpdatePasswordViewModel updatePassword)
		{
			if (updatePassword.NewPassword != updatePassword.ConfirmPassword)
			{
				throw new CustomException("New password and Confirm password not matched.");
			}
			var user = await _userManager.FindByIdAsync(updatePassword.Id);
			if (user == null)
			{
				throw new CustomException("User not found.");
			}

			var result = await _userManager.ChangePasswordAsync(user, updatePassword.OldPassword, updatePassword.NewPassword);
			if (result.Succeeded)
			{
				return new ResponseViewModel { IsSuccess = true, Message = "Password updated successfully." };
			}

			var errors = string.Join(", ", result.Errors.Select(e => e.Description));
			throw new CustomException($"Password update failed: {errors}");
		}
		#endregion

	}
}
