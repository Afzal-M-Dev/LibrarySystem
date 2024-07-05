using LibraryManagement.Data;
using LibraryManagement.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace LibraryManagement.Extensions
{
	public static class ServiceCollectionExtensions
	{
		public static IServiceCollection AddCustomSwagger(this IServiceCollection services)
		{
			services.AddSwaggerGen(options =>
			{
				options.SwaggerDoc("v1", new OpenApiInfo
				{
					Title = "Library Management API",
					Version = "v1",
					Description = "API documentation for Library Management System"
				});

				// Define security scheme for JWT
				options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
				{
					In = ParameterLocation.Header,
					Description = "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'",
					Name = "Authorization",
					Type = SecuritySchemeType.Http,
					Scheme = "Bearer"
				});

				// Define global security requirement
				options.AddSecurityRequirement(new OpenApiSecurityRequirement
				{
					{
						new OpenApiSecurityScheme
						{
							Reference = new OpenApiReference
							{
								Type = ReferenceType.SecurityScheme,
								Id = "Bearer"
							}
						},
						new List<string>()
					}
				});
			});

			return services;
		}
		public static IServiceCollection AddCustomAuthentication(this IServiceCollection services, IConfiguration configuration)
		{
			var jwtIssuer = configuration["Jwt:Issuer"];
			var jwtAudience = configuration["Jwt:Audience"];
			var jwtKey = configuration["Jwt:Key"];

			services.AddAuthentication(options =>
			{
				options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			})
			.AddJwtBearer(options =>
			{
				options.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuer = true,
					ValidateAudience = true,
					ValidateLifetime = true,
					ValidateIssuerSigningKey = true,
					ValidIssuer = jwtIssuer,
					ValidAudience = jwtAudience,
					IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
				};
			});

			return services;
		}

		public static async Task InitializeServicesAsync(IServiceProvider services)
		{
			var userManager = services.GetRequiredService<UserManager<AppUser>>();
			var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

			try
			{
				await SeedData.Initialize(services); 
			}
			catch (Exception ex)
			{
				var logger = services.GetRequiredService<ILogger<Program>>();
				logger.LogError(ex, "An error occurred seeding the DB.");
			}
		}
	}
}
