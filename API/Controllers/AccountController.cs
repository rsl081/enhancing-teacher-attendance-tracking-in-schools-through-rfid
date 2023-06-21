using API.Dto;
using API.Helper;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        protected readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly ITokenService _tokenService;
        public AccountController(
            UserManager<AppUser> userManager, 
            SignInManager<AppUser> signInManager,
            ITokenService tokenService,
            IMapper mapper,
            IPhotoService photoService,
            DataContext dataContext) 
            : base(dataContext)
        {
            this._signInManager = signInManager;
            this._userManager = userManager;
            this._tokenService = tokenService;
            this._mapper = mapper;
            this._photoService = photoService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> LoginUser(LoginDto loginDto)
        {
            
            var user = await _userManager.Users
                .Include(p => p.UserPhoto)
                .SingleOrDefaultAsync(x => x.Email == loginDto.Email);
            
            if(user == null) return Unauthorized();

            var result = await _signInManager.CheckPasswordSignInAsync(
                user, loginDto.Password, false
            );

            if (!await _userManager.IsEmailConfirmedAsync(user))
                return Unauthorized("Email is not confirmed");

            if (!await _userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized("Invalid Authentication");

            if(!result.Succeeded)  return Unauthorized();

            return new UserDto
            {
                Email = user.Email,
                DisplayName = user.DisplayName,  
                Token = await _tokenService.CreateToken(user),
                Created = user.Created,
            };

        }

        [HttpPost("faculty/register")]
        public async Task<ActionResult<UserDto>> RegisterFaculty(
            RegisterUserDto registerFacultyDto)
        {

            var user = new AppUser
            {
                Rfid = registerFacultyDto.Rfid,
                DisplayName = registerFacultyDto.DisplayName,
                Email = registerFacultyDto.Email,
                UserName = registerFacultyDto.Email,
                Subject = registerFacultyDto.Subject,
                EmailConfirmed = true,
            };

            var result = await _userManager.CreateAsync(user);

            var roleAddResult = 
                await _userManager.AddToRoleAsync(user, "Faculty");
            
            if (!roleAddResult.Succeeded){

              return BadRequest("Failed to add to role");  
            }

            return new UserDto
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Rfid = user.Rfid,
                Subject = user.Subject,
                Token = await _tokenService.CreateToken(user),
                Email = user.Email,
                Created = user.Created
            };
        }

        [HttpGet("faculty/all")]
        public async Task<ActionResult<Pagination<UserDto>>> GetAllStudent()
        {

            var user = await _userManager.Users
                .Include(p => p.UserPhoto)
                .Where(u => u.UserRoles.All(r => r.Role.Name == "Faculty"))
                .ToListAsync();
          
            var totalItems = user.Count();

            var data = _mapper.Map<IReadOnlyList<AppUser>,
                IReadOnlyList<UserDto>>(user);

            return Ok(new Pagination<UserDto>(totalItems, data));

        }


        [HttpPost("add-photo/{id}")]
        public async Task<ActionResult> AddPhoto(
            IFormFile file, string id)
        {
            var user = await _userManager.Users
                .Include(p => p.UserPhoto)
                .SingleOrDefaultAsync(
                x => x.Id == id);

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var userPhoto = new UserPhoto {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            user.UserPhoto = userPhoto;
            
            var saveResult = await _userManager.UpdateAsync(user);

            if (!saveResult.Succeeded)
            {
                return BadRequest("Problem adding photo");
            }

            return Ok(_mapper.Map<ContentPhotoCreateDto>(user.UserPhoto));
        }

        [HttpDelete("faculty/delete/{id}")]
        public async Task<ActionResult> DeleteFaculty(string id)
        {
            var faculty = await _userManager.Users
                .Include(p => p.UserPhoto)
                .SingleOrDefaultAsync(x => x.Id == id);

            if (faculty == null)
            {
                return NotFound();
            }

            if (faculty.UserPhoto != null)
            {
                _dataContext.UserPhotos.Remove(faculty.UserPhoto);
                var resultPhoto = await _photoService.DeletePhotoAsync(faculty.UserPhoto.PublicId);
                if (resultPhoto.Error != null) return BadRequest(resultPhoto.Error.Message);
            }
            
            await _dataContext.SaveChangesAsync();
            // Delete the alumni
            var result = await _userManager.DeleteAsync(faculty);

            return NoContent();
        }

        [HttpPut("faculty/update")]
        public async Task<ActionResult> UpdateFaculty(
            UpdateUser facultyUpdateDto)
        {
            var faculty = await _userManager.Users.SingleOrDefaultAsync(
                x => x.Email == facultyUpdateDto.Email);

            if (faculty == null) return BadRequest();

            _mapper.Map(facultyUpdateDto, faculty);

            await _userManager.UpdateAsync(faculty);

            return Ok();
        }

    }
}