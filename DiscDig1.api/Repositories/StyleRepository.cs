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


        /// <summary>
        /// Creates a new style in the Database
        /// </summary>
        /// <param name="name">String representing style name</param>
        /// <returns>Unique style Id from created from Database</returns>
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

        /// <summary>
        /// Gets the unique style Id from its name
        /// </summary>
        /// <param name="name">String representing style name</param>
        /// <returns>Unique Style Id</returns>
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

        /// <summary>
        /// Adds the style and albums unique ids to database table
        /// </summary>
        /// <param name="albumId">Unique Album Id</param>
        /// <param name="styleName">String representing style name</param>
        /// <returns>True if no errors trown</returns>
        public bool AddStyleToAlbum(Guid albumId, string styleName)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var styleId = GetStyleIdByName(styleName);
                // if no style is found in DB, create new one
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

        /// <summary>
        /// Retrieve a list of style names from specified album
        /// </summary>
        /// <param name="albumId">Unique Album Id</param>
        /// <returns>List of strings representing style names</returns>
        public List<string> GetListOfStyleNamesForAlbum(Guid albumId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT s.Name
                            FROM AlbumStyle ast
                            JOIN Style s
                            ON ast.StyleId = s.Id
                            WHERE ast.AlbumId =  @albumId";
                var parameters = new { albumId };
                return db.Query<string>(sql, parameters).ToList();
            }
        }

    }
}
