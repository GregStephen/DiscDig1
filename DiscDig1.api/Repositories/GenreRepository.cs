using Dapper;
using DiscDig1.DataModels;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.Repositories
{
    public class GenreRepository : IGenreRepository
    {
        string _connectionString;

        public GenreRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetValue<string>("ConnectionString");
        }

        /// <summary>
        /// Returns an IEnumerable of objects containing the genre name, id and total number of albums that are contained in a collection that match that genre
        /// </summary>
        /// <param name="regex">A regular expression searching the title or artist of albums in collection</param>
        /// <param name="id"></param>
        /// <returns>IEnumberable of objects containing the genre name, id and total number of albums</returns>
        public IEnumerable<GenreForSearch> GetAlbumsInCategories(string regex, Guid id)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT x.Id, x.Name, SUM(Total) AS TotalAlbums FROM 
                            (SELECT z.Id, z.Name, 0 as Total
                            FROM [Genre] z
                            UNION
                            SELECT g.Id, g.Name, Count(*) as Total 
                            FROM [Genre] g
                            JOIN AlbumGenre ag
                            ON g.Id = ag.GenreId
                            JOIN Album a
                            ON a.Id = ag.AlbumId
                            JOIN CollectionAlbum ca
                            ON a.Id = ca.AlbumId
                            WHERE ca.CollectionId = @id AND (a.[Title] LIKE @regex OR a.[Artist] LIKE @regex)
                            GROUP BY g.Id, g.Name) x
                            GROUP BY x.id, x.Name ";
                var parameters = new { regex, id };
                return db.Query<GenreForSearch>(sql, parameters);
            }
        }

        /// <summary>
        /// Gets the unfiltered total of albums in each genre in the specific collection
        /// </summary>
        /// <param name="collectionId">Unique Collection Id</param>
        /// <param name="genreId">Unique Genre Id</param>
        /// <returns>IEnumerable of objects containing the genre name, id and total number of albums </returns>
        public IEnumerable<GenreForSearch> GetTotalForEachGenreInCollection(Guid collectionId, Guid genreId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT x.Id, x.Name, SUM(Total) AS TotalAlbums FROM 
                            (SELECT z.Id, z.Name, 0 as Total
                            FROM [Genre] z
                            UNION
                            SELECT g.Id, g.Name, Count(*) as Total 
                            FROM [Genre] g
                            JOIN AlbumGenre ag
                            ON g.Id = ag.GenreId
                            JOIN Album a
                            ON a.Id = ag.AlbumId
                            JOIN CollectionAlbum ca
                            ON a.Id = ca.AlbumId
                            WHERE ca.CollectionId = @collectionId
                            GROUP BY g.Id, g.Name) x
                            WHERE x.Id = @genreId
                            GROUP BY x.id, x.Name ";
                var parameters = new { collectionId, genreId };
                return db.Query<GenreForSearch>(sql, parameters);
            }
        }
        /// <summary>
        /// Returns every genre that is in the database
        /// </summary>
        /// <returns>IEnumerable of objects containing genre name and id</returns>
        public IEnumerable<GenreForSearch> GetAllGenresForSearch()
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT *
                            FROM [Genre]";
                return db.Query<GenreForSearch>(sql);
            }
        }
        /// <summary>
        /// Creates a new genre in the database
        /// </summary>
        /// <param name="name">String representing genre name</param>
        /// <returns>Unique Id created by database on creation</returns>
        public Guid CreateNewGenre(string name)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"INSERT INTO [Genre]
                            (
                            [Name]
                            )
                            OUTPUT INSERTED.Id
                            VALUES
                            (
                            @name
                            )";
                var parameters = new { name };
                return db.QueryFirst<Guid>(sql, parameters);
            }
        }

        /// <summary>
        /// Retrieve the unique Genre Id by its string name
        /// </summary>
        /// <param name="name">String representing genre name</param>
        /// <returns>Unique Genre Id</returns>
        public Guid GetGenreIdByName(string name)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT [Id]
                            FROM [Genre]
                            WHERE [Name] = @name";
                var parameters = new { name };
                return db.QueryFirstOrDefault<Guid>(sql, parameters);
            }
        }
        /// <summary>
        /// Adds the genre and albums unique ids to database table
        /// </summary>
        /// <param name="albumId">Unique Album Id</param>
        /// <param name="genreName">String representation of genre name</param>
        /// <returns>True if no errors thrown</returns>
        public bool AddGenreToAlbum(Guid albumId, string genreName)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                // retrieves genres id by name given
                var genreId = GetGenreIdByName(genreName);
                // if no genre found in DB, create it
                if (genreId == default)
                {
                    genreId = CreateNewGenre(genreName);
                }
                var sql = @"INSERT INTO [AlbumGenre]
                            (
                                [AlbumId],
                                [GenreId]
                            )
                            VALUES
                            (
                                @albumId,
                                @genreId
                            )";
                var parameters = new { albumId, genreId };
                return (db.Execute(sql, parameters) == 1);
            }
        }

        /// <summary>
        /// Create a list genre names for specific album
        /// </summary>
        /// <param name="albumId">Unique Album Id</param>
        /// <returns>A list of strings representing the genre names</returns>
        public List<string> GetListOfGenreNamesForAlbum(Guid albumId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT g.Name
                            FROM AlbumGenre ag
                            JOIN Genre g
                            ON ag.GenreId = g.Id
                            WHERE ag.AlbumId =  @albumId";
                var parameters = new { albumId };
                return db.Query<string>(sql, parameters).ToList();
            }
        }
    }
}
