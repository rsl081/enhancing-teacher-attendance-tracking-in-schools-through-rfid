using AutoMapper;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        protected readonly DataContext _dataContext;

        public BaseApiController(DataContext dataContext)
        {
            this._dataContext = dataContext;
        }
    }
}