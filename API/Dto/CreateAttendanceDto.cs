namespace API.Dto
{
    public class CreateAttendanceDto
    {
        public Guid Id { get; set; }
        public string TeachName { get; set; }
        public string Subject { get; set; }
        public string Rfid { get; set; }
        public DateTime TimeIn { get; set; } = DateTime.Now;
        public DateTime? TimeOut { get; set; }
        public DateTime TheDate { get; set; } = DateTime.Now;
        public bool isNowUpdated { get; set; } = true;
        public bool isLooping { get; set; } = false;
        public int NumberOfHour { get; set; }
        public Guid AttendanceDateId { get; set; }
    }  
}

