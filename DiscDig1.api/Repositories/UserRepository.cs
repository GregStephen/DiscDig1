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

        /// <summary>
        /// Gets User data model by unique Firebase Id
        /// </summary>
        /// <param name="firebaseId">Unique Firebase Id</param>
        /// <returns>User Data Model</returns>
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

        /// <summary>
        /// Gets User data model from unique user id
        /// </summary>
        /// <param name="userId">Unique User Id</param>
        /// <returns>User Data Model</returns>
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

        /// <summary>
        /// Gets the users dashboard data from their unique id
        /// </summary>
        /// <param name="userId">Unique User Id</param>
        /// <returns>DashboardData Data Model</returns>
        public DashboardData GetUsersDashboardData(Guid userId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var dashboardData = new DashboardData();
                dashboardData.TopGenre = GetUsersTopGenre(userId);
                dashboardData.TopArtist = GetUsersTopArtist(userId);
                dashboardData.TopDecade = GetUsersTopDecade(userId);
                return dashboardData;
            }
        }


        /// <summary>
        /// Retrieves the Top Genre from users collection
        /// </summary>
        /// <param name="userId">Unique User Id</param>
        /// <returns>TopGenre Data Model</returns>
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

        /// <summary>
        /// Retrieves the top decade from users collection
        /// </summary>
        /// <param name="userId">Unique User Id</param>
        /// <returns>TopDecade Data Model</returns>
        public TopDecade GetUsersTopDecade(Guid userId)
        {
            using (var db =
                new SqlConnection(_connectionString))
                {
                var sql = @"SELECT TOP(1) (FLOOR(a.ReleaseYear/10) * 10) AS Decade, Count(*) AS TotalInCollection
                            FROM [Collection] c
                            JOIN [CollectionAlbum] ca
                            ON ca.CollectionId = c.Id
                            JOIN [Album] a
                            ON a.Id = ca.AlbumId
                            WHERE c.UserId = @userId AND c.[name] = 'Main'
                            GROUP BY FLOOR(a.ReleaseYear/ 10)
                            ORDER BY TotalInCollection DESC";
                var parameters = new { userId };
                return db.QueryFirstOrDefault<TopDecade>(sql, parameters);
            }
        }

        /// <summary>
        /// Retrieves the top Artist from users collection
        /// </summary>
        /// <param name="userId">Unique User Id</param>
        /// <returns>TopArtist Data Model</returns>
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

        /// <summary>
        /// Edits the Users name
        /// </summary>
        /// <param name="editedUser">Object {FirstName: string, LastName: string, Id: GUID}</param>
        /// <returns>True if no errors thrown</returns>
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

        /// <summary>
        /// Changes the users Avatar
        /// </summary>
        /// <param name="changeAvatarDTO">Object {Id: GUID, AvatarId: GUID}</param>
        /// <returns>True if no errors thrown</returns>
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

        /// <summary>
        /// Deletes the user and all their collections from the database
        /// </summary>
        /// <param name="userId">Unique User Id</param>
        /// <returns>True if no errors thrown</returns>
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

        /// <summary>
        /// Creates a new user in the database and creates their empty main collection
        /// </summary>
        /// <param name="newUser">Object{FirstName: string, LastName: string, FirebaseUid:GUID, AvatarId:GUID}</param>
        /// <returns>True if no errors thrown</returns>
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
