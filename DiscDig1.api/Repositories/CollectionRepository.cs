using Dapper;
using DiscDig1.DataModels;
using DiscDig1.DTOS;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.Repositories
{
    public class CollectionRepository : ICollectionRepository
    {
        string _connectionString;
        private IAlbumRepository _albumRepo;
        private IGenreRepository _genreRepo;
        private IStyleRepository _styleRepo;

        public CollectionRepository(IConfiguration configuration, IAlbumRepository albumRepo, IGenreRepository genreRepo, IStyleRepository styleRepo)
        {
            _connectionString = configuration.GetValue<string>("ConnectionString");
            _albumRepo = albumRepo;
            _genreRepo = genreRepo;
            _styleRepo = styleRepo;
        }

        public AlbumCollection GetUsersMainCollection(Guid userId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var collection = new AlbumCollection();
                var mainId = GetUsersMainCollectionId(userId);
                collection.Id = mainId;
                collection.Name = "Main";
                var sql = @"SELECT a.*
                            FROM CollectionAlbum ca
                            JOIN Album a
                            ON ca.AlbumId = a.Id
                            WHERE ca.CollectionId = @mainId";

                var parameters = new { mainId };
                var albums = db.Query<Album>(sql, parameters).ToList();
                
                foreach (Album album in albums)
                {
                    album.Genre = _genreRepo.GetListOfGenreNamesForAlbum(album.Id);
                    album.Style = _styleRepo.GetListOfStyleNamesForAlbum(album.Id);
                }
                collection.Albums = albums;
                collection.NumberInCollection = albums.Count;
                return collection;
            }
        }

        public List<AlbumCollection> GetAllCollectionsByUserId(Guid userId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var listToReturn = new List<AlbumCollection>();
                var listOfCollectionInfo = GetAllCollectionInfoByUserId(userId);
                foreach (SubCollectionsInfo collectionInfo in listOfCollectionInfo)
                {
                    listToReturn.Add(GetUsersCollectionById(collectionInfo.Id));
                }
                return listToReturn;
            }
        }

        public IEnumerable<SubCollectionsInfo> GetAllCollectionInfoByUserId(Guid userId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT [Id], [Name]
                            FROM [Collection]
                            WHERE [userId] = @userId";
                var parameters = new { userId };
                return db.Query<SubCollectionsInfo>(sql, parameters);
            }
        }
        public string GetCollectionNameById(Guid id)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT [Name]
                            FROM [Collection]
                            WHERE [Id] = @id";
                var parameters = new { id };
                var name = db.QueryFirst<string>(sql, parameters);
                return name;
            }
        }
        public AlbumCollection GetUsersCollectionById(Guid id)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var collection = new AlbumCollection();
                collection.Id = id;
                collection.Name = GetCollectionNameById(id);
                var sql = @"SELECT a.*
                            FROM CollectionAlbum ca
                            JOIN Album a
                            ON ca.AlbumId = a.Id
                            WHERE ca.CollectionId = @id";

                var parameters = new { id };
                var albums = db.Query<Album>(sql, parameters).ToList();
                foreach (Album album in albums)
                {
                    album.Genre = _genreRepo.GetListOfGenreNamesForAlbum(album.Id);
                    album.Style = _styleRepo.GetListOfStyleNamesForAlbum(album.Id);
                }
                collection.Albums = albums;
                collection.NumberInCollection = albums.Count;
                return collection;
            }
        }

        public DiscDigPagination CreatePagination(int currentPage, int totalAlbums, int perPage)
        {
            var pagination = new DiscDigPagination();
            pagination.CurrentPage = currentPage;
            pagination.PerPage = perPage;
            pagination.TotalAlbums = totalAlbums;
            var ta = Convert.ToDecimal(totalAlbums);
            decimal totalPages = (ta / perPage);
            pagination.TotalPages = Decimal.ToInt32(Math.Ceiling( totalPages ));
            return pagination;
        }

        public AlbumCollection SearchThruCollection(string term, Guid id, string[] searchGenres, int perPage, int currentPage)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var currentStartNumber = ((perPage * currentPage) - perPage);
                var collection = new AlbumCollection();
                var sql = @"SELECT a.*
                            FROM [CollectionAlbum] ca
                            JOIN [Album] a
                            ON ca.AlbumId = a.Id
                            JOIN AlbumGenre ag
                            ON a.Id = ag.AlbumId
                            JOIN Genre g
                            ON g.Id = ag.GenreId";
                var whereStatement = " WHERE ca.CollectionId = @id ";
                var regex = "%";
                if (searchGenres.Length != 0)
                {
                    whereStatement += "AND g.id in @searchGenres";
                }
                if (term != null)
                {

                    char[] charArr = term.ToCharArray();
                    foreach (char ch in charArr)
                    {
                        regex += "[" + ch + "]";
                    }
                    regex += "%";
                    if (searchGenres.Length == 0)
                    {
                        whereStatement = " WHERE ca.CollectionId = @id AND ([Title] LIKE @regex OR [Artist] LIKE @regex)";
                    }
                    else
                    {
                        whereStatement = @" WHERE ca.CollectionId = @id AND ([Title] LIKE @regex OR [Artist] LIKE @regex)
                                            AND g.id in @searchGenres";
                    }
                }
                sql += whereStatement;

                collection.Id = id;
                collection.Name = GetCollectionNameById(id);
                var parameters = new { regex, id, searchGenres, currentStartNumber, perPage };
                var totalAlbumsForSearch = db.Query<Album>(sql, parameters).ToList();

                var orderByStatement = @"ORDER BY a.Artist ASC 
                                       OFFSET @currentStartNumber ROWS
                                       FETCH NEXT @perPage ROWS ONLY";
                sql += orderByStatement;
                var albums = db.Query<Album>(sql, parameters).ToList();
                foreach (Album album in albums)
                {
                    album.Genre = _genreRepo.GetListOfGenreNamesForAlbum(album.Id);
                    album.Style = _styleRepo.GetListOfStyleNamesForAlbum(album.Id);
                }
                var genreTotalResults = _genreRepo.GetAlbumsInCategories(regex, id);
                collection.Albums = albums;
                collection.NumberInCollection = totalAlbumsForSearch.Count;
                collection.TotalForEachGenre = genreTotalResults;
                collection.Pagination = CreatePagination(currentPage, totalAlbumsForSearch.Count, perPage);

                return collection;
            }
        }
        public bool addMainCollectionForNewUser(Guid newUserId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"INSERT INTO [Collection]
                            (
                               [UserId],
                               [Name]
                            )
                            VALUES
                            (
                                @newUserId,
                                'Main'
                            )";
                var parameters = new { newUserId };
                return (db.Execute(sql, parameters) == 1);
            }
        }

        public Guid GetUsersMainCollectionId(Guid userId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT Id
                            FROM [Collection]
                            WHERE [Name] = 'Main' AND [UserId] = @userId";
                var parameters = new { userId };
                return db.QueryFirst<Guid>(sql, parameters);
            }
        }

        public IEnumerable<SubCollectionsInfo> GetUsersSubCollections(Guid userId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT [Id], [Name]
                            FROM [Collection]
                            WHERE [UserId] = @userId AND [Name] != 'Main'";
                var parameters = new { userId };
                return db.Query<SubCollectionsInfo>(sql, parameters);
            }
        }

        public bool AddNewSubcollection(NewSubDTO newSubDTO)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"INSERT INTO [Collection]
                            ([Name],
                            [UserId])
                            VALUES
                            (
                             @SubCollectionName,
                             @UserId)";
                return (db.Execute(sql, newSubDTO) == 1);
            }
        }

        public bool AddNewAlbumToMainCollection(AlbumToCollectionDTO albumToCollectionDTO)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var album = albumToCollectionDTO.NewAlbum;
                Guid albumId;
                var albumCheck = _albumRepo.GetAlbumIdByDiscogId(album.DiscogId);
                if (albumCheck == default)
                {
                    albumId = _albumRepo.AddNewAlbumToDatabase(album);
                }
                else
                {
                    albumId = albumCheck;
                }
                var mainId = GetUsersMainCollectionId(albumToCollectionDTO.UserId);
                var sql = @"INSERT INTO [CollectionAlbum]
                        (
                            [CollectionId],
                            [AlbumId]
                        )
                            VALUES
                        (
                            @mainId,
                            @albumId
                        )";
                var parameters = new { albumId, mainId };
                return (db.Execute(sql, parameters) == 1);
            }
        }

        public bool AddAlbumsToSubcollection(AddToSubcollectionDTO addToSubcollection)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var albumId = addToSubcollection.AlbumsToAdd;
                var collectionId = addToSubcollection.CollectionId;
                List<Object> parameters = new List<Object>();
                foreach (Guid id in albumId)
                {
                    var obj = new
                    {
                        AlbumId = id,
                        CollectionId = collectionId
                    };
                    parameters.Add(obj);
                }
                var sql = @"INSERT INTO [CollectionAlbum]
                            (
                                [CollectionId],
                                [AlbumId]
                            )
                                VALUES
                            (
                                @collectionId,
                                @albumId
                            )";
                return (db.Execute(sql, parameters) >= 1);
            }
        }

        public bool CheckToSeeIfAlbumExistsInUsersMainCollectionAlready(Guid userId, int albumDiscogId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var mainId = GetUsersMainCollectionId(userId);
                var albumId = _albumRepo.GetAlbumIdByDiscogId(albumDiscogId);
                var sql = @"SELECT Id
                            FROM [CollectionAlbum]
                            WHERE [AlbumId] = @albumId AND [CollectionId] = @mainId";
                var parameters = new { mainId, albumId };
                var id = db.QueryFirstOrDefault<Guid>(sql, parameters);
                if (id == default)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
        }

        public List<Guid> GetSubCollectionIdsByUserId(Guid userId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT [Id]
                            FROM [Collection]
                            WHERE [UserId] = @userId AND [Name] != 'Main'";
                var parameters = new { userId };
                return db.Query<Guid>(sql, parameters).ToList();
            }
        }
        public bool DeleteTheseAlbumsFromTheCollection(AlbumsToDelete albumsToDelete)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var userId = GetUserIdFromCollectionId(albumsToDelete.CollectionId);
                if (albumsToDelete.CollectionId == GetUsersMainCollectionId(userId))
                {
                    var SubIds = GetSubCollectionIdsByUserId(userId);
                    var sql2 = @"DELETE
                                FROM [CollectionALbum]
                                WHERE [CollectionId] IN @SubIds AND [AlbumId] IN @deleteTheseAlbums";
                    var deleteTheseAlbums = albumsToDelete.DeleteTheseAlbums;
                    var parameters = new { SubIds, deleteTheseAlbums };
                    db.Execute(sql2, parameters);
                }
                var sql = @"DELETE
                            FROM [CollectionAlbum]
                            WHERE [CollectionId] = @collectionId AND [AlbumId] in @deleteTheseAlbums";
                return (db.Execute(sql, albumsToDelete) >= 1);
            }
        }

        public Guid GetUserIdFromCollectionId(Guid collectionId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT UserId
                            FROM [Collection]
                            WHERE Id = @collectionId";
                var parameters = new { collectionId };
                return db.QueryFirst<Guid>(sql, parameters);
            }
        }
        public IEnumerable<Guid> AlbumIdsForSubcollection(Guid id)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT AlbumId
                            FROM [CollectionAlbum]
                            WHERE CollectionId = @id";
                var parameters = new { id };
                return db.Query<Guid>(sql, parameters);
            }
        }
        public bool DeleteThisSubcollection(Guid id)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var albums = AlbumIdsForSubcollection(id);
                var deleteThese = new AlbumsToDelete();
                deleteThese.CollectionId = id;
                deleteThese.DeleteTheseAlbums = albums.ToList();
                DeleteTheseAlbumsFromTheCollection(deleteThese);
                var sql = @"DELETE
                            FROM [Collection]
                            WHERE [Id] = @id";
                var parameters = new { id };
                return (db.Execute(sql, parameters) >= 1);
            }
        }

        public bool ChangeSubCollectionName(ChangeSubNameDTO changeSubNameDTO)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"UPDATE [Collection]
                            SET [Name] = @newSubCollectionName
                            WHERE [Id] = @collectionId";
                return (db.Execute(sql, changeSubNameDTO) == 1);
            }
        }

        public bool DeleteAllUsersCollections(Guid userId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var collectionInfo = GetAllCollectionInfoByUserId(userId);
                foreach(SubCollectionsInfo collInfo in collectionInfo)
                {
                    DeleteThisSubcollection(collInfo.Id);
                }
                var sql = @"DELETE
                            FROM [Collection]
                            WHERE [UserId] = @userId";
                var parameters = new { userId };
                return (db.Execute(sql, parameters) == 1);
            }
        }
    }
}
