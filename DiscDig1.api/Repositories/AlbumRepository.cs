using Dapper;
using DiscDig1.DTOS;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.Repositories
{
    public class AlbumRepository : IAlbumRepository
    {
        string _connectionString;

        public AlbumRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetValue<string>("ConnectionString");
        }

        public Guid GetAlbumIdByDiscogId(int discogId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT [Id]
                            FROM [Album]
                            WHERE [DiscogId] = @discogId";
                var parameters = new { discogId };
                var album = db.QueryFirstOrDefault<Guid>(sql, parameters);
                return album;
            }
        }
        public Guid AddNewAlbumToDatabase(NewAlbumDTO newAlbumDTO)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"INSERT INTO [Album]
                            (
                                [Title],
                                [ImgUrl],
                                [Label],
                                [Artist],
                                [ReleaseYear],
                                [DiscogId]
                            )
                            OUTPUT INSERTED.Id
                            VALUES
                            (
                                @title,
                                @imgUrl,
                                @label,
                                @artist,
                                @releaseYear,
                                @discogId
                            )";
                var parameters = new { newAlbumDTO };
                var id = db.QueryFirst<Guid>(sql, parameters);
                return id;
            }
        }
    }
}
