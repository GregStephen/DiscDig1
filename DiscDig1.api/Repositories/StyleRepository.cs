using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscDig1.Repositories
{
    public class StyleRepository : IStyleRepository
    {
        string _connectionString;

        public StyleRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetValue<string>("ConnectionString");
        }

        public Guid CreateNewStyle(string name)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"INSERT INTO [Style]
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
        public Guid GetStyleIdByName(string name)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT [Id]
                            FROM [Style]
                            WHERE [Name] = @name";
                var parameters = new { name };
                return db.QueryFirstOrDefault<Guid>(sql, parameters);
            }
        }
        public bool AddStyleToAlbum(Guid albumId, string styleName)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var styleId = GetStyleIdByName(styleName);
                if (styleId == default)
                {
                    styleId = CreateNewStyle(styleName);
                }
                var sql = @"INSERT INTO [AlbumStyle]
                            (
                                [AlbumId],
                                [StyleId]
                            )
                            VALUES
                            (
                                @albumId,
                                @styleId
                            )";
                var parameters = new { albumId, styleId };
                return (db.Execute(sql, parameters) == 1);
            }
        }

    }
}
