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
    /// Controller for the Genre
    /// 
    /// GETS
    /// Get IEnumerable of all GenreForSearch Data Models
    /// Get IEnumerable of GenreForSearch Data Model for specific collection and specific genre
    /// </summary>
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

        /// <summary>
        /// Returns IEnumerable of all GenreForSearch Data Models
        /// </summary>
        /// <returns>IEnumerable of all GenreForSearch Data Models</returns>
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

        /// <summary>
        /// Returns IEnumerable of GenreForSearch data model for a specific collection and genre
        /// </summary>
        /// <param name="collectionId">The unique Id for the collection</param>
        /// <param name="genreId">The unique Id for the genre</param>
        /// <returns>IEnumerable of GenreForSearch data model</returns>
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