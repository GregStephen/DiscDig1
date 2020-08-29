using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DiscDig1.DTOS;
using DiscDig1.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace DiscDig1.Controllers
{
    /// <summary>
    /// The controller for Album
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    
    public class AlbumController : ControllerBase
    {
        private readonly ILogger<AlbumController> _logger;
        private readonly IAlbumRepository _repo;

        public AlbumController(ILogger<AlbumController> logger, IAlbumRepository repo)
        {
            _logger = logger;
            _repo = repo;
        }
        /// <summary>
        /// WIll add a new album model to the database
        /// </summary>
        /// <param name="newAlbum"></param>
        /// <returns>IActionResult of Created with the album information or Bad Request if failed</returns>
        [HttpPost]
        public IActionResult AddNewAlbumToDatabase(NewAlbumDTO newAlbum)
        {
            var albumId = _repo.AddNewAlbumToDatabase(newAlbum);
            if (albumId == null)
            {
                return BadRequest();      
            }
            else
            {
                return Created($"album/{newAlbum.Title}", newAlbum);
            }
        } 

    }
}