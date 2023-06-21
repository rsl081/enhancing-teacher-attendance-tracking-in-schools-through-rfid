using AutoMapper;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AttendanceController : BaseApiController
    {
        public AttendanceController(DataContext dataContext) : base(dataContext)
        {
            
        }

        [HttpPost]
        public async Task<ActionResult> CreateAttendanceDate(
            AttendanceDate attendanceCreateDto)
        {
            _dataContext.AttendanceDates.Add(attendanceCreateDto);
            await _dataContext.SaveChangesAsync();

            return Ok("Successfully Created");
        }

        [HttpGet]
        public async Task<ActionResult> GetAttendanceDates()
        {
            var attendance = 
                    await _dataContext.AttendanceDates
                                    .Include(x => x.Attendances)
                                    .ToListAsync();
            return Ok(attendance);
        }
        [HttpGet("the-attendance")]
        public async Task<ActionResult> GetAttendances()
        {
            var attendance = 
                    await _dataContext.Attendances
                                    .ToListAsync();
            return Ok(attendance);
        }

        [HttpPost("the-attendance")]
        public async Task<ActionResult> CreateAttendance(
            Attendance attendanceCreateDto)
        {
            _dataContext.Attendances.Add(attendanceCreateDto);
            await _dataContext.SaveChangesAsync();

            return Ok("Successfully Created");
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAttendance(
            Attendance attendanceCreateDto)
        {
            _dataContext.Attendances.Update(attendanceCreateDto);
            await _dataContext.SaveChangesAsync();

            return Ok("Successfully Created");
        }



    }
}