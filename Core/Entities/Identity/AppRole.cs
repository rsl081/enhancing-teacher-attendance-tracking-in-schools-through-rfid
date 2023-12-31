using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity
{
    public class AppRole : IdentityRole
    {
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}