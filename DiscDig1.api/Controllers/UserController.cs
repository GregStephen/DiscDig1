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

        [HttpDelete("{userId}")]
        public IActionResult DeleteUser(Guid userId)
        {
            _repo.DeleteUser(userId);
            return Ok();
        }

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
    }
}