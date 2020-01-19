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