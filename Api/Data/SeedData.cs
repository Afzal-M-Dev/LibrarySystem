using LibraryManagement.Entities;
using Microsoft.AspNetCore.Identity;

namespace LibraryManagement.Data
{
	public class SeedData
	{
		public static async Task Initialize(IServiceProvider serviceProvider)
		{
			var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
			var userManager = serviceProvider.GetRequiredService<UserManager<AppUser>>();

			// Seed Roles
			string[] roleNames = { "Librarian", "Customer" };
			foreach (var roleName in roleNames)
			{
				var roleExist = await roleManager.RoleExistsAsync(roleName);
				if (!roleExist)
				{
					await roleManager.CreateAsync(new IdentityRole(roleName));
				}
			}

			// Seed Admin User
			var adminUser = new AppUser
			{
				UserName = "admin",
				Email = "admin@example.com",
				EmailConfirmed = true
			};

			if (userManager.Users.All(u => u.UserName != adminUser.UserName))
			{
				var password = "RandomPassword123!"; 
				var result = await userManager.CreateAsync(adminUser, password);

				if (result.Succeeded)
				{
					await userManager.AddToRoleAsync(adminUser, "Librarian");
					await userManager.AddToRoleAsync(adminUser, "Customer");
				}
			}
		}
	}
}
