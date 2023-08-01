using System.Text.Json.Serialization;

namespace Core.Entities
{
    public class Attendance : BaseEntity
    {
        public string TeachName { get; set; }
        public string Subject { get; set; }
        public string Rfid { get; set; }
        public DateTime TimeIn { get; set; } = DateTime.Now;
        public DateTime? TimeOut { get; set; }
        public int NumberOfHour { get; set; }
        public DateTime TheDate { get; set; }
        public bool isLooping { get; set; }
        public bool isNowUpdated { get; set; }
        [JsonIgnore]
        public AttendanceDate AttendanceDate { get; set; }
        public Guid AttendanceDateId { get; set; }
    }
}