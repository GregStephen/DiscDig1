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
    public class AvatarRepository : IAvatarRepository
    {
        string _connectionString;

        public AvatarRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetValue<string>("ConnectionString");
        }

        /// <summary>
        /// Retrieves all the available Avatars
        /// </summary>
        /// <returns>IEnumerable of Avatar data models</returns>
        public IEnumerable<Avatar> GetAllAvatars()
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var avatars = db.Query<Avatar>("SELECT * FROM [Avatar]");
                return avatars;
            }
        }

        /// <summary>
        /// Retrieves one Avatar from its unique Id
        /// </summary>
        /// <param name="id">Unique Id of the Avatar needed</param>
        /// <returns>Avatar Data Model</returns>
        public Avatar GetAvatarById(Guid id)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT *
                            FROM [Avatar]
                            WHERE Id = @id";
                var parameters = new { id };
                var avatar = db.QueryFirst<Avatar>(sql, parameters);
                return avatar;
            }
        }
    }
}
