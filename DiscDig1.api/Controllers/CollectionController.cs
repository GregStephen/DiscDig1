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
    public class CollectionController : ControllerBase
    {
        private readonly ILogger<CollectionController> _logger;
        private readonly ICollectionRepository _repo;

        public CollectionController(ILogger<CollectionController> logger, ICollectionRepository repo)
        {
            _logger = logger;
            _repo = repo;
        }

        [HttpPost]
        public IActionResult AddNewAlbumToCollection(AlbumToCollectionDTO albumToCollectionDTO)
        {
            if (_repo.AddNewAlbumToMainCollection(albumToCollectionDTO))
            {
                return Created($"collection/{albumToCollectionDTO.NewAlbum.Title}", albumToCollectionDTO);
            }
            else
            {
                return BadRequest();
            }
        }
    }
}