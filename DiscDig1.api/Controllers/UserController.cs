using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DiscDig1.DTOS;
using DiscDig1.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace DiscDig1.Controllers
{
    /// <summary>
    /// The Controller for the User
    /// 
    ///  GETS
    /// Get User by the users unique FireBaseId
    /// Get User by unique UserId
    /// Get the dashboard data for a specific user
    /// 
    ///  POSTS
    /// Creates a new user in the database
    /// 
    ///  PUTS
    /// Edit the users information
    /// Changes the users Avatar
    /// 
    ///  DELETES
    /// Deletes the entire user
    /// 
    /// </summary>
 
    [Route("api/[controller]")]
    [ApiController, Authorize]
    public class UserController : FirebaseEnabledController
    {
        private readonly ILogger<UserController> _logger;
        private readonly IUserRepository _repo;

        public UserController(ILogger<UserController> logger, IUserRepository repo)
        {
            _logger = logger;
            _repo = repo;
        }

        /// <summary>
        /// Gets the user by their unique FirebaseId that was given when account created
        /// </summary>
        /// <param name="firebaseId">Unique Id from Firebase</param>
        /// <returns>User Data Model</returns>
        [HttpGet("uid/{firebaseId}")]
        public IActionResult GetUserByFirebaseId(string firebaseId)
        {
            var user = _repo.GetUserByFirebaseId(firebaseId);
            if (user == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(user);
            }
        }

        /// <summary>
        /// Gets a user by their unique Id
        /// </summary>
        /// <param name="userId">Unique Id given to user on account creation</param>
        /// <returns>User Data Model</returns>
        [HttpGet("{userId}")]
        public IActionResult GetUser(Guid userId)
        {
            var user = _repo.GetUserById(userId);
            if (user == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(user);
            }
        }

        /// <summary>
        /// Gets the specific users dashboard data 
        /// </summary>
        /// <param name="userId">The unique Id of the user</param>
        /// <returns>DashboardData data model</returns>
        [HttpGet("dashboard/{userId}")]
        public IActionResult GetUsersDashboardData(Guid userId)
        {
            var dashboardData = _repo.GetUsersDashboardData(userId);
            if (dashboardData == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(dashboardData);
            }
        }

        /// <summary>
        /// Creates a new User in the database
        /// </summary>
        /// <param name="newUser">Information needed to create new user</param>
        /// <returns>Created Status Code</returns>
        [HttpPost]
        public IActionResult AddNewUserToDatabase(NewUserDTO newUser)
        {
            if (_repo.AddNewUserToDatabase(newUser))
            {
                return Created($"user/{newUser.FirstName}", newUser);
            }
            else
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Edit the users information
        /// </summary>
        /// <param name="editUserDto">The information needed to edit the user</param>
        /// <returns>Status Code Ok</returns>
        [HttpPut]
        public IActionResult EditUser(EditUserDTO editUserDto)
        {
            if (_repo.EditUser(editUserDto))
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Change the users avatar
        /// </summary>
        /// <param name="changeAvatarDTO">The information needed to change the avatar</param>
        /// <returns>Status Code Ok</returns>
        [HttpPut("changeAvatar")]
        public IActionResult ChangeAvatar(ChangeAvatarDTO changeAvatarDTO)
        {
            if (_repo.ChangeAvatar(changeAvatarDTO))
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Completely deletes user from database
        /// </summary>
        /// <param name="userId">The unique id of the user being deleted</param>
        /// <returns>Status Code OK</returns>
        [HttpDelete("{userId}")]
        public IActionResult DeleteUser(Guid userId)
        {
            _repo.DeleteUser(userId);
            return Ok();
        }

    }
}