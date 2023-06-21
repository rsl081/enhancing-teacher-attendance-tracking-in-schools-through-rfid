using System.Text.Json.Serialization;

namespace Core.Entities
{
    public class AttendanceDate : BaseEntity
    {
        public DateTime DateCreated { get; set; } = DateTime.Now;
        [JsonIgnore]
        public List<Attendance> Attendances { get; set; } = new List<Attendance>();
    }
}