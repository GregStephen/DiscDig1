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

        /// <summary>
        /// Returns the users main collection by the unique user id
        /// </summary>
        /// <param name="userId">Unique user Id</param>
        /// <returns>Album Collection Data Model</returns>
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
                
                // adds the genre and style string to each album
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

        /// <summary>
        /// Returns a List of all Album Collection Data Models related to Users unique Id
        /// </summary>
        /// <param name="userId">Unique Id of user</param>
        /// <returns>List of Album Collection Data Models</returns>
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

        /// <summary>
        /// Returns subcollection info for an individual user related to their unique id
        /// </summary>
        /// <param name="userId">Users unique Id</param>
        /// <returns>IEnumerable of SumCollectionsInfo Data Models</returns>
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
        /// <summary>
        /// Retrieve a collections name by its unique Id
        /// </summary>
        /// <param name="id">Unique Collections Id</param>
        /// <returns>String of the name of the collection</returns>
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
        /// <summary>
        /// Retrieves album collection by its unique Id
        /// </summary>
        /// <param name="id">An albums unique Id</param>
        /// <returns>AlbumCollection Data Model</returns>
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

        /// <summary>
        /// Creates the pagination object
        /// </summary>
        /// <param name="currentPage">The current page</param>
        /// <param name="totalAlbums">The total number of albums available</param>
        /// <param name="perPage">How many results shown per page</param>
        /// <returns>DiscDigPagination data model</returns>
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


        /// <summary>
        /// Searches through the users collections with different possible parameters and returns a new AlbumCollection model that contains the albums that meet the parameters and pagination object
        /// </summary>
        /// <param name="term">The string instance of what was searched</param>
        /// <param name="id">The unique Id of the collection being searched</param>
        /// <param name="searchGenres">A list of strings for the genres that are selected</param>
        /// <param name="perPage">The integer representing the number of results contained on each page</param>
        /// <param name="currentPage">The integer representing the current page being viewed</param>
        /// <param name="sortBy">The string dictating which category {Artist, Title, Year} to sort by</param>
        /// <param name="direction">The string {ASC, DESC} which determines which way to sort the results</param>
        /// <returns>An AlbumCollection data model that fits the required parameters</returns>
        public AlbumCollection SearchThruCollection(string term, Guid id, string[] searchGenres, int perPage, int currentPage, string sortBy, string direction)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                // finds the current first item to show on the page
                var currentStartNumber = ((perPage * currentPage) - perPage);

                // creates the new collection to return
                var collection = new AlbumCollection();

                var sql = @"SELECT DISTINCT a.*
                            FROM [CollectionAlbum] ca
                            JOIN [Album] a
                            ON ca.AlbumId = a.Id";

                // generic where statement
                var whereStatement = " WHERE ca.CollectionId = @id ";

                var regex = "%";

                // if some genres were selected 
                if (searchGenres.Length != 0)
                {
                    sql += @" JOIN AlbumGenre ag
                            ON a.Id = ag.AlbumId
                            JOIN Genre g
                            ON g.Id = ag.GenreId";
                    whereStatement += "AND g.id in @searchGenres";
                }
                // if something was searched for add regex to where statement
                if (term != null)
                {
                    char[] charArr = term.ToCharArray();
                    foreach (char ch in charArr)
                    {
                        regex += "[" + ch + "]";
                    }
                    regex += "%";
                    // if no genres were specified
                    if (searchGenres.Length == 0)
                    {
                        whereStatement = " WHERE ca.CollectionId = @id AND ([Title] LIKE @regex OR [Artist] LIKE @regex)";
                    }
                    // if some genres were specified adds to where statment
                    else
                    {
                        whereStatement = @" WHERE ca.CollectionId = @id AND ([Title] LIKE @regex OR [Artist] LIKE @regex)
                                            AND g.id in @searchGenres";
                    }
                }
                // adds the where statement to the end of the sql call
                sql += whereStatement;

                collection.Id = id;
                collection.Name = GetCollectionNameById(id);
                var parameters = new { regex, id, searchGenres, currentStartNumber, perPage};

                // returns all the albums in a list before offset is added in to get total in search
                var totalAlbumsForSearch = db.Query<Album>(sql, parameters).ToList();

                // creates the order by statement from parameters given
                var orderByStatement = " ORDER by";
                if (sortBy == "Artist")
                {
                    orderByStatement += " a.Artist";
                }
                if (sortBy == "Title")
                {
                    orderByStatement += " a.Title";
                }
                if (sortBy == "Year")
                {
                    orderByStatement += " a.ReleaseYear";
                }
                if (direction == "ASC")
                {
                    orderByStatement += " ASC";
                }
                if (direction == "DESC")
                {
                    orderByStatement += " DESC";
                }

                orderByStatement += @" OFFSET @currentStartNumber ROWS
                                       FETCH NEXT @perPage ROWS ONLY";

                // adds the order by statement to the sql call
                sql += orderByStatement;

                // returns the list AFTER the offset and orderby to display correctly
                var albums = db.Query<Album>(sql, parameters).ToList();

                // adds the genre and style string for each album in the collection
                foreach (Album album in albums)
                {
                    album.Genre = _genreRepo.GetListOfGenreNamesForAlbum(album.Id);
                    album.Style = _styleRepo.GetListOfStyleNamesForAlbum(album.Id);
                }
                // gets the genre total results for the search parameters
                var genreTotalResults = _genreRepo.GetAlbumsInCategories(regex, id);

                // fills in the collection object
                collection.Albums = albums;
                collection.NumberInCollection = totalAlbumsForSearch.Count;
                collection.TotalForEachGenre = genreTotalResults;
                collection.Pagination = CreatePagination(currentPage, totalAlbumsForSearch.Count, perPage);

                return collection;
            }
        }

        /// <summary>
        /// Creates the main collection for the user when the account is created
        /// </summary>
        /// <param name="newUserId">Users Unique Id</param>
        /// <returns>True if created</returns>
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

        /// <summary>
        /// Retrieves the users main collection id by the users unique Id
        /// </summary>
        /// <param name="userId">Users Unique Id</param>
        /// <returns>Collections Unique Id</returns>
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

        /// <summary>
        /// Retrieves the users subcollection info by the users unique Id
        /// </summary>
        /// <param name="userId">Users Unique Id</param>
        /// <returns>IEnumerable of SubCollectionsInfo Data Models</returns>
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

        /// <summary>
        /// Creates a new empty subcollection 
        /// </summary>
        /// <param name="newSubDTO">Object {Name: name of subcollection, UserId: unique user id}</param>
        /// <returns>True if no issues</returns>
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
        /// <summary>
        /// Adds a new album into the users main collection.

        /// </summary>
        /// <param name="albumToCollectionDTO">Object</param>
        /// <returns>True if no errors</returns>
        public bool AddNewAlbumToMainCollection(AlbumToCollectionDTO albumToCollectionDTO)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var album = albumToCollectionDTO.NewAlbum;
                Guid albumId;
                // First checks to see if album has already been added into Discdig DB from Discog DB
                var albumCheck = _albumRepo.GetAlbumIdByDiscogId(album.DiscogId);
                if (albumCheck == default)
                {
                    // adds the album id into Discdig DB
                    albumId = _albumRepo.AddNewAlbumToDatabase(album);
                }
                else
                {
                    // sets the album id to what is returned from the check
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

        /// <summary>
        /// Add one or more albums into selected subcollection
        /// </summary>
        /// <param name="addToSubcollection">Object</param>
        /// <returns>True if no errors</returns>
        public bool AddAlbumsToSubcollection(AddToSubcollectionDTO addToSubcollection)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var albumId = addToSubcollection.AlbumsToAdd;
                var collectionId = addToSubcollection.CollectionId;
                List<Object> parameters = new List<Object>();
                // creates a new list of objects to add 
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

        /// <summary>
        /// Checks to see if album exists in the users main collection already
        /// </summary>
        /// <param name="userId">Users unique Id</param>
        /// <param name="albumDiscogId">Unique Discog Id</param>
        /// <returns>False if album is not in collection, True if album is in collection</returns>
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

        /// <summary>
        /// Retrieves list of subcollection Ids by the users unique Id
        /// </summary>
        /// <param name="userId">Unique User Id</param>
        /// <returns>List of Subcollections Unique Ids</returns>
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
        /// <summary>
        /// Deletes selected albums from a selected collection
        /// </summary>
        /// <param name="albumsToDelete">Onhect</param>
        /// <returns>True if no errors</returns>
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

        /// <summary>
        /// Retrieves the users unique Id by the unique collection Id
        /// </summary>
        /// <param name="collectionId">Unique Id</param>
        /// <returns>Users Unique Id</returns>
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

        /// <summary>
        /// Retrieves an IEnumerable of unique album Ids from a unique collection id  
        /// </summary>
        /// <param name="id">Unique Collection Id</param>
        /// <returns>IEnumerable of Unique Album Ids</returns>
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

        /// <summary>
        /// Deletes the selected subcollection
        /// </summary>
        /// <param name="id">Subcollection Unique Id</param>
        /// <returns>True if no errors thrown</returns>
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

        /// <summary>
        /// Changes the name of the selected subcollection
        /// </summary>
        /// <param name="changeSubNameDTO">Object</param>
        /// <returns>True if no errors thrown</returns>
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

        /// <summary>
        /// Deletes all of the users collections
        /// </summary>
        /// <param name="userId">Users Unique Id</param>
        /// <returns>True if no errors thrown</returns>
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
