using API.Dto;
using API.Helper;
using AutoMapper;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AttendanceController : BaseApiController
    {
        public AttendanceController(DataContext dataContext, IMapper mapper) : base(dataContext, mapper)
        {
        }

        [HttpPost]
        public async Task<ActionResult> CreateAttendanceDate(
            AttendanceDate attendanceCreateDto)
        {
            _dataContext.AttendanceDates.Add(attendanceCreateDto);
            await _dataContext.SaveChangesAsync();

            return Ok();
        }

        [HttpGet]
        public async Task<ActionResult> GetAttendanceDates(string search)
        {
            var attendance = 
                    await _dataContext.AttendanceDates
                                    .Include(x => x.Attendances)
                                    .OrderBy(x => x.DateCreated)
                                    .ToListAsync();
            
            if (!String.IsNullOrEmpty(search))
            {
                DateTime startDate = DateTime.Parse(search);
                attendance = attendance.Where(p => 
                                    p.DateCreated.Date == startDate)
                                    .ToList();
            }
                
            var data = _mapper.Map<IReadOnlyList<AttendanceDate>, 
                IReadOnlyList<AttendanceDateToReturn>>(attendance);
            var totalItems = await _dataContext.AttendanceDates.CountAsync();

            return Ok(new Pagination<AttendanceDateToReturn>(totalItems, data));
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteAttendanceDate(
            Guid id)
        {
            var ad = await _dataContext.AttendanceDates.FindAsync(id);

            _dataContext.AttendanceDates.Remove(ad);
            await _dataContext.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("the-attendance")]
        public async Task<ActionResult> GetAttendances(string search, string searchAttendanceDateId)
        {
            var attendance = 
                    await _dataContext.Attendances
                                    .ToListAsync();

            if (!String.IsNullOrEmpty(search))
            {
                attendance = attendance.Where(p => 
                                    p.Rfid == search && 
                                    p.AttendanceDateId.ToString() == searchAttendanceDateId)
                                    .ToList();
                return Ok(attendance);
            }

            return Ok();
        }

        [HttpPost("the-attendance")]
        public async Task<ActionResult> CreateAttendance(
            CreateAttendanceDto attendanceCreate)
        {
            
            var attendanceCreateDto = _mapper.Map<CreateAttendanceDto, Attendance>(attendanceCreate);

             // Set nullable DateTime property to null if it has a default value
            if (attendanceCreate.TimeOut == default)
            {
                attendanceCreateDto.TimeOut = null;
            }
            
            _dataContext.Attendances.Add(attendanceCreateDto);
            await _dataContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("the-attendance")]
        public async Task<ActionResult> UpdateAttendance(
            CreateAttendanceDto attendanceCreate)
        {
            var attendanceCreateDto = _mapper.Map<CreateAttendanceDto, Attendance>(attendanceCreate);


            _dataContext.Attendances.Update(attendanceCreateDto);
            await _dataContext.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("the-attendance/{id}")]
        public async Task<ActionResult> DeleteAttendance(
            Guid id)
        {
            var ad = await _dataContext.Attendances.FindAsync(id);

            _dataContext.Attendances.Remove(ad);
            await _dataContext.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("datetime")]
        public ActionResult GatDateTime()
        {   
            var date = DateTime.Now;

            return Ok(date);
        }



    }
}