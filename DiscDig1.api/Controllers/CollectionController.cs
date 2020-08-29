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
    /// Controller for collection data models
    /// 
    ///  GETS
    /// Get users main collection by userId
    /// Get users complete collections by userId
    /// Get users subcollections by userId
    /// Get a specific collection by that collectionId
    /// Get a result of albums from a search query 
    /// 
    ///  POSTS
    /// Post a new album to users collection
    /// Create a new subcollection
    /// Post a new album to users subcollection
    /// 
    ///  PUTS
    /// Change the name of a subcollection
    /// 
    ///  DELETES
    /// Delete certain albums from a collection
    /// Delete an entire subcollection
    /// 
    /// </summary>
 
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

        /// <summary>
        /// Retrieve the Users Main Collection with the Users Id
        /// </summary>
        /// <param name="uid">The user Id who owns the main collection you are getting</param>
        /// <returns>An AlbumCollection data model for the users main collection</returns>
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
        /// <summary>
        /// Retrieves a list of all of the users collections with the Users Id
        /// </summary>
        /// <param name="uid">The user Id who owns all the collections you are getting</param>
        /// <returns>A list of AlbumCollection data models/returns>
        [HttpGet("allCollections/{uid}")]
        public IActionResult GetAllUsersCollections(Guid uid)
        {
            var collections = _repo.GetAllCollectionsByUserId(uid);
            if (collections == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(collections);
            }

        }
        /// <summary>
        /// Retrieves the Users subcollections with the Users Id
        /// </summary>
        /// <param name="userId">The userId who owns the subcollections you are getting</param>
        /// <returns>An IEnumberable of SubCollectionsInfo data models</returns>
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

        /// <summary>
        /// Retrieves a specific album collection by that album collections Id
        /// </summary>
        /// <param name="id">The collection's Id you are wanting to get</param>
        /// <returns>an AlbumCollection data model</returns>
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

        /// <summary>
        /// Searches through the users collections with different possible parameters and returns a new AlbumCollection model that contains the albums that meet the parameters
        /// </summary>
        /// <param name="term">The string instance of what was searched</param>
        /// <param name="id">The unique Id of the collection being searched</param>
        /// <param name="searchGenres">A list of strings for the genres that are selected</param>
        /// <param name="perPage">The integer representing the number of results contained on each page</param>
        /// <param name="currentPage">The integer representing the current page being viewed</param>
        /// <param name="sortBy">The string dictating which category {Artist, Title, Year} to sort by</param>
        /// <param name="direction">The string {ASC, DESC} which determines which way to sort the results</param>
        /// <returns>An AlbumCollection data model that fits the required parameters</returns>
        [HttpGet("search/per_page={perPage}&current_page={currentPage}&q={term}&collection={id}&sortBy={sortBy}&direction={direction}&genres")]
        public IActionResult SearchThruCollection(string term, Guid id, [FromQuery(Name="genre")]string[] searchGenres, int perPage, int currentPage, string sortBy, string direction)
        {
            var result = _repo.SearchThruCollection(term, id, searchGenres, perPage, currentPage, sortBy, direction);
            if (result == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(result);
            }
        }
        
        /// <summary>
        /// Add a new album to the users collection
        /// </summary>
        /// <param name="albumToCollectionDTO"></param>
        /// <returns>If succesful, returns the albumToCollection Data Transfer Object</returns>
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
        /// <summary>
        /// Creates a new subcollection and connects it to the user in the database
        /// </summary>
        /// <param name="newSubDto"></param>
        /// <returns>If successful, returns the newSub data transfer object</returns>
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
        /// <summary>
        /// Adds a new album to the specified subcollection
        /// </summary>
        /// <param name="addToSubcollection"></param>
        /// <returns>If successful, returns a status code 200</returns>
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

        /// <summary>
        /// Change a selected subcollections name
        /// </summary>
        /// <param name="changeSubNameDTO"></param>
        /// <returns>If successful, returns a status code 200</returns>
        [HttpPut("changeSubName")]
        public IActionResult ChangeSubCollectionName(ChangeSubNameDTO changeSubNameDTO)
        {
            if (_repo.ChangeSubCollectionName(changeSubNameDTO))
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
        /// <summary>
        /// Deletes the specified albums from the specified collection
        /// </summary>
        /// <param name="albumsToDelete"></param>
        /// <returns>If successful, returns a status code 200</returns>
        [HttpDelete]
        public IActionResult DeleteTheseAlbumsFromTheCollection(AlbumsToDelete albumsToDelete)
        {
            if (_repo.DeleteTheseAlbumsFromTheCollection(albumsToDelete))
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Deletes the specified subcollection
        /// </summary>
        /// <param name="id"></param>
        /// <returns>If successful, returns a status code 200</returns>
        [HttpDelete("sub/{id}")]
        public IActionResult DeleteThisSubcollection(Guid id)
        {
            if (_repo.DeleteThisSubcollection(id))
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