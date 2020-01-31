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
    public class GenreController : ControllerBase
    {

        private readonly ILogger<GenreController> _logger;
        private readonly IGenreRepository _repo;

        public GenreController(ILogger<GenreController> logger, IGenreRepository repo)
        {
            _logger = logger;
            _repo = repo;
        }

        [HttpGet]
        public IActionResult GetAllGenres()
        {
            var genres = _repo.GetAllGenresForSearch();
            if (genres == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(genres);
            }
        }

        [HttpGet("collection={collectionId}/genre={genreId}")]
        public IActionResult GetTotalForEachGenreInCollection(Guid collectionId, Guid genreId)
        {
            var genres = _repo.GetTotalForEachGenreInCollection(collectionId, genreId);
            if (genres == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(genres);
            }
        }

    }
}