using Core.Interfaces;
using Infrastructure.Services;

namespace API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services,
            IConfiguration config)
        {
            
            // services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            // services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IPhotoService, PhotoService>();
            
            return services;
        }
    }
}