using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}