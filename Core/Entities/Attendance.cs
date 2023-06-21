using System.Text.Json.Serialization;

namespace Core.Entities
{
    public class Attendance
    {
        public string Id { get; set; }
        public string TeachName { get; set; }
        public string Subject { get; set; }
        public DateTime TimeIn { get; set; }
        public DateTime TimeOut { get; set; }
        public int NumberOfHour { get; set; }
        [JsonIgnore]
        public AttendanceDate AttendanceDate { get; set; }
        public Guid AttendanceDateId { get; set; }
    }
}