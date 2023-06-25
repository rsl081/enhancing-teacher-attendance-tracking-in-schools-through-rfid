using API.Dto;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;

namespace API.Helper
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<AppUser, UserDto>()
                .ForMember(p => p.UserPhoto, o => o.MapFrom(s => s.UserPhoto.Url));
            CreateMap<UpdateUser, AppUser>();
            CreateMap<UserPhoto, ContentPhotoCreateDto>();


            CreateMap<AttendanceDate, AttendanceDateToReturn>()
                .ForMember(s => s.Attendances, o => o.MapFrom(s => s.Attendances));
        

            CreateMap<CreateAttendanceDto, Attendance>();
        }
    }
}