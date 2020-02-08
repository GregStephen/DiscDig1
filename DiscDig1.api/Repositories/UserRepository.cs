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
        private ICollectionRepository _collectionRepo;

        public UserRepository(IConfiguration configuration, IAvatarRepository avatarRepo, ICollectionRepository collectionRepo)
        {
            _connectionString = configuration.GetValue<string>("ConnectionString");
            _avatarRepo = avatarRepo;
            _collectionRepo = collectionRepo;
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

        public User GetUserById(Guid userId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT *
                            FROM [User]
                            WHERE [Id] = @userId";
                var parameters = new { userId };
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

        public DashboardData GetUsersDashboardData(Guid userId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var dashboardData = new DashboardData();
                dashboardData.TopGenre = GetUsersTopGenre(userId);
                dashboardData.TopArtist = GetUsersTopArtist(userId);
                return dashboardData;
            }
        }

        public TopGenre GetUsersTopGenre(Guid userId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT TOP(1) g.Name AS Genre, Count(*) AS TotalInCollection
                            FROM [Collection] c
                            JOIN [CollectionAlbum] ca
                            ON ca.CollectionId = c.Id
                            JOIN [Album] a
                            ON a.Id = ca.AlbumId
                            JOIN [AlbumGenre] ag
                            ON ag.AlbumId = a.Id
                            JOIN [Genre] g
                            ON g.Id = ag.GenreId
                            WHERE c.UserId = @userId AND c.[name] = 'Main'
                            GROUP BY g.Name
                            ORDER BY TotalInCollection DESC";
                var parameters = new { userId };
                return db.QueryFirstOrDefault<TopGenre>(sql, parameters);
            }
        }

        public TopArtist GetUsersTopArtist(Guid userId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT TOP(1) a.Artist, Count(*) as TotalInCollection 
                            FROM [Collection] c
                            JOIN [CollectionAlbum] ca
                            ON ca.CollectionId = c.Id
                            JOIN [Album] a
                            ON a.Id = ca.AlbumId
                            WHERE c.UserId = @userId AND c.[name] = 'Main'
                            GROUP BY a.Artist
                            ORDER BY TotalInCollection DESC";
                var parameters = new { userId };
                return db.QueryFirstOrDefault<TopArtist>(sql, parameters);
            }
        }
        public bool EditUser(EditUserDTO editedUser)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"UPDATE [User]
                            SET 
                                [FirstName] = @firstName,
                                [LastName] = @lastName
                            WHERE [Id] = @id";
                return db.Execute(sql, editedUser) == 1;
            }
        }

        public bool ChangeAvatar(ChangeAvatarDTO changeAvatarDTO)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"UPDATE [User]
                            SET
                                [AvatarId] = @avatarId
                            WHERE [Id] = @userId";
                return (db.Execute(sql, changeAvatarDTO) == 1);
            }
        }

        public bool DeleteUser(Guid userId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                _collectionRepo.DeleteAllUsersCollections(userId);
                var sql = @"DELETE [User]
                            WHERE Id = @userId";
                var parameters = new { userId };
                return db.Execute(sql, parameters) == 1;
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
                            OUTPUT INSERTED.Id
                            VALUES
                            (
                            @firstName,
                            @lastName,
                            @firebaseUid,
                            @avatarId,
                            @dateCreated
                            )";
                var userId = db.QueryFirst<Guid>(sql, newUser);

                return _collectionRepo.addMainCollectionForNewUser(userId);
            }
        }
    }
}
