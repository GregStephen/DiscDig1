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
    [Route("api/[controller]")]
    [ApiController]
    public class DiscogController : ControllerBase
    {
        private readonly ILogger<DiscogController> _logger;
        private readonly IDiscogRepository _repo;

        public DiscogController(ILogger<DiscogController> logger, IDiscogRepository repo)
        {
            _logger = logger;
            _repo = repo;
        }

        [HttpGet("artist/{artistTerm}/album/{albumTerm}")]
        public IActionResult GetAlbumsFromDiscog(string artistTerm, string albumTerm)
        {
            var response = _repo.GetAlbumsFromDiscog(artistTerm, albumTerm);
            if (response == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(response);
            }
        }
        [HttpGet("album/{id}")]
        public IActionResult GetAlbumById(int id)
        {
            var response = _repo.GetAlbumFromDiscogById(id);
            if (response == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(response);
            }
        }

    }
}