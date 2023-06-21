namespace Core.Entities
{
    public class AttendanceDate : BaseEntity
    {
        public DateTime DateCreated { get; set; } = DateTime.Now;
    }
}