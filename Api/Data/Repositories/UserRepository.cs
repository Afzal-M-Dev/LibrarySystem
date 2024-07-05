using LibraryManagement.Entities;

namespace LibraryManagement.Data.Repositories
{
	public interface IUserRepository
	{
		Task<AppUser> GetUserByIdAsync(string id);
		Task UpdateUserAsync(AppUser user);
	}
	public class UserRepository : IUserRepository
	{
		private readonly AppDbContext _context;
        public UserRepository(AppDbContext context)
        {
			_context = context;     
        }

		public async Task<AppUser> GetUserByIdAsync(string id)
		{
			return await _context.Users.FindAsync(id);
		}

		public async Task UpdateUserAsync(AppUser user)
		{
			_context.Users.Update(user);
			await _context.SaveChangesAsync();
		}
	}
}
