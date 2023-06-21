using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace API.Dto
{
    public class UserDto
    {
        public string Id { get; set; }
        public string UserPhoto { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public string Rfid { get; set; }
        public string Subject { get; set; }
        [JsonIgnore]
        public DateTime Created { get; set; }

        public string CreatedAt { 
            get{
                return Created.ToString("MM/dd/yyyy hh:mm:tt");
            }
            set{}
        }
    }
}