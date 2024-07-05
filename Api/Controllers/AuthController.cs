using LibraryManagement.Entities;
using LibraryManagement.Service.UserService;
using LibraryManagement.Utils;
using LibraryManagement.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly UserManager<AppUser> _userManager;
		private readonly SignInManager<AppUser> _signInManager;
		private readonly IUserService _userService;
        public AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IUserService userService)
        {
			_userManager = userManager;
			_signInManager = signInManager;
			_userService = userService;     
        }

		[HttpPost("SignUp")]
		public async Task<IActionResult> SignUp([FromForm] RegisterViewModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			var response = await _userService.UserRegistration(model);

			if (!response.IsSuccess)
			{
				var errors = response.Data as List<string> ?? new List<string>();
				var errorResponse = new ErrorResponseViewModel { StatusCode = response.StatusCode, Message = response.Message, Errors = errors };
				return BadRequest(errorResponse);
			}

			return Ok(response);
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginViewModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			var response = await _userService.Login(model);
			if (!response.IsSuccess)
			{
				return BadRequest(response);
			}
			return Ok(response);
		}

		[HttpPost("logout")]
		public async Task<IActionResult> Logout()
		{
			var response = await _userService.Logout();
			if (!response.IsSuccess)
			{
				return BadRequest(response);
			}
			return Ok(response);
		}

		[Authorize]
		[HttpPut("updateprofile")]
		public async Task<IActionResult> UpdateProfile(UserViewModel user)
		{
			var response = await _userService.UpdateUserProfile(user);
			return Ok(response);
		}

		[Authorize]
		[HttpPut("updatepassword")]
		public async Task<IActionResult> UpdatePassword(UpdatePasswordViewModel updatePassword)
		{
			var response = await _userService.UpdateUserPassword(updatePassword);
			return Ok(response);
		}

	}
}
