using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DiscDig1.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace DiscDig1.Controllers
{
    /// <summary>
    /// The Controller for the Avatar data models
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AvatarController : ControllerBase
    {
        private readonly ILogger<AvatarController> _logger;
        private readonly IAvatarRepository _repo;

        public AvatarController(ILogger<AvatarController> logger, IAvatarRepository repo)
        {
            _logger = logger;
            _repo = repo;
        }
        /// <summary>
        /// Gets all of the avatars
        /// </summary>
        /// <returns>IEnumerable of all avatar data models</returns>
        [HttpGet]
        public IActionResult GetAllAvatars()
        {
            var avatars = _repo.GetAllAvatars();
            if (avatars == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(avatars);
            }
        }
    }
}