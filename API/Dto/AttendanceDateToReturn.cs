using Core.Entities;

namespace API.Dto
{
    public class AttendanceDateToReturn
    {
        public Guid Id { get; set; }
         public DateTime DateCreated { get; set; }
        public List<Attendance> Attendances { get; set; } = new List<Attendance>();
    }
}