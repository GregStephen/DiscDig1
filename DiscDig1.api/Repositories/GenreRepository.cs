using Dapper;
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
    }
}
