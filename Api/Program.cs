using LibraryManagement.Data;
using LibraryManagement.Data.Repositories;
using LibraryManagement.Entities;
using LibraryManagement.ExceptionFilter;
using LibraryManagement.Extensions;
using LibraryManagement.Service.BookService;
using LibraryManagement.Service.ReviewService;
using LibraryManagement.Service.UserService;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<AppDbContext>(options =>
	options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<AppUser, IdentityRole>()
	.AddEntityFrameworkStores<AppDbContext>()
	.AddDefaultTokenProviders();


builder.Services.AddControllers(options =>
{
	options.Filters.Add<CustomExceptionFilter>(); 
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCustomSwagger(); 
builder.Services.AddCustomAuthentication(builder.Configuration);
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IBookRepository, BookRepository>();
builder.Services.AddTransient<IBookService, BookService>();
builder.Services.AddTransient<IReviewRepository, ReviewRepository>();
builder.Services.AddTransient<IReviewService, ReviewService>();
builder.Services.AddTransient<IUserRepository, UserRepository>();
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
	var services = scope.ServiceProvider;

	// Ensure the database is created and migrate to the latest version
	var dbContext = services.GetRequiredService<AppDbContext>();
	//dbContext.Database.Migrate();

	// Initialize other services as needed
	await ServiceCollectionExtensions.InitializeServicesAsync(services);
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();

app.UseCors(policy =>
	policy.AllowAnyOrigin()
		  .AllowAnyMethod()
		  .AllowAnyHeader()
);

app.MapControllers();

app.Run();
