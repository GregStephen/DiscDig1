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
    /// Controller that accesses the Discog api
    /// </summary>
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

        /// <summary>
        /// Retrieves albums from discog that match certain parameters
        /// </summary>
        /// <param name="artistTerm">(Optional) The string of the artist searched for</param>
        /// <param name="albumTerm">(Optional) The string of the album searched for</param>
        /// <param name="page">The integer of the page being searched</param>
        /// <returns>DiscogResponse Data Model</returns>
        [HttpGet("artist/{artistTerm}/album/{albumTerm}/page/{page}")]
        public IActionResult GetAlbumsFromDiscog(string artistTerm, string albumTerm, int page)
        {
            var response = _repo.GetAlbumsFromDiscog(artistTerm, albumTerm, page);
            if (response == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(response);
            }
        }

        /// <summary>
        /// Gets an album from Discog API by the specific album ID
        /// </summary>
        /// <param name="id">The Id of the album needed</param>
        /// <returns>DiscogResponse Data Model</returns>
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