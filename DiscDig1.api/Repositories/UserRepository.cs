using Dapper;
using DiscDig1.DataModels;
using DiscDig1.DTOS;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.Repositories
{
    public class UserRepository : IUserRepository
    {
        string _connectionString;
        private IAvatarRepository _avatarRepo;

        public UserRepository(IConfiguration configuration, IAvatarRepository avatarRepo)
        {
            _connectionString = configuration.GetValue<string>("ConnectionString");
            _avatarRepo = avatarRepo;
        }

        public User GetUserByFirebaseId(string firebaseId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT *
                            FROM [User]
                            WHERE [FirebaseUid] = @firebaseId";
                var parameters = new { firebaseId };
                var userFromDb = db.QueryFirstOrDefault<UserDTO>(sql, parameters);
                var avatar = _avatarRepo.GetAvatarById(userFromDb.AvatarId);
                var user = new User();
                user.Avatar = avatar;
                user.DateCreated = userFromDb.DateCreated;
                user.Id = userFromDb.Id;
                user.FirstName = userFromDb.FirstName;
                user.LastName = userFromDb.LastName;
                return user;
            }
        } 

        public bool AddNewUserToDatabase(NewUserDTO newUser)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                newUser.DateCreated = DateTime.Now;
                var sql = @"INSERT INTO [User]
                            (
                             [FirstName],
                             [LastName],
                             [FirebaseUid],
                             [AvatarId],
                             [DateCreated]
                            )
                            VALUES
                            (
                            @firstName,
                            @lastName,
                            @firebaseUid,
                            @avatarId,
                            @dateCreated
                            )";
                return (db.Execute(sql, newUser) == 1);
            }
        }
    }
}
