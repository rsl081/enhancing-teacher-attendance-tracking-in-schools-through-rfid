using System.ComponentModel.DataAnnotations;

namespace API.Dto
{
    public class RegisterUserDto
    {
        [Required]
        public string Rfid { get; set; }
        [Required]
        public string DisplayName { get; set; }
        [Required]
        public string Subject { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}