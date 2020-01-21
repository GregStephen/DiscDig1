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

        [HttpGet("{uid}")]
        public IActionResult GetUsersMainCollection(Guid uid)
        {
            var collection = _repo.GetUsersMainCollection(uid);
            if (collection == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(collection);
            }
        }

        [HttpGet("subcollections/{userid}")]
        public IActionResult GetUsersSubCollections(Guid userId)
        {
            var collections = _repo.GetUsersSubCollections(userId);
            if (collections == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(collections);
            }
        }

        [HttpGet("id/{id}")]
        public IActionResult GetCollectionById(Guid id)
        {
            var collection = _repo.GetUsersCollectionById(id);
            if (collection == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(collection);
            }
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

        [HttpPost("newsub")]
        public IActionResult AddNewSubcollection(NewSubDTO newSubDto)
        {
            if (_repo.AddNewSubcollection(newSubDto))
            {
                return Created($"collection/newsub/{newSubDto.SubCollectionName}", newSubDto);
            }
            else
            {
                return BadRequest();
            }
        }
        [HttpPost("addtosubcollection")]
        public IActionResult AddAlbumsToSubcollection(AddToSubcollectionDTO addToSubcollection)
        {
            if (_repo.AddAlbumsToSubcollection(addToSubcollection))
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpDelete]
        public IActionResult DeleteTheseAlbumsFromTheCollection(AlbumsToDelete albumsToDelete)
        {
            if(_repo.DeleteTheseAlbumsFromTheCollection(albumsToDelete))
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
    }
}