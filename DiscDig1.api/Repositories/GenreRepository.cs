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
        public IEnumerable<GenreForSearch> GetAllGenresForSearch()
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT *
                            FROM [Genre]";
                return db.Query<GenreForSearch>(sql);
            }
        }
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
        public bool AddGenreToAlbum(Guid albumId, string genreName)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var genreId = GetGenreIdByName(genreName);
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
